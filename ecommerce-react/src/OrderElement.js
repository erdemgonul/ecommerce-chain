import React, { useState, useEffect } from "react";
import OrderElementChild from "./OrderElementChild";

function OrderElement({ product, deleteFromCart }) {

  return (
    <div className={"flex  border-b py-4 "}>
    

      <div className="flex flex-col ml-4 justify-between w-full">
        <div>
          <p className="text-left text-sm font-bold">
            Order Id: {product.id}
          </p>
        
          <p className="text-left text-base my-2"><b>Total Price: </b>{product.orderTotal}</p>
        </div>
        { product.products.map((product, index) => (
                <OrderElementChild
                    product={product}
                    key={index} 
                    cartIndex={index}
                />
            ))
        }
      </div>
    </div>
  );
}

export default OrderElement;
