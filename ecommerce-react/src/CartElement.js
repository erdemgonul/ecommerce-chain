import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
function CartElement({ product, deleteFromCart }) {
  const [price, setPrice] = useState("");
  const [x, setX] = useState(product);
  return (
    <div className={"flex  border-b py-4 "}>

      <img
        src={`data:image/jpeg;base64,${product.product.image}`}
        className="w-24 h-24"
        alt="pic.jpg"
      />

      <div className="flex flex-col ml-4 justify-between w-full">
        <div>
          <p className="text-left text-sm font-bold">
            {product.product.title}
          </p>

          <p className="text-left text-xs my-2">{"Quantity: "}{product.number}</p>
        </div>
        <div className="flex justify-between">
          <button onClick={() => deleteFromCart(x.product.sku)}>
            <FaTrash size={18} style={{ color: "#1F1F1F" }} />
          </button>
          <p className="flex text-left mr-4 text-gray-800">

            { } {product.product.price} TL
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartElement;
