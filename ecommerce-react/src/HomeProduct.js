import React from "react";
import { useHistory } from "react-router-dom";
import "../src/product.css";
function HomeProduct({ product, itemStyle }) {
  const history = useHistory();

  return (
    <div className={itemStyle}>
      <button onClick={() => routeWithParams()} className="relative">
        <img
          src={product.images[0].src}
          id={
            itemStyle === "flex flex-col px-2 md:px-8 mb-8  w-1/2 lg:w-1/4"
              ? "imgA"
              : ""
          }
          className="mx-auto"
          alt="imageFile"
        />
        <p className="mx-auto md:mx-0 mt-1 md:mt-4">{product.title}</p>
        <p className="mx-auto md:mx-0 mt-1 md:mt-4 text-gray-600">
          {product.variants[0].price} TL
        </p>
      </button>
    </div>
  );

  function routeWithParams() {
    history.push({
      pathname: "/product",
      search: "?name=" + product.handle,
    });
      window.scrollTo(0, 0)

  }
}

export default HomeProduct;
