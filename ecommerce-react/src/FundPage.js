import axios from "axios";
import {Toast} from "./Toast";
import React, { useState } from "react";
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

const FundPage = () => {
  const [amount, setAmount] = useState(0);

  const fundUser = () => {
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/payment/fund`, {
        amount: amount,
      })
      .then((res) => {
        if(res.data.error){
          Toast(res.data.error);
        }
        else Toast("Your wallet has been funded succesfully!");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="h-screen flex bg-gray-bg1">
      <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
         Fund Money Into Your Account ( TestNet)
        </h1>

        <div>
          <label htmlFor="email">Amount</label>
          <input
            type="text"
            className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
            id="email"
            placeholder="Enter Amount"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
        </div>
       

        <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => fundUser()}
            className={`bg-green-500 py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
          >
            Fund Money
          </button>
        </div>
      </div>
     
    </div>
  );
};

export default FundPage;
