import React, { useState, useEffect } from "react";
import OrderElementChild from "./OrderElementChild";
import axios from "axios";
import { Toast } from "./Toast";
import DatePicker from "react-date-picker";
import moment from "moment";

function CreateCampaign() {
  const [campaignType, setCampaignType] = useState("FIXED_DISCOUNT");
  const [validUntil, setValidUntil] = useState(null);
  const [isActive, setActive] = useState(true);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notifyUsers, setNotifyUsers] = useState(true);

  const createCampaign = () => {
    var date = moment(validUntil);
    // "2014-09-08T08:02:17-05:00"
    console.log(date.format());
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/campaign/create`, {
        campaignType: campaignType,
        validUntil: date.format(),
        isActive: true,
        discountAmount: discountAmount,
        notifyUsers: true,
      })
      .then((res) => {
        console.log(res);
        if (res.data.error) {
          Toast(res.data.error);
        } else {
          Toast("👏 Campaign Created!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={"flex  border-t py-4 border-gray-400 w-full "}>
      <div className="flex flex-col ml-4 justify-between w-full">
        <div className="flex  w-full">
          <p className="text-left flex-col flex text-lg my-2 w-1/2">
            Discount Amount:
            <input
              type="number"
              className="border rounded-lg w-full"
              onChange={(e) => setDiscountAmount(e.target.value)}
              value={discountAmount}
            />
            <div className="flex  items-start space-x-2 mt-4">
              <p>Campaign Type:</p>
              <select
                className="border border-gray-600 rounded-lg"
                onChange={(e) => setCampaignType(e.target.value)}
                value={campaignType}
              >
                <option value="FIXED_DISCOUNT">Fixed Discount</option>
              </select>
            </div>
            Valid Until:
            <DatePicker onChange={setValidUntil} value={validUntil} />
            <button
              className="bg-green-500 text-white px-4 py-1 mt-4"
              onClick={() => createCampaign()}
            >
              Create Campaign
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateCampaign;
