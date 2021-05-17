import React, { useState, useEffect } from "react";
import CartLink from "./CartLink";
import Cart from "./Cart";
import { useHistory, Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaAngleRight,
  FaShippingFast,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { MdEmail, MdMenu } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setCategories } from "./redux/actions";
import axios from "axios";

function Menu() {
  const history = useHistory();
  const [toggleMenu, setToggleMenu] = useState(true);
  const [searchText, setSearchText] = useState(null);
  const [cartShowStyle, setCartShowStyle] = useState("hidden");
  const [categories, setCategoriesy] = useState([]);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    getCategories();
    if (sessionStorage.getItem("jwt")) setLogged(true);
  }, []);

  function toSearch() {
    if (searchText && searchText.length > 1) {
      history.push({
        pathname: `/search/${searchText}`,
      });
    }
  }

  function getCategories() {
    axios.post(`http://localhost:5000/api/v1/category/get/all`).then((res) => {
      setCategoriesy(res.data.data.categories);
    });
  }

  function showCart(shouldShow) {
    shouldShow
      ? setCartShowStyle(
          "flex h-full  w-full z-40 lg:w-2/6 fixed top-0 right-0"
        )
      : setCartShowStyle("hidden");
  }

  const Categories = () => {
    return categories.map((cat) => {
      return (
        <a
          onClick={() =>
            history.push({
              pathname: `/categories/${cat.path}`,
            })
          }
        >
          {cat.title}
        </a>
      );
    });
  };

  return (
    <div className="flex-col shadow-md pb-2 lg:pb-4 ">
      <div className="flex  xl:flex lg:flex lg:pb-2 justify-between lg:px-10 lg:mt-8 mt-2">
        <div className="flex">
          <button onClick={() => setToggleMenu(!toggleMenu)} className="h-full">
            <MdMenu
              size="30"
              className="block lg:hidden text-black self-center ml-2"
            />
          </button>

          <button
            onClick={() => history.push("/")}
            className="font-light text-3xl md:text-4xl text-black lg:ml-4 lg:ml-0 self-center "
          >
            EcommerceChain
          </button>
        </div>
        <div className={cartShowStyle}>
          <Cart closeCart={() => showCart(false)} />
        </div>
        <div className="flex items-center">
          <div className=" items-center hidden lg:flex rounded-full mr-4 px-4 py-1 border-gray-400 border ">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              value={searchText || ""}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(event) =>
                event.key == "Enter" && toSearch(event.target.value)
              }
            />
            {searchText && searchText.length >= 1 && (
              <FaTimes
                size={25}
                className="mr-4 text-gray-700"
                onClick={(event) => setSearchText("")}
              />
            )}

            <FaSearch
              size={25}
              onClick={(event) => toSearch(event.target.value)}
            />
          </div>
          <CartLink click={() => showCart(true)} />
          {!logged && (
            <div className="flex border-l-2 border-gray-500 space-x-4 ml-4 pl-4">
              <button
                onClick={() =>
                  history.push({
                    pathname: "/signin",
                  })
                }
                className="h-full"
              >
                Sign in
              </button>
              <button
                onClick={() =>
                  history.push({
                    pathname: "/signup",
                  })
                }
                className="h-full"
              >
                Sign Up
              </button>
            </div>
          )}
          {logged && (
            <button
              onClick={() =>
                history.push({
                  pathname: "/profile",
                })
              }
              className="h-full ml-4 hidden md:flex"
            >
              <b>My Profile</b>
            </button>
          )}
        </div>
      </div>
      <div className="flex  flex-col md:flex-row  items-start xl:flex lg:flex lg:pb-2 lg:ml-4  ml-4 md:space-x-8 lg:px-10  mt-2">
        <Categories />
      </div>
    </div>
  );
}

export default Menu;
