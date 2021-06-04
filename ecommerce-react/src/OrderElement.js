import React, { useState, useEffect } from "react";
import OrderElementChild from "./OrderElementChild";
import axios from "axios";
import { Toast } from "./Toast";

function OrderElement({ product, deleteFromCart }) {
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    getCampaigns();
  }, []);

  const makePayment = () => {
    let x = {
      orderId: product.id,
    };
    if (campaign) x["campaignId"] = campaign;
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/order/finish`, x)
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else {
          Toast("Order payment completed,redirection to homepage");
          setTimeout(() => window.location.replace("/"), 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 403) {
          Toast("You need to login to pay for an order !");
        } else {
          if (err.response.data.message){
            Toast(err.response.data.message);
          }
        }
        window.location.replace("/");
      });
  };
  const getCampaigns = () => {
    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/campaign/get/active/all`,
        {
          campaignId: "60b7e058914ca25b385d897c",
        }
      )
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else setCampaigns(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        Toast(err);
        window.location.replace("/");
      });
  };

  return (
    <div className={"flex  border-b py-4 "}>
      <div className="flex flex-col ml-4 justify-between w-full">
        <div className="items-start justify-start">
          <p className="text-left text-base my-2"><b>Order Id:</b> {product.id}</p>

          <p className="text-left text-base my-2">
            <b>Total Price: </b>
            {product.orderTotal}
          </p>
          <p className="text-left text-base my-2">
            <b>Order Status: </b>
            {product.status == "ORDER_PLACED"
              ? "Waiting For Payment"
              : product.status}
          </p>
          {product.status == "ORDER_PLACED" && (
            <div className="items-start flex">
              <select
                className="border border-gray-600 rounded-lg"
                onChange={(val) => setCampaign(val.target.value)}
                value={campaign}
              >
                {campaigns.map((f, index) => {
                  return (
                    <option value={f.id}>
                      {f.discountAmount} Coin Discount
                    </option>
                  );
                })}
              </select>
              <button
                className="text-left bg-green-500 text-white px-2 py-1"
                onClick={() => makePayment()}
              >
                Make Payment
              </button>
            </div>
          )}
        </div>
        {product.products.map((product, index) => (
          <OrderElementChild product={product} key={index} cartIndex={index} />
        ))}
      </div>
    </div>
  );
}

export default OrderElement;
