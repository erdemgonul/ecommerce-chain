import React, { useState, useEffect } from "react";
import OrderElementChild from "./OrderElementChild";

function Comment({ comment }) {
  return (
    <div className={"flex  border-t py-4 border-gray-400 w-full "}>
      <div className="flex flex-col ml-4 justify-between w-full">
        <div>
          <div className="flex space-x-20">
            <p className="text-left text-lg font-bold my-2">
              {comment.createdOn.split("T")[0]}
            </p>
            {comment.rating && (
              <p className="text-left text-lg font-bold my-2">
                <b>RATING: </b>
                {comment.rating}/5
              </p>
            )}
          </div>
          <p className="text-left text-2xl">{comment.commentText}</p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
