import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import CartElement from "./CartElement";
import { useLocation } from "react-router";
import CreateCampaign from "./CreateCampaign";

import { deleteFromCart } from "./redux/actions/index";
import { useDispatch } from "react-redux";
import { Toast } from "./Toast";
import OrderElement from "./OrderElement";

const SalesManagerPage = () => {
  const history = useHistory();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [previousProducts, setPreviousProducts] = useState([]);
  const [twoFA, setTwoFA] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [validUntil, setValidUntil] = useState(null);
  const [isActive, setActive] = useState(true);
  const [notifyUsers, setNotifyUsers] = useState(true);

  const location = useLocation();

  const [billingAddress, setBillingAddress] = useState("");

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/user/get/details`,
        null
      )
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else {
          console.log("wtf", res.data.data);
          setUser(res.data.data);
          setTwoFA(res.data.data.twoFactorAuthenticationEnabled);
          console.log("twofa", twoFA);
          getAddresses();
          getPreviousProducts();
        }
      })
      .catch((err) => {
        console.log(err);
        window.location.replace("/");
      });
  }, [location]);

  const saveAddress = (e) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/user/change/details`,
        {
          shippingAddresses: [shippingAddress],
          newShippingAddress: true,
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.error) {
          Toast(res.data.error);
        } else {
          Toast("???? Address added into your account!");
          getAddresses();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAddresses = () => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/user/get/details`,
        null
      )
      .then((res) => {
        console.log(res.data.data.shippingAddress);
        if (res.data.error) {
          Toast(res.data.error);
        } else setAddresses(res.data.data.shippingAddresses);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPreviousProducts = () => {
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/order/get/all`, null)
      .then((res) => {
        console.log(res.data.data);
        if (res.data.error) {
          Toast(res.data.error);
        } else setPreviousProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeTwoFactorAuth = (val) => {
    setTwoFA(val);
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/user/change/details`,
        {
          twoFactorAuthenticationEnabled: val,
        }
      )
      .then((res) => {
        console.log(res);
        if (res.data.error) {
          Toast(res.data.error);
        } else Toast("???? 2FA Changed!");
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const CartProducts = () => {
    if (cart) {
      return cart.map((product, index) => (
        <CartElement
          product={product}
          key={index}
          cartIndex={index}
          deleteFromCart={(e) => deleteFromCarty(e)}
        />
      ));
    }
    return null;
  };
  const PreviousProducts = () => {
    if (cart) {
      return previousProducts.map((product, index) => (
        <OrderElement
          product={product}
          key={index}
          cartIndex={index}
          deleteFromCart={(e) => deleteFromCarty(e)}
        />
      ));
    }
    return null;
  };

  function deleteFromCarty(sku) {
    dispatch(deleteFromCart(sku));
  }

  function signOut() {
    sessionStorage.removeItem("jwt");
    window.location.replace("/");
  }

  return (
    <div className="container mx-20 bg-gray-bg1 mb-20">
      <div className="flex justify-start flex-col mt-10 bg-white rounded-lg pb-20 border border-primaryBorder shadow-default px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Sales Manager Panel
        </h1>
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Create Campaign
        </h1>
        <div className="flex-grow flex-shrink overflow-y-auto pt-4 px-4">
          {<CreateCampaign />}
        </div>
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Unapproved Comments
        </h1>

        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Previous Orders
        </h1>
        <div className="flex-grow flex-shrink overflow-y-auto pt-4 px-4">
          {<PreviousProducts />}
        </div>
        <div className="flex flex-col my-8">
          <div className="flex flex-col">
            <p className="my-4 text-left text-xl  font-bold">
              User Informations
            </p>
            {user != null && (
              <div className="flex flex-col items-start space-y-4">
                <p>
                  <b>Email:</b> {user.email}
                </p>
                <p>
                  <b>Username:</b> {user.username}
                </p>
                <p>
                  <b>First Name:</b> {user.firstName}
                </p>
                <p>
                  <b>Last Name: </b>
                  {user.lastName}
                </p>
                <p>
                  <b>Role: </b>
                  {user.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => signOut()}
        className={`bg-green-500 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
      >
        Sign Out
      </button>
    </div>
  );
};

export default SalesManagerPage;
