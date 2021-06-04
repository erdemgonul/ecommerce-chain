import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import CartElement from "./CartElement";
import { useLocation } from "react-router";

import { deleteFromCart } from "./redux/actions/index";
import { useDispatch } from "react-redux";
import { Toast } from "./Toast";
import OrderElement from "./OrderElement";
const EditProfile = () => {
  const history = useHistory();
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [previousProducts, setPreviousProducts] = useState([]);
  const [twoFA, setTwoFA] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [email, setEmail] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);

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
          setEmail(res.data.data.email);
          setFirstName(res.data.data.firstName);
          setLastName(res.data.data.lastName);
        }
      })
      .catch((err) => {
        window.location.replace("/");
        console.log(err);
      });
  }, [location]);

  const saveChanges = (e) => {
    e.preventDefault();
    let x = {};
    if (user.email != email) x["email"] = email;
    if (user.firstName != firstName) x["firstName"] = firstName;
    if (user.lastName != lastName) x["lastName"] = lastName;
    if (newPassword && newPassword !== "") {
      x.password = newPassword;
    }

    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/user/change/details`,
        x
      )
      .then((res) => {
        console.log(res);
        if (res.data.error) {
          Toast(res.data.error);
        } else {
          Toast("👏 Your informations changed!");
          sessionStorage.removeItem('jwt');
          window.location.replace('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container mx-20 bg-gray-bg1 mb-20">
      <div className="flex justify-start flex-col mt-10 bg-white rounded-lg pb-20 border border-primaryBorder shadow-default px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Edit Your Profile
        </h1>

        <div className="flex flex-col my-8 ">
          <div className="flex flex-col">
            {user != null && (
              <div className="flex flex-col items-start space-y-4">
                <p>
                  <b>Username: </b>
                  {user.username}
                </p>
                <p className="text-left">
                  <b>Email:</b>
                  <input
                    type="text"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="email"
                    placeholder="Your Username"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </p>
                <p className="text-left">
                  <b>First Name:</b>
                  <input
                    type="text"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="email"
                    placeholder="Your first name"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName}
                  />
                </p>
                <p className="text-left">
                  <b>Last Name: </b>
                  <input
                    type="text"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="email"
                    placeholder="Your first name"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                  />
                </p>
                {user.role && (
                  <p>
                    <b>Role: </b>
                    {user.role}
                  </p>
                )}
                <p className="text-left">
                  <b>Current Password: </b>
                  <input
                    type="text"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="email"
                    placeholder="Your old password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    value={oldPassword}
                  />
                </p>
                <p className="text-left">
                  <b>New Password: </b>
                  <input
                    type="text"
                    className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                    id="email"
                    placeholder="Your new password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                  />
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-start items-center mt-2 mb-8">
          <button
            onClick={saveChanges}
            className={`bg-green-500 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
