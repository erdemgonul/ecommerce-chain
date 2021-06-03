const productDAL = require('../dal/product');
const categoryBAL = require('./category');
const invoiceBAL = require('./invoice');
const userLog = require('./userlog');
const util = require('../util/index');
const ElasticSearchWrapper = require('../common/elasticsearchwrapper');
const orderBAL = require('./order');

const moment = require('moment')

const elasticSearch = new ElasticSearchWrapper(process.env.ELASTIC_SEARCH_REGION, process.env.ELASTIC_SEARCH_DOMAIN, process.env.ELASTIC_SEARCH_PRODUCT_INDEX, process.env.ELASTIC_SEARCH_PRODUCT_INDEXTYPE, true, process.env.ELASTIC_SEARCH_USERNAME, process.env.ELASTIC_SEARCH_PASSWORD);

const self = {
    async createProduct(sku, title, description, image, quantity, price, product_details, shipping_details, categories, sellerId) {
        // check if product with id exists or not
        const productIdExists = await productDAL.isProductIdExists(sku);

        for (const category of categories) {
            const categoryExist = await categoryBAL.isCategoryExists(category);

            if (!categoryExist) {
                return {error: `Category with path ${category} does not exists !`};
            }
        }

        if (productIdExists) {
            return {error: 'Product with given product id already exists !'};
        }

        const createdProduct = await productDAL.createProduct(sku, title, description, image, quantity, price, product_details, shipping_details, categories, sellerId);

        if (createdProduct && createdProduct.sku) {
            try {
                await self.updateProductOnElasticSearch(createdProduct);
            } catch (err) {
                return {error: 'Elastic search error !'};
            }

            return createdProduct;
        }
        return {error: 'Product creation error !'};
    },

    async updateProductOnElasticSearch(productObj) {
        const flattenedProduct = util.flattenObject(productObj);
        flattenedProduct.categories = flattenedProduct.categories.join(',');
        await elasticSearch.AddNewDocument(flattenedProduct, flattenedProduct.sku);
    },

    async getAllProducts() {
        // check if product with id exists or not
        const allProducts = await productDAL.getAllProducts();
        return allProducts;
    },

    async getQuantityOfProduct(sku) {
        // check if product with id exists or not
        return await productDAL.getQuantityOfProduct(sku);
    },

    async subtractQuantityFromProduct(sku, quantity) {
        // check if product with id exists or not
        return await productDAL.subtractQuantityFromProduct(sku, quantity);
    },

    _addCategoriesToInterestedCategories(categories, interestedCategories, weight) {
        for (let category of categories) {
            if (interestedCategories.has(category)) {
                const newValue = interestedCategories.get(category) + weight;
                interestedCategories.set(category, newValue);
            } else {
                interestedCategories.set(category, weight)
            }
        }
    },

    async getSuggestedProducts(userId) {
        // TODO-E: RECOMMEND MAX 20 ITEMS

        let logsOfUser;

        if (userId)
            logsOfUser = await userLog.getUserLogsByUserId(userId);

        if (logsOfUser && logsOfUser.length >= 5) {
            const interestedCategories = new Map();
            let suggestedProducts = [];
            let recommendedCategoryCount = 0;
            let willSuggest = false;

            for (let log of logsOfUser) {
                let weight = 0;
                let logData = log.logData.productCategories;
                const logTimeDiff = moment.utc().diff(log.logDate, 'hours');

                if (log.logType === userLog.LogType.VIEW_PRODUCT) {
                    weight = 1;

                    if (logTimeDiff <= 1) {
                        weight = 2;
                    }
                } else if (log.logType === userLog.LogType.PLACE_ORDER) {
                    weight = 10;
                } else if (log.logType === userLog.LogType.VIEW_CATEGORY) {
                    logData = [log.logData.category]
                    weight = 2;

                    if (logTimeDiff <= 1) {
                        weight = 4;
                    }
                } else if (log.logType === userLog.LogType.PRODUCT_COMMENT) {
                    weight = 3;

                    if (logTimeDiff <= 1) {
                        weight = 5;
                    }
                }

                if (weight > 0)
                    self._addCategoriesToInterestedCategories(logData, interestedCategories, weight);
            }

            const interestedCategoriesSorted = new Map([...interestedCategories].sort(([k, v], [k2, v2])=> {
                if (v  > v2) {
                    return -1;
                }

                if (v < v2) {
                    return 1;
                }

                return 0;
            }));

            const productsInCategoryPromiseArray = [];

            for (let [category, categoryScore] of interestedCategoriesSorted) {
                console.log(category + ' = ' + categoryScore)

                if (recommendedCategoryCount >= 5)
                    break;

                if (categoryScore >= 10) {
                    recommendedCategoryCount++;
                    willSuggest = true;
                    productsInCategoryPromiseArray.push(self.getAllProductsInCategory(category, true, true));
                }
            }

            suggestedProducts = (await Promise.all(productsInCategoryPromiseArray));
            suggestedProducts = [].concat.apply([], suggestedProducts);

            /*
            for (let recommendedProduct of productsToRecommend) {
                if (!suggestedProducts.includes(recommendedProduct))
                    suggestedProducts.push(...productsToRecommend);
            } */

            if (willSuggest) {
                if (suggestedProducts.length < 8) {
                    // Add some products that are not recommended to keep frontpage full
                    const amountToFill = 8 - suggestedProducts.length;
                    const excludeList = suggestedProducts.map(product => product.sku);
                    const productsToFill = await productDAL.getSuggestedProducts(amountToFill, excludeList, true);

                    // console.log(productsToFill.map(product => product.title), suggestedProducts.length)

                    return [...suggestedProducts, ...productsToFill];
                }

                return suggestedProducts;
            }
        }

        return await productDAL.getSuggestedProducts(8);
    },

    async _cancelNonPaidOrders(productId) {
        const ordersContainingProduct = await orderBAL.getOrdersOfContainingProduct(productId, true);

        if (ordersContainingProduct && ordersContainingProduct.length) {
            for (let order of ordersContainingProduct) {
                const cancelResponse = await orderBAL.cancelOrder(order.id);

                if (cancelResponse.error) {
                    return cancelResponse;
                }
            }
        }
    },

    async deleteProductWithId(productId, deleteFromElasticSearch = true) {
        const deleteProductResponse = await productDAL.deleteProductWithId(productId, deleteFromElasticSearch);

        if (!deleteProductResponse) {
            return {error: 'Product deletion failed!'};
        }

        const cancelOrderResponse = await self._cancelNonPaidOrders(productId);

        if (cancelOrderResponse.error) {
            return {error: 'Order cancellation failed !'};
        }

        return true;
    },

    async updateProductDetails(payload) {
        const detailsToChange = payload;
        const productId = payload.sku;

        delete detailsToChange.productId;

        if (detailsToChange && Object.keys(detailsToChange).length === 0 && detailsToChange.constructor === Object) {
            return {error: 'Invalid change request !'};
        }

        const updateResult = await productDAL.updateProductDetails(productId, detailsToChange);

        if (!updateResult) {
            return {error: 'Product update failed!'};
        }

        try {
            await self.updateProductOnElasticSearch(updateResult);
        } catch (err) {
            return {error: 'Elastic search error !'};
        }

        const cancelOrderResponse = await self._cancelNonPaidOrders(productId);

        if (cancelOrderResponse.error) {
            return {error: 'Order cancellation failed !'};
        }

        return updateResult;
    },

    async filterProductsInCategory(categoryText, filter, fullData = false) {
        try {
            let foundProducts;

            const esQuery = {
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    categories: `*${categoryText.replace(/\//g, '//')}*`
                                }
                            },
                            {
                                match_phrase: {
                                    categories: categoryText.replace(/\//g, '//')
                                }
                            }],
                    }
                }
            };

            if (filter.sortBy) {
                const sortByValue = filter.sortBy.toLowerCase();
                const splotField = sortByValue.split('_');
                let fieldName = splotField[0]

                if (fieldName === 'score') {
                  fieldName = '_score'
                }

                const sortOrder = splotField[1];

                const objectToSort = {};
                objectToSort[fieldName] = {order: sortOrder}

                esQuery.sort = [objectToSort];

                delete filter.sortBy;
            }

            if (Object.keys(filter).includes('priceMin') && Object.keys(filter).includes('priceMax')) {
                const priceQuery = {
                    range: {
                        price: {}
                    }
                };

                if (filter.priceMax !== -1) {
                    priceQuery.range.price.lte = filter.priceMax;
                }
                if (filter.priceMin !== -1) {
                    priceQuery.range.price.gte = filter.priceMin;
                }

                esQuery.query.bool.must.push(priceQuery);

                delete filter.priceMin;
                delete filter.priceMax;
            }

            for (const key of Object.keys(filter)) {
                if (!filter[key]) {
                    continue;
                }

                const obj = {
                    match_phrase: {}
                };

                obj.match_phrase[`productDetails_${key}`] = `*${filter[key]}*`;
                esQuery.query.bool.must.push(obj);
            }

            foundProducts = await elasticSearch.Search(
                esQuery
            );

            if (fullData) {
                const productsWithFullData = [];

                for (const product of foundProducts) {
                    const fullProduct = await this.getProductByProductId(product.sku);
                    productsWithFullData.push(fullProduct);
                }

                return productsWithFullData;
            }

            return foundProducts;
        } catch (err) {
            console.log('Elastic Search Error: ', err);
            return '';
        }
    },

    async searchProduct(queryText, filter, fullData = false) {
        try {
            let foundProducts;

            if (filter) {
                const esQuery = {
                    query: {
                        bool: {
                            must: [],
                            should: [
                                {
                                    match: {
                                        title: {
                                            query: queryText,
                                            fuzziness: 2,
                                            prefix_length: 1,
                                        }
                                    }
                                },
                                {
                                    match: {
                                        description: {
                                            query: queryText,
                                            fuzziness: 2,
                                            prefix_length: 1
                                        }
                                    }
                                }
                            ],
                            minimum_should_match: 1,
                        }
                    }
                };

                if (Object.keys(filter).includes('priceMin') && Object.keys(filter).includes('priceMax')) {
                    const priceQuery = {
                        range: {
                            price: {}
                        }
                    };

                    if (filter.priceMax !== -1) {
                        priceQuery.range.price.lte = filter.priceMax;
                    }
                    if (filter.priceMin !== -1) {
                        priceQuery.range.price.gte = filter.priceMin;
                    }

                    esQuery.query.bool.must.push(priceQuery);

                    delete filter.priceMin;
                    delete filter.priceMax;
                }

                if (filter.sortBy) {
                    const sortByValue = filter.sortBy.toLowerCase();
                    const splotField = sortByValue.split('_');
                    let fieldName = splotField[0]

                    if (fieldName === 'score') {
                        fieldName = '_score'
                    }

                    const sortOrder = splotField[1];

                    const objectToSort = {};
                    objectToSort[fieldName] = {order: sortOrder}

                    esQuery.sort = [objectToSort];

                    delete filter.sortBy;
                }

                for (const key of Object.keys(filter)) {
                    if (!filter[key]) {
                        continue;
                    }

                    const obj = {
                        match_phrase: {}
                    };

                    obj.match_phrase[`productDetails_${key}`] = `*${filter[key]}*`;
                    esQuery.query.bool.must.push(obj);
                }

                foundProducts = await elasticSearch.Search(
                    esQuery
                );
            } else {
                /*
                        foundProducts = await elasticSearch.Search({
                            query: {
                                multi_match: {
                                    fields: ["title", "description"],
                                    query: queryText,
                                    type: "phrase_prefix",
                                    slop: 2
                                }
                            }
                        }) */

                foundProducts = await elasticSearch.Search({
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        title: {
                                            query: queryText,
                                            fuzziness: 2,
                                            prefix_length: 1
                                        }
                                    }
                                },
                                {
                                    match: {
                                        description: {
                                            query: queryText,
                                            fuzziness: 2,
                                            prefix_length: 1
                                        }
                                    }
                                }
                            ],
                            minimum_should_match: 1,
                        }
                    }
                });
            }

            if (fullData) {
                const productsWithFullData = [];

                for (const product of foundProducts) {
                    const fullProduct = await this.getProductByProductId(product.sku);
                    productsWithFullData.push(fullProduct);
                }

                return productsWithFullData;
            }

            return foundProducts;
        } catch (err) {
            console.log('Elastic Search Error: ', err);
            return '';
        }
    },

    async getProductByProductId(productId, userId, shouldLog, projectionExpression) {
        const productDetails = await productDAL.getProductByProductId(productId, projectionExpression);

        if (!productDetails) {
            return {error: 'Product not found !'};
        }

        const purchasedBefore = await invoiceBAL.isInvoiceExistForProduct(userId, productId);
        productDetails.purchasedBefore = purchasedBefore;

        delete productDetails._id;
        delete productDetails.__v;

        if (shouldLog && userId) {
            const productViewLog = {
                productId: productId,
                productCategories: productDetails.categories
            }

            await userLog.createUserLog(userId, userLog.LogType.VIEW_PRODUCT, productViewLog)
        }

        return productDetails;
    },

    async getAllProductsInCategory(category, strictMode, filterZeroQuantity, userId, shouldLog) {
        // check if product with id exists or not
        const allProducts = await productDAL.getAllProductsInCategory(category, strictMode, filterZeroQuantity);

        if (shouldLog && category.includes('/') && allProducts.length) {
            console.warn(category)

            const categoryLog = {
                category: category,
            }

            await userLog.createUserLog(userId, userLog.LogType.VIEW_CATEGORY, categoryLog)
         }

        return allProducts;
    }
};

module.exports = self;
