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
  const [comments, setComments] = useState([]);
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
          getAllComments();
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
          Toast("👏 Address added into your account!");
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
  const getAllComments = () => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/comment/get/nonapproved/all`,
        null
      )
      .then((res) => {
        console.log(res.data.data);
        if (res.data.error) {
          Toast(res.data.error);
        } else setComments(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const approveComment = (commentId) => {
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/comment/approve`, {
        commentId: commentId,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.error) {
          Toast(res.data.error);
        }else{
            window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteComment = (commentId) => {
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/comment/delete`, {
        commentId: commentId,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.error) {
          Toast(res.data.error);
        }
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
        } else Toast("👏 2FA Changed!");
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

  const Comments = () => {
    return comments.map((comment, index) => (
      <div className="flex flex-col items-start space-y-2">
        <p>
          <b>Comment:</b> {comment.commentText}
        </p>
        {comment.rating && <p>{comment.rating}/5</p>}
        <div className="flex space-x-4">
          <button
            onClick={() => approveComment(comment.id)}
            className="bg-green-500 text-white px-2 py-1"
          >
            Approve Comment
          </button>
          <button
            onClick={() => deleteComment(comment.id)}
            className="bg-red-500 text-white px-2 py-1"
          >
            Decline Comment
          </button>
        </div>
      </div>
    ));
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
          SalesManagerPage
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
        <div className="flex-grow flex-shrink overflow-y-auto pt-4 px-4">
          {<Comments />}
        </div>
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
        <div className="flex justify-start items-center text-xl font-bold space-x-4 my-8">
          <input
            type="checkbox"
            name="fa"
            checked={twoFA}
            onChange={(e) => changeTwoFactorAuth(e.target.checked)}
          />
          <p> Activate Two Factor Authentication</p>
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
                  <a className="text-blue-400 ml-4">{JSON.stringify(e)}</a>
                </div>
              ))}
          </div>
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
