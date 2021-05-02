import React, { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import CartElement from "./CartElement";
import { useDispatch } from "react-redux";
import { addToCart } from "./redux/actions/index";
import { deleteFromCart } from "./redux/actions/index";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart({ closeCart }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const cart = useSelector((state) => state.cart);
  const CartProducts = () => {
    if (cart) {
      return cart.map((product, index) => (
        <CartElement
          product={product}
          key={index}
          cartIndex={index}
          deleteFromCart={(e) => deleteFromCarty(e)}
        />
      ));
    }
    return null;
  };


  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="bg-gray-100 h-full w-full border-l flex flex-col mr-4 px-4">
          <div className="border-b flex justify-between w-full py-8 h-12 items-center">
            <div className="flex items-center">
              <FaShoppingCart size={20} />
              <p className="text-lg ml-4">{"My Cart"}</p>
            </div>

            <button onClick={() => closeCart()}>
              <BsX size={25} />
            </button>
          </div>

          <div className="flex-grow flex-shrink overflow-y-auto pt-4 px-4">
            {<CartProducts />}
          </div>

          <div className="w-full flex flex-col border-t pt-6 px-2">
            <div className="justify-between flex px-2 mb-6 items-center">
              <p className="text-sm font-medium"> {"Total"}</p>
              <p className="flex text-left mr-4 text-gray-800">

                {totalPrice} TL
            </p>
            </div>
            <button
              className="bg-indigo-600 w-full hover:bg-purple-900 text-white font-medium text-sm py-3 px-4 rounded-sm mb-2"
              onClick={() => proceedCheckout()}
            >
              {"ORDER"}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  async function proceedCheckout() {

  }

  function ifCartHasFree(cartItems) { }
  function deleteFromCarty(sku) {
    dispatch(deleteFromCart(sku));

  }
}

export default Cart;
