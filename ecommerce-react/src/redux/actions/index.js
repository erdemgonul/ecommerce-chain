export const addToCart = cartElements => ({
  type: 'ADD_TO_CART',
  cartElements
})
export const deleteFromCart = sku => ({
  type: 'DELETE_FROM_CART',
  sku
})
export const getProducts = products => ({
  type: 'GET_PRODUCTS',
  products
})
export const getCategories = categories => ({
  type: 'GET_CATEGORIES',
  categories
})
export const setCategories = categories => ({
  type: 'SET_CATEGORIES',
  categories
})
export const setClient = client => ({
  type: 'SET_SHOPIFY_CLIENT',
  client
})