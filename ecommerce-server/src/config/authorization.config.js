module.exports = {
  noAuthEndpoints: ['/api/v1', '/api/v1/auth/signup', '/api/v1/auth/signin', '/api/v1/product/suggestedproducts',
    '/api/v1/category/get/subcategories', '/api/v1/category/get/details', '/api/v1/product/get/category',
    '/api/v1/product/search', '/api/v1/product/get', '/api/v1/product/get/category/filter', '/api/v1/category/get/all', '/api/v1/category/get/filters', '/api/v1/auth/twofactorauth/verify'
  ,'/api/v1/comment/get/approved/all'],
  productManagerEndpoints: ['/api/v1/product/edit', '/api/v1/comment/approve', '/api/v1/product/create', '/api/v1/category/create', '/api/v1/product/delete', '/api/v1/comment/get/all', '/api/v1/comment/get/nonapproved/all'],
  salesManagerEndpoints: ['/api/v1/invoice/get/every', '/api/v1/order/edit', '/api/v1/order/cancel','/api/v1/campaign/delete','/api/v1/campaign/create'],
};
