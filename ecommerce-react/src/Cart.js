import React, { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import CartElement from "./CartElement";
import { useDispatch } from "react-redux";
import { addToCart } from "./redux/actions/index";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart({ closeCart }) {
  const history = useHistory();
  const dispatch = useDispatch();

 

  return (
<></>
  );

  async function proceedCheckout() {
    
  }

  function ifCartHasFree(cartItems) { }
  function deleteFromCart(itemID) {
  }
}

export default Cart;
