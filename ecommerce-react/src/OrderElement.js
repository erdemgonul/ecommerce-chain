import React, { useState, useEffect } from "react";
import OrderElementChild from "./OrderElementChild";
import axios from "axios";
import { Toast } from "./Toast";

function OrderElement({ product, deleteFromCart }) {
  const makePayment = () => {
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/order/finish`, {
        orderId: product.id,
      })
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else console.log("wtf", res.data.data);
      })
      .catch((err) => {
        console.log(err);
        Toast(err);
        window.location.replace("/");
      });
  };

  return (
    <div className={"flex  border-b py-4 "}>
      <div className="flex flex-col ml-4 justify-between w-full">
        <div className="items-start justify-start">
          <p className="text-left text-sm font-bold">Order Id: {product.id}</p>

          <p className="text-left text-base my-2">
            <b>Total Price: </b>
            {product.orderTotal}
          </p>
          <p className="text-left text-base my-2">
            <b>Order Status: </b>
            {product.status == "ORDER_PLACED"
              ? "Waiting For Payment"
              : product.status}
          </p>
          {product.status == "ORDER_PLACED" && (
            <button
              className="text-left bg-green-500 text-white px-2 py-1"
              onClick={() => makePayment()}
            >
              Make Payment
            </button>
          )}
        </div>
        {product.products.map((product, index) => (
          <OrderElementChild product={product} key={index} cartIndex={index} />
        ))}
      </div>
    </div>
  );
}

export default OrderElement;
