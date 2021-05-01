module.exports = {
  noAuthEndpoints: ['/api/v1', '/api/v1/auth/signup', '/api/v1/auth/signin', '/api/v1/product/suggestedproducts',
    '/api/v1/category/get/subcategories', '/api/v1/category/get/details', '/api/v1/product/get/category',
    '/api/v1/product/search', '/api/v1/product/get', '/api/v1/product/get/category/filter'],
  productManagerEndpoints: ['/api/v1/product/create', '/api/v1/category/create', '/api/v1/product/delete'],
};
