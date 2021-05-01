import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function CartLink({ click,client }) {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <button
      className="inline-block text-sm   leading-none border rounded
         text-black border-white hover:border-transparent hover:text-teal-500 hover:bg-white  lg:mt-0"
      onClick={() => click()}
    >
      <div className="flex align-middle items-center h-8  px-2 py-4">
        <p className="hidden sm:flex text-sm md:text-base font-normal md:mt-0 mr-2 text-center align-middle justify-center">
          {"My Cart"}
        </p>
        <div className="flex  flex-col md:flex-row items-center justify-center">
          <div className="relative mr-2 md:mr-0">
            <FaShoppingCart size="25" style={{ color: "#202020" }} />
            {cart.number >= 1 && (
              <div className="absolute text-xs rounded-full -mt-1 -mr-3 px-2 py-1 font-bold top-0 right-0 bg-red-700 text-white">
                {cart.number}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export default CartLink;
