import React, { useState, useEffect } from "react";
import HomeProduct from "./HomeProduct";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {Toast} from "./Toast";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

function Products() {
  const [itemStyle, setItemStyle] = useState(
    "flex flex-col px-2 md:px-8 mb-8  w-1/2 lg:w-1/4"
  );

  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const [priceDown, setPriceDown] = useState(false);

  const location = useLocation();
  const categories = useSelector((state) => state.categories);

  useEffect(() => {
    getFirst();
  }, [location, categories]);

  async function getFirst() {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/product/suggestedproducts`
      )
      .then((res) => {
        if(res.data.error){
          Toast(res.data.error);
        }
        else setProducts(res.data.data.products);
      });
  }

  const Products = () => {
    if (products && products.length > 2) {
      return products.map((product, index) => {
        return (
          <HomeProduct
            product={product}
            itemStyle={itemStyle}
            key={index}
            style={{ height: "250px" }}
          />
        );
      });
    } else return null;
  };

  const sortPrice = () => {
    setPriceDown(!priceDown);
    if (priceDown) products.sort((a, b) => (a.price > b.price ? 1 : -1));
    else products.sort((a, b) => (a.price < b.price ? 1 : -1));
  };

  return (
    <>
      <div className="lg:mx-20 h-full flex flex-col">
        <div className="flex">
          <div className="flex-shrink flex-grow mr-4 w-4/5">
            <div className="flex mt-10 justify-end mx-8 my-4">
              <button onClick={() => sortPrice()} className="flex">
                Sort By Price
                {priceDown ? (
                  <FaAngleDown size="25" />
                ) : (
                  <FaAngleUp size="25" />
                )}
              </button>
            </div>
            <div className="flex  flex-wrap">
              <Products />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
