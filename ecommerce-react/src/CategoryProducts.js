import React, { useState, useEffect } from "react";
import HomeProduct from "./HomeProduct";
import axios from 'axios';
import {
  useHistory,
} from "react-router-dom";

function CategoryProducts() {
  const history = useHistory()
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(null);
  const [valueFilter, setValueFilter] = useState({});

  const [category, setCategory] = useState("");

  useEffect(() => {
    setCategory(window.location.href.slice(window.location.href.lastIndexOf('categories/') + 11, window.location.href.length));
    getFirst();
  }, []);
  useEffect(() => {
    setCategory(window.location.href.slice(window.location.href.lastIndexOf('categories/') + 11, window.location.href.length));
    return history.listen(() => {
      setValueFilter({});
      getFirst();
    })
  }, [history]);
  function changeFilter(key, value) {
    if (value.target.name == "priceMin" || value.target.name == "priceMax") {
      value.target.value = parseFloat(value.target.value);
    }
    valueFilter[value.target.name] = parseFloat(value.target.value);
    getProductsByFilter();
  }
  async function getFirst() {
    axios.post(`http://localhost:5000/api/v1/product/get/category`, {
      "path": window.location.href.slice(window.location.href.lastIndexOf('categories/') + 11, window.location.href.length),
      "strictMode": false
    })
      .then(res => {
        setProducts(res.data.data.products);
      })

    axios.post(`http://localhost:5000/api/v1/category/get/filters`, {
      "category": window.location.href.slice(window.location.href.lastIndexOf('categories/') + 11, window.location.href.length).toLowerCase()
    })
      .then(res => {
        setFilters(res.data.data);
      })
  }

  async function getProductsByFilter() {
    if (valueFilter["priceMin"] == null) { valueFilter["priceMin"] = -1 }
    if (valueFilter["priceMax"] == null) { valueFilter["priceMax"] = -1 }
    axios.post(`http://localhost:5000/api/v1/product/get/category/filter`, {
      "category": window.location.href.slice(window.location.href.lastIndexOf('categories/') + 11, window.location.href.length).toLowerCase(),
      "fullData": true,
      "filter": valueFilter
    })
      .then(res => {
        setProducts(res.data.data.products);
      });
  }

  const Filters = () => {
    var x = [];
    if (filters) {
      for (var key of Object.keys(filters)) {
        var a = key;
        x.push(<><div className="flex flex-col items-start space-y-2">
          <label for={key}>{key}</label>
          <select className="border border-gray-600 rounded-lg" name={a} id={a} onChange={(val) => changeFilter(a, val)} value={valueFilter[a]}>
            <option value="" >Default</option>
            {filters[a].map((f, index) => { return (<option value={f}>{f}</option>); })}
          </select>
        </div>
        </>);
      }
      x.push(<><div className="flex flex-col items-start space-y-2"><label for={"priceMin"}>Minimum Price</label>
        <input type="text" name="priceMin" className="border border-gray-600 rounded-lg" onChange={(val) => changeFilter(a, val)} value={valueFilter["priceMin"]} />
      </div></>);
      x.push(<><div className="flex flex-col items-start space-y-2">
        <label for={"priceMax"}>Maximum Price</label>
        <input type="text" name="priceMax" className="border border-gray-600 rounded-lg" onChange={(val) => changeFilter(a, val)} value={valueFilter["priceMax"]} /></div></>);
    }
    return x;
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
        <div className="flex mt-4 space-x-4">
          <Filters />
        </div>
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
