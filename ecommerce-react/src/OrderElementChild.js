import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { Toast } from "./Toast";
function OrderElementChild({ product }) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = () => {
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/product/get`, {
        sku: product.sku,
      })
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else setImage(res.data.data.image);
      })
      .catch((err) => {
        console.log(err);
        Toast(err);
        //window.location.replace("/");
      });
  };

  return (
    <div className={"flex  border-b py-4 "}>
      <div className="flex flex-col ml-4 justify-between w-full">
        <img
          src={`data:image/jpeg;base64,${image}`}
          className="w-24 h-24"
          alt="pic.jpg"
        />
        <div>
          <p className="text-left text-base font-bold">{product.title}</p>

          <p className="text-left text-base my-2">
            <b>{"Quantity: "}</b>
            {product.quantity}
          </p>
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
