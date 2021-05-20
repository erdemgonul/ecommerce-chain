import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Signin = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [twoFA, setTwoFA] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);

  const submitTwoFactorAuth = () => {
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/auth/twofactorauth/verify`, {
        userName: username,
        twoFactorCode: parseInt(twoFA),
      })
      .then((res) => {
        console.log(res);
        if (res.data.error) {
        } else {
          console.log("hey");
          sessionStorage.setItem("jwt", res.data.accessToken);
          window.location.replace("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(username, password);
  };

  const signIn = (e) => {
    console.log("eeee");
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/auth/signin`, {
        userName: username,
        password: password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          if (res.data.state) {
            console.log("ee");
            setIsOpen(true);
            return;
          } else {
            console.log("hey");
            sessionStorage.setItem("jwt", res.data.accessToken);

            window.location.replace("/");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(username, password);
  };
  return (
    <div className="h-screen flex bg-gray-bg1">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Log in to your account 🔐
        </h1>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
            id="email"
            placeholder="Your Email"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
            id="password"
            placeholder="Your Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => signIn()}
            className={`bg-green-500 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
          >
            Login
          </button>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} style={customStyles} contentLabel="">
        <h2>2FA Code ( Check your email)</h2>
        <div></div>
        <input
          type="text"
          className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
          id="twoFa"
          placeholder="Auth Code"
          onChange={(e) => setTwoFA(e.target.value)}
          value={twoFA}
        />
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => submitTwoFactorAuth()}
            className={`bg-green-500 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
          >
            Submit
          </button>
        </div>{" "}
      </Modal>
    </div>
  );
};

export default Signin;
