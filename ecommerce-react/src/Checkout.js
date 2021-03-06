import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import CartElement from "./CartElement";
import { deleteFromCart } from "./redux/actions/index";
import { useDispatch } from "react-redux";
import { Toast } from "./Toast";

const Checkout = () => {
  const history = useHistory();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [sameAddress, setSameAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [addresses, setAddresses] = useState([]);

  const [billingAddress, setBillingAddress] = useState("");
  useEffect(() => {
    getAddresses();
  }, []);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(cart);
    let reqProducts = [];
    cart.forEach((element) => {
      let x = { quantity: 0, sku: "", title: "" };
      x.quantity = element.number;
      x.sku = element.product.sku;
      x.title = element.product.title;
      reqProducts.push(x);
    });
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/order/create`, {
        shippingAddress: shippingAddress,
        billingAddress: sameAddress ? shippingAddress : billingAddress,
        products: reqProducts,
      })
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else {
          console.log(res);
        //   axios
        //     .post(
        //       `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/notification/send`,
        //       {
        //         notificationToken: localStorage.getItem("firebasetoken"),
        //       }
        //     )
        //     .then((res) => {
        //       console.log(res);
        //       Toast("👏 Notification send to your device!");

        //       setTimeout(() => {
        //         window.location.replace("/");
        //       }, 3000);
        //       window.location.replace("/");
        //     })
        //     .catch((err) => {
        //       console.log(err);
        //       Toast("👏 Notification error!");
        //     });
          Toast("👏 Order Completed!");
          sessionStorage.removeItem("state");
          setTimeout(() => {
            window.location.replace("/");
          }, 3000);
        }
      })
      .catch((err) => {
        if (err.response.status === 403) {
          Toast("You need to login to place a order !");
        } else {
          if (err.response.data.message){
            Toast(err.response.data.message);
          }
        }
        //Toast("Error!");
      });
  };

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
        } else Toast("👏 Address added into your account!");

        getAddresses();
      })
      .catch((err) => {
        if (err.response.status === 403) {
          Toast("You need to login to save an adress !");
        } else {
          if (err.response.data.message){
            Toast(err.response.data.message);
          }
        }
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
        if (res.data.error) {
          Toast(res.data.error);
        } else setAddresses(res.data.data.shippingAddresses);
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

  return (
    <div className="container mx-20 bg-gray-bg1 mb-20">
      <div className="flex justify-start flex-col mt-10 bg-white rounded-lg pb-20 border border-primaryBorder shadow-default px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Checkout
        </h1>
        <div className="flex-grow flex-shrink overflow-y-auto pt-4 px-4">
          {<CartProducts />}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <p className="my-4 text-left text-xl  font-bold">My Addresses</p>
            {addresses.length > 1 &&
              addresses.map((e) => (
                <div
                  className="flex border py-2 my-2"
                  onClick={() => setShippingAddress(e)}
                >
                  <a className="text-blue-400 ml-4">{JSON.stringify(e).replace('"','').replace('"','')}</a>
                </div>
              ))}
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="mt-8">
              <p className="text-left my-4 font-bold">Shipping Address:</p>
              <textarea
                className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                id="shippingaddress"
                placeholder="Your shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>
            <div className="flex justify-start items-center mt-2 mb-8">
              <button
                onClick={saveAddress}
                className={`bg-green-500 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
              >
                Save address for future purchases
              </button>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-gray-600"
                value={sameAddress}
                onChange={(e) => setSameAddress(e.target.checked)}
              />
              <span class="ml-2 text-gray-700 text-left font-bold">
                Same shipping & billing address
              </span>
            </div>
            {!sameAddress && (
              <div>
                <p className="text-left my-4 font-bold">Billing Address:</p>
                <textarea
                  className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                  id="billingaddress"
                  placeholder="Your billing address"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-center items-center mt-6">
              <button
                className={`bg-green-500 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
                onClick={handleFormSubmit}
              >
                Complete Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function deleteFromCarty(sku) {
    dispatch(deleteFromCart(sku));
  }
};

export default Checkout;
