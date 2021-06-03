import React, { useState, useEffect } from "react";
import OrderElementChild from "./OrderElementChild";
import axios from "axios";

function CreateComment(product) {
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(3);

  const postComment = () => {
    console.log(product);
    let reqBody = {
      productId: product.product.sku,
      commentText: commentText,
    };
    if (product.product.purchasedBefore) reqBody["rating"] = rating;

    axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/comment/create`,
        reqBody
      )
      .then((res) => {
        console.log(res);
      });
  };
  return (
    <div className={"flex  border-t py-4 border-gray-400 w-full "}>
      <div className="flex flex-col ml-4 justify-between w-full">
        <div className="flex  w-full">
          <p className="text-left flex-col flex text-lg my-2 w-1/2">
            Comment:
            <textarea
              type="text"
              className="border rounded-lg w-full"
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
            />
            {product.product.purchasedBefore && (
              <div className="flex  items-start space-x-2 mt-4">
                <p>Rate this product:</p>
                <select
                  className="border border-gray-600 rounded-lg"
                  onChange={(e) => setRating(e.target.value)}
                  value={rating}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            )}
            <button
              className="bg-green-500 text-white px-4 py-1 mt-4"
              onClick={() => postComment()}
            >
              Submit Comment
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateComment;
