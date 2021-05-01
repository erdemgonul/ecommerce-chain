import React, { useState, useEffect } from "react";
import HomeProduct from "./HomeProduct";
import axios from 'axios';
import {
  useHistory,
} from "react-router-dom";

function CategoryProducts() {
  const history = useHistory()
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getFirst();
  }, []);
  useEffect(() => {
    return history.listen(() => {
      getFirst();
    })
  }, [history]);

  async function getFirst() {
    axios.post(`http://localhost:5000/api/v1/product/get/category`, {
      "path": window.location.href.slice(window.location.href.lastIndexOf('categories/') + 11, window.location.href.length),
      "strictMode": false
    })
      .then(res => {
        setProducts(res.data.data.products);
      })
  }

  const Products = () => {
    if (products && products.length >= 1) {

      return products.map((product, index) => {
        return (
          <HomeProduct
            product={product}
            itemStyle={"flex flex-col px-2 md:px-8 mb-8  w-1/2 lg:w-1/4"}
            key={index}
            style={{ height: "250px" }}
          />
        );
      });
    } else return null;
  };

  return (
    <>
      <div className="lg:mx-20 h-full flex flex-col">
        <div className="flex">
          <div className="flex-shrink flex-grow mr-4 w-4/5">
            <div className="flex mt-10 justify-end mx-8"></div>
            <div className="flex  flex-wrap">
              <Products />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CategoryProducts;
