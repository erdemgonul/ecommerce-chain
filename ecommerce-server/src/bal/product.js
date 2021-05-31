const productDAL = require('../dal/product');
const categoryBAL = require('./category');
const userLog = require('./userlog');
const util = require('../util/index');
const ElasticSearchWrapper = require('../common/elasticsearchwrapper');

const elasticSearch = new ElasticSearchWrapper(process.env.ELASTIC_SEARCH_REGION, process.env.ELASTIC_SEARCH_DOMAIN, process.env.ELASTIC_SEARCH_PRODUCT_INDEX, process.env.ELASTIC_SEARCH_PRODUCT_INDEXTYPE, true, process.env.ELASTIC_SEARCH_USERNAME, process.env.ELASTIC_SEARCH_PASSWORD);

const self = {
    async createProduct(sku, title, description, image, quantity, price, product_details, shipping_details, categories) {
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

        const createdProduct = await productDAL.createProduct(sku, title, description, image, quantity, price, product_details, shipping_details, categories);

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
        const logsOfUser = await userLog.getUserLogsByUserId(userId);

        if (logsOfUser && logsOfUser.length >= 10) {
            const interestedCategories = new Map();
            const suggestedProducts = [];

            for (let log of logsOfUser) {
                if (log.logType === userLog.LogType.VIEW_PRODUCT) {
                    self._addCategoriesToInterestedCategories(log.logData.productCategories, interestedCategories, 1);
                } else if (log.logType === userLog.LogType.PLACE_ORDER) {
                    self._addCategoriesToInterestedCategories(log.logData.productCategories, interestedCategories, 5);
                }
            }

            for (let [category, categoryScore] of interestedCategories) {
                console.log(category + ' = ' + categoryScore)

                if (categoryScore >= 5) {
                    const productsInCategory = await this.getAllProductsInCategory(category, true, true);

                    for (let recommendedProduct of productsInCategory) {
                        if (!suggestedProducts.includes(recommendedProduct))
                            suggestedProducts.push(...productsInCategory);
                    }
                }
            }

            return suggestedProducts;
        }

        return await productDAL.getSuggestedProducts();
    },

    async deleteProductWithId(productId, deleteFromElasticSearch = true) {
        return await productDAL.deleteProductWithId(productId, deleteFromElasticSearch);
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

    async getProductByProductId(productId, userId, shouldLog) {
        const productDetails = await productDAL.getProductByProductId(productId);

        if (!productDetails) {
            return {error: 'Product not found !'};
        }

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

    async getAllProductsInCategory(category, strictMode, filterZeroQuantity) {
        // check if product with id exists or not
        const allProducts = await productDAL.getAllProductsInCategory(category, strictMode, filterZeroQuantity);
        return allProducts;
    },
};

module.exports = self;
