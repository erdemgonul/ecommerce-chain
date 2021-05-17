require('dotenv').config({path:'../.env'});
const ElasticSearchWrapper = require('../src/common/elasticsearchwrapper');
const elasticSearch = new ElasticSearchWrapper(process.env.ELASTIC_SEARCH_REGION, process.env.ELASTIC_SEARCH_DOMAIN, process.env.ELASTIC_SEARCH_PRODUCT_INDEX, process.env.ELASTIC_SEARCH_PRODUCT_INDEXTYPE, true, process.env.ELASTIC_SEARCH_USERNAME, process.env.ELASTIC_SEARCH_PASSWORD);
const productBAL = require('../src/bal/product')
const util = require('../src/util');

async function deleteAllFromElasticSearch() {
    const resp = await getAllProductsFromElasticSearch();

    for (let item of resp) {
        await elasticSearch.DeleteDocument(item.sku);
        console.log('Deleting: ' + item.sku)
    }

    console.log('All deleted !');
}

async function getAllProductsFromElasticSearch() {
    const resp = await elasticSearch.Search({
        query: {
            match_all : {}
        }
    })

    console.log(resp)

    return resp;
}

async function rebuildProductDataFromDatabase() {
    await deleteAllFromElasticSearch();

    const allProducts = await productBAL.getAllProducts();

    for (let productObj of allProducts) {
        await productBAL.updateProductOnElasticSearch(productObj);
        console.log('Added product: ' + productObj.title)
    }

    console.log('Done')
}

rebuildProductDataFromDatabase()
