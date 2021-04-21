const productDAL = require('../dal/product');
const categoryBAL = require('../bal/category');

const ElasticSearchWrapper = require('../util/elasticsearchwrapper');
const elasticSearch = new ElasticSearchWrapper('eu-central-1', 'search-ecommercechain-hyp7yki4qclmgdb2ujpjqick7e.eu-central-1.es.amazonaws.com', 'ecommerce-product-index', 'ecommerce-product-type', true, 'ecommMaster', 'ecommErdem98@');

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

    async deleteProductWithId(productId, deleteFromElasticSearch=true) {
        return await productDAL.deleteProductWithId(productId, deleteFromElasticSearch);
    },

    async searchProduct(queryText, fullData = false) {
        try {
            const foundProducts = await elasticSearch.Search({
                query: {
                    multi_match: {
                        fields: ["title", "description"],
                        query: queryText,
                        type: "phrase_prefix",
                        slop: 2
                    }
                }
            })

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
    }
};

module.exports = self;
