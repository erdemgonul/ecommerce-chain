const productDAL = require('../dal/product');
const categoryBAL = require('../bal/category');

const ElasticSearchWrapper = require('../util/elasticsearchwrapper');
const elasticSearch = new ElasticSearchWrapper(process.env.ELASTIC_SEARCH_REGION, process.env.ELASTIC_SEARCH_DOMAIN, process.env.ELASTIC_SEARCH_PRODUCT_INDEX, process.env.ELASTIC_SEARCH_PRODUCT_INDEXTYPE, true, process.env.ELASTIC_SEARCH_USERNAME, process.env.ELASTIC_SEARCH_PASSWORD);

const self = {
    async createProduct(sku, title, description, image, quantity, price, product_details, shipping_details, categories) {
        // check if product with id exists or not
        const productIdExists = await productDAL.isProductIdExists(sku);

        for (let category of categories) {
            const categoryExist = await categoryBAL.isCategoryExists(category);

            if (!categoryExist) {
                return {error: `Category with path ${category} does not exists !`};
            }
        }

        if (productIdExists) {
            return {error: 'Product with given product id already exists !'};
        }

        return await productDAL.createProduct(sku, title, description, image, quantity, price, product_details, shipping_details, categories);
    },

    async getAllProducts() {
        // check if product with id exists or not
        const allProducts = await productDAL.getAllProducts();
        return allProducts;
    },

    async getSuggestedProducts() {
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
                                    categories: '*' + categoryText.replace(/\//g, '//') + '*'
                                }
                            },
                            {
                                match_phrase: {
                                    categories: categoryText.replace(/\//g, '//')
                                }
                            }],
                    }
                }
            }

            if (Object.keys(filter).includes("priceMin") && Object.keys(filter).includes("priceMax")) {
                const priceQuery = {
                    range: {
                        price: {}
                    }
                }

                if (filter.priceMax !== -1) {
                    priceQuery.range.price.lte = filter.priceMax;
                }
                if (filter.priceMin !== -1) {
                    priceQuery.range.price.gte = filter.priceMin;
                }

                esQuery.query.bool.must.push(priceQuery);
            }

            for (let key of Object.keys(filter)) {
                if (key === 'priceMin' || key === 'priceMax' || !filter[key]) {
                    continue
                }

                const obj = {
                    match_phrase: {}
                }

                obj.match_phrase[`productDetails_${key}`] = "*" + filter[key] + "*"
                esQuery.query.bool.must.push(obj);
            }
            console.log(JSON.stringify(esQuery, null, 2))

            foundProducts = await elasticSearch.Search(
                esQuery
            )

            if (fullData) {
                const productsWithFullData = [];

                for (let product of foundProducts) {
                    const fullProduct = await this.getProductByProductId(product.sku);
                    productsWithFullData.push(fullProduct);
                }

                return productsWithFullData;
            }

            return foundProducts;
        } catch (err) {
            console.log('Elastic Search Error: ', err)
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
                }

                for (let key of Object.keys(filter)) {
                    if (key === 'priceMin' || key === 'priceMax' || !filter[key]) {
                        continue
                    }

                    const obj = {
                        match_phrase: {}
                    }

                    obj.match_phrase[`productDetails_${key}`] = "*" + filter[key] + "*"
                    esQuery.query.bool.must.push(obj);
                }

                foundProducts = await elasticSearch.Search(
                    esQuery
                )
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
                })
            }

            if (fullData) {
                const productsWithFullData = [];

                for (let product of foundProducts) {
                    const fullProduct = await this.getProductByProductId(product.sku);
                    productsWithFullData.push(fullProduct);
                }

                return productsWithFullData;
            }

            return foundProducts;
        } catch (err) {
            console.log('Elastic Search Error: ', err)
            return '';
        }
    },

    async getProductByProductId(productId) {
        const productDetails = await productDAL.getProductByProductId(productId);

        if (productDetails) {
            delete productDetails._id;
            delete productDetails.__v;

            return productDetails;
        }
        return {error: 'Product not found !'};
    },

    async getAllProductsInCategory(category, strictMode) {
        // check if product with id exists or not
        const allProducts = await productDAL.getAllProductsInCategory(category, strictMode);
        return allProducts;
    },
};

module.exports = self;
