import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
function CartElement({ product, deleteFromCart }) {
  const [price, setPrice] = useState("");
  useEffect(() => {
    if (product) {
      let defPrice = product.variant.price;
      if (product.discountAllocations[0]) {
        setPrice(
          parseFloat(
            product.variant.price * product.quantity -
              product.discountAllocations[0].allocatedAmount.amount
          ).toFixed(2)
        );
      } else {
        setPrice(
          parseFloat(parseFloat(defPrice) * product.quantity).toFixed(2)
        );
      }
    }
  }, [product]);
  return (
    <div className={"flex  border-b py-4 "}>
      <img
        src={product.variant.image.src}
        className="w-24 h-24"
        alt="pic.jpg"
      />

      <div className="flex flex-col ml-4 justify-between w-full">
        <div>
          <p className="text-left text-sm font-bold">
            {product.title}
          </p>
          { product.variant.title!=="Default Title" &&
            <p className="text-left text-xs my-2">
             {localStorage.getItem('lang')=='tr' ? "Beden: ":"Size: "}{product.variant.title}
            </p>
          }
          <p className="text-left text-xs my-2">{localStorage.getItem('lang')=='tr' ? "Adet: ":"Quantity: "}{product.quantity}</p>
        </div>
        <div className="flex justify-between">
          <button onClick={() => deleteFromCart(product.id)}>
            <FaTrash size={18} style={{ color: "#1F1F1F" }} />
          </button>
          <p className="flex text-left mr-4 text-gray-800">
            {product.discountAllocations[0] && (
              <>
                <p className="line-through">
                  {parseFloat(
                    parseFloat(product.variant.price) * product.quantity
                  ).toFixed(2)}
                </p>
                &nbsp;&nbsp;&nbsp;
              </>
            )}
            {} {price} TL
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartElement;
