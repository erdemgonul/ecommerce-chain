import { combineReducers } from "redux";
export const cartReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return action.cartElements;
    default:
      return state;
  }
};

export const productReducer = (state = [], action) => {
  switch (action.type) {
    case "GET_PRODUCTS":
      return action.products;
    default:
      return state;
  }
};
export const categoryReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return action.categories;
    default:
      return state;
  }
};
export const clientReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_SHOPIFY_CLIENT":
      return action.client;
    default:
      return state;
  }
};
export const rootReducer = combineReducers({
  cart: cartReducer,
  products: productReducer,
  client: clientReducer,
  categories:categoryReducer
});
