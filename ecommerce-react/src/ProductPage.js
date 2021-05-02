import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import queryString from "query-string";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart } from "./redux/actions/index";
import "./product.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

function ProductPage() {
  const [product, setProduct] = useState(null);

  const [productBuyQuantity, setProductBuyQuantity] = useState(1);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    let parsedQuery = queryString.parse(location.search);
    axios.post(`http://localhost:5000/api/v1/product/get`, { sku: parsedQuery.sku })
      .then(res => {
        setProduct(res.data.data);
      })
  }, [location]);

  function updateQuantity(quantity) {
    if (
      (productBuyQuantity >= 1 && quantity === 1) ||
      (productBuyQuantity >= 2 && quantity === -1)
    )
      setProductBuyQuantity(productBuyQuantity + quantity);
  }

  const Image = () => {
    return (
      <div>
        <img src={`data:image/jpeg;base64,${product.image}`} alt="i" />
      </div>

    );
  };

  const Product = () => (
    <>

      <div className="lg:flex-col mx-2 lg:mx-10 py-4 lg:py-10  justify-between ">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="flex w-full">
            <Image />
          </div>
          <div className="flex flex-col lg:pl-20 pl-4 mt-2 lg:mt-0 w-full">
            <p className="text-2xl text-left">{product.title}</p>
            <p className="text-left text-3xl font-bold text-black mt-2 mb-4 lg:mb-10">
              {product.price} TL
            </p>
            <p className="text-left text-md  text-gray-700 mt-2 ">
              <b>{"Ürün Açıklaması:"}</b>
              {<td dangerouslySetInnerHTML={{ __html: product.description }} />}
            </p>

            <div className="flex mt-8">
              <p className="block uppercase tracking-wide text-gray-700 text-sm font-bold text-center mr-4 self-center">
                {"Quantity:"}
              </p>
              <button
                className="p-2 rounded-l-lg"
                style={{ backgroundColor: "#C7ECEE" }}
                onClick={() => updateQuantity(-1)}
              >
                <FiMinus size={25} style={{ color: "white" }} />
              </button>
              <p
                className="border px-4 text-center text-lg self-center py-2"
                style={{ borderColor: "#C7ECEE" }}
              >
                {productBuyQuantity}
              </p>
              <button
                className="p-2 bg-indigo-600 rounded-r-lg"
                style={{ backgroundColor: "#C7ECEE" }}
                onClick={() => updateQuantity(1)}
              >
                <FiPlus size={25} style={{ color: "white" }} />
              </button>
            </div>
            <button
              className="bg-black w-full hover:bg-purple-900 mt-4 lg:mt-10 rounded-md text-white font-medium text-md py-3 px-4 rounded-sm mb-2"
              onClick={() => addCart()}
            >
              {"ADD TO CART"}
            </button>
          </div>

        </div>
      </div>

    </>
  );
  return <div className="lg:mx-32 lg:mt-20">{product && <Product />}</div>;

  async function addCart() {
    dispatch(addToCart({ number: productBuyQuantity, product:product }));

    toast("👏 Product Added To Cart!", {
      position: "bottom-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }


}

export default ProductPage;
