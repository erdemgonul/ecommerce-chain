const ElasticSearchWrapper = require('../src/util/elasticsearchwrapper');
const elasticSearch = new ElasticSearchWrapper('eu-central-1', 'search-ecommercechain-hyp7yki4qclmgdb2ujpjqick7e.eu-central-1.es.amazonaws.com', 'ecommerce-product-index', 'ecommerce-product-type', true, 'ecommMaster', 'ecommErdem98@');

async function run() {
    const resp = await elasticSearch.Search({
        query: {
            match_all : {}
        }
    })

    for (let item of resp) {
        await elasticSearch.DeleteDocument(item.sku);
    }

    console.log('All deleted !');
}

run();