import React, { useState, useEffect } from "react";
import { MdViewModule, MdViewStream } from "react-icons/md";
import { FaLock, FaShippingFast } from "react-icons/fa";
import HomeProduct from "./HomeProduct";
import { useLocation } from "react-router";
import queryString from "query-string";
import { useSelector, useDispatch } from "react-redux";
import { getProducts } from "./redux/actions";
import axios from 'axios';


function Products() {
  const dispatch = useDispatch();

  const [itemStyle, setItemStyle] = useState(
    "flex flex-col px-2 md:px-8 mb-8  w-1/2 lg:w-1/4"
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [isSecond, setSecond] = useState(false);
  const [isThird, setThird] = useState(false);

  const [products, setProducts] = useState([]);

  const [newProducts, setNewProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);



  const [pageDescription, setPageDescription] = useState("");

  const location = useLocation();
  const categories = useSelector((state) => state.categories);

  useEffect(() => {  
        getFirst();

  }, [location, categories]);

  async function getFirst() {
    axios.get(`http://localhost:5000/api/v1/product/suggestedproducts`)
    .then(res => {
      
      setProducts(res.data);
      console.log(products);
    })
  }
  
  function filter(isGrid) {
    isGrid
      ? setItemStyle("flex flex-col px-2 md:px-8 mb-8  w-1/2 lg:w-1/4")
      : setItemStyle("flex flex-col px-8 mb-8 w-full");
  }

  const Products = () => {
    if (products.length > 2) {
     

      return products.map((product, index) => {
        return (
          <HomeProduct
            product={product}
            imageUrl={"../pic.jpg"}
            itemStyle={itemStyle}
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

export default Products;
