import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
function OrderElementChild({ product }) {

  return (
    <div className={"flex  border-b py-4 "}>




      <div className="flex flex-col ml-4 justify-between w-full">
        <div>
          <p className="text-left text-base font-bold">
            {product.title}
          </p>

          <p className="text-left text-base my-2"><b>{"Quantity: "}</b>{product.quantity}</p>
        </div>
        <div className="flex justify-between">

          <p className="flex text-left mr-4 text-gray-800">

            <b> {product.quantity * product.unitPrice} TL </b>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderElementChild;
