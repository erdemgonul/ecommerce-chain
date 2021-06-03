import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Toast = (content) => {
    toast(content, {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}