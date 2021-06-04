import React, { useState, useEffect } from "react";
import HomeProduct from "./HomeProduct";
import axios from "axios";
import { Toast } from "./Toast";
import { useHistory } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

function Search() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const history = useHistory();
  const [priceDown, setPriceDown] = useState(false);

  useEffect(() => {
    return history.listen(async () => {
      await setSearchText(
        window.location.href.slice(
          window.location.href.lastIndexOf("search/") + 7,
          window.location.href.length
        )
      );
      searchProducts();
    });
  }, [history]);
  useEffect(async () => {
    await setSearchText(
      window.location.href.slice(
        window.location.href.lastIndexOf("search/") + 7,
        window.location.href.length
      )
    );
    searchProducts();
  }, []);

  async function searchProducts() {
    var x = window.location.href.slice(
      window.location.href.lastIndexOf("search/") + 7,
      window.location.href.length
    );
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/product/search`, {
        query: searchText == "" ? x : searchText,
        fullData: true,
      })
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else setProducts(res.data.data.products);
      });
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
  const sortPrice = () => {
    setPriceDown(!priceDown);
    if (priceDown) products.sort((a, b) => (a.price > b.price ? 1 : -1));
    else products.sort((a, b) => (a.price < b.price ? 1 : -1));
  };
  return (
    <div className="lg:mx-20 h-full flex flex-col">
      <div className="flex">
        <div className="flex-shrink flex-grow mr-4 w-4/5">
          <div className="flex mt-10 justify-end mx-8"></div>
          <div className="flex justify-between">
            <p className="lg:text-2xl font-bold px-2 mb-8 text-left ml-8">
              {searchText} search results
            </p>
            <button onClick={() => sortPrice()} className="flex">
              Sort By Price
              {priceDown ? <FaAngleDown size="25" /> : <FaAngleUp size="25" />}
            </button>
          </div>
          <div className="flex  flex-wrap">
            <Products />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
