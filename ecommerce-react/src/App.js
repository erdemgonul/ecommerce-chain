import logo from "./logo.svg";
import "./App.css";
import Menu from "./Menu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Products from "./Products";
import Signin from "./Signin";
import Signup from "./Signup";
import ProductPage from "./ProductPage";
import CategoryProducts from "./CategoryProducts";
import Search from "./Search";
import Checkout from "./Checkout";
import Profile from "./Profile";
import SalesManagerPage from "./SalesManagerPage";
import ProductManagerPage from "./ProductManagerPage";
import FundPage from "./FundPage";

import { getToken, onMessageListener } from "./firebase";
import { useState, useEffect } from "react";
function App() {
  const [isTokenFound, setTokenFound] = useState(false);
  getToken(setTokenFound);

  onMessageListener()
    .then((payload) => {
      console.log("ee", payload);
    })
    .catch((err) => console.log("failed: ", err));
  return (
    <div className="App flex ">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
      <Router>
        <div className="flex flex-col w-full h-full">
          <Menu />
          <Switch>
            <Route path="/fund" component={() => <FundPage />} />

            <Route
              path="/salesmanager"
              component={() => <SalesManagerPage />}
            />
            <Route
              path="/productmanager"
              component={() => <ProductManagerPage />}
            />

            <Route path="/product" component={() => <ProductPage />} />
            <Route path="/profile" component={() => <Profile />} />
            <Route path="/signup" component={() => <Signup />} />
            <Route path="/checkout" component={() => <Checkout />} />
            <Route path="/signin" component={() => <Signin />} />
            <Route path="/search/:searchtext" component={() => <Search />} />
            <Route
              path="/categories/:category"
              component={() => <CategoryProducts />}
            />
            <Route path="/" component={() => <Products />} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
