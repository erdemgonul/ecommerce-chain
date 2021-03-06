import axios from "axios";
import { Toast } from "./Toast";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import CartElement from "./CartElement";
import { useLocation } from "react-router";
import FileBase64 from "react-file-base64";

import { deleteFromCart } from "./redux/actions/index";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderElement from "./OrderElement";
import { useForm } from "react-hook-form";

const ProductManagerPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [title, setTitle] = useState("");
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [depth, setDepth] = useState(null);
  const [weight, setWeight] = useState(null);
  const [category, setCategory] = useState(null);
  const [comments, setComments] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const getFiles = (file) => {
    setImage(file.base64.substr(22, file.base64.length));
  };
  const getCategories = async () => {
    await axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/category/get/all`)
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else setCategories(res.data.data.categories);
      });
  };
  const getProducts = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_ENDPOINT_URL}/api/v1/product/get/category`,
        {
          path: "",
          strictMode: false,
        }
      )
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else setProducts(res.data.data.products);
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
        } else {
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
  const editProduct = async (product) => {};
  const deleteProduct = async (sku) => {
    await axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/product/delete`, {
        sku: sku,
        deleteFromElasticSearch: true,
      })
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else {
          Toast("Delete success !");
          window.location.reload();
        }
      })
      .catch((e) => console.log(e));
  };
  const Products = () => {
    return (
      <div className="flex justify-start flex-col space-y-2 items-start mb-8">
        {products.map((e) => (
          <div className="text-start flex space-x-2">
            <p>{e.title}</p>
            <button
              className="bg-blue-500 text-white px-2 py-1"
              onClick={() => editProduct(e)}
            >
              Edit
            </button>
            <button
              className="bg-green-500 text-white px-2 py-1"
              onClick={() => deleteProduct(e.sku)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  };
  useEffect(async () => {
    await getCategories();
    await getProducts();
    await getAllComments();

    console.log(categories);
  }, []);
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
  const onSubmit = (data) => {
    console.log("ee", data);
    var shipping_details = {
      weight: weight,
      height: height,
      width: width,
      depth: depth,
    };
    axios
      .post(`${process.env.REACT_APP_ENDPOINT_URL}/api/v1/product/create`, {
        sku: sku,
        title: title,
        description: description,
        quantity: quantity,
        price: price,
        categories: category == null ? ["clothing"] : [category],
        image: image,
        product_details: {},
        shipping_details: shipping_details,
      })
      .then((res) => {
        if (res.data.error) {
          Toast(res.data.error);
        } else {
          Toast("Product created !");
          window.location.reload();
        }
        console.log(res);
      })
      .catch((err) => {
        if (err.response.data.message) {
          Toast(err.response.data.message);
        }
      });
  };

  return (
    <div className="container mx-20 bg-gray-bg1 mb-20">
      <div className="flex justify-start flex-col mt-10 bg-white rounded-lg pb-20 border border-primaryBorder shadow-default px-16">
        <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
          Product Manager Page
        </h1>
        <Products />
        <form
          className="flex flex-col space-y-8 text-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex">
            <p>Product Title:</p>
            <input
              className="border rounded-sm border-gray-400 ml-4"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="flex">
            <p>Sku:</p>
            <input
              onChange={(e) => setSku(e.target.value)}
              value={sku}
              className="border rounded-sm border-gray-400 ml-4"
            />
          </div>
          <div className="flex">
            <p>Description:</p>
            <input
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="border rounded-sm border-gray-400 ml-4"
            />
          </div>
          <div className="flex">
            <p>Quantity:</p>
            <input
              onChange={(e) => setQuantity(e.target.value)}
              value={quantity}
              className="border rounded-sm border-gray-400 ml-4"
            />
          </div>
          <div className="flex">
            <p>Price:</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="border rounded-sm border-gray-400 ml-4"
            />
          </div>
          <div className="flex">
            <p>Image:</p>
            <FileBase64 multiple={false} onDone={(e) => getFiles(e)} />
          </div>
          <div className="flex">
            <p>Category:</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="border rounded-sm border-gray-400 ml-4"
            >
              {categories.map((f, index) => {
                return <option value={f.path}>{f.title}</option>;
              })}
            </select>
          </div>
          <p className="text-left font-bold">Shipping Details</p>
          <div className="flex">
            <p>Weight:</p>
            <input
              type="text"
              className="border rounded-sm border-gray-400 ml-4"
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
            />
          </div>
          <div className="flex">
            <p>Width:</p>
            <input
              type="text"
              className="border rounded-sm border-gray-400 ml-4"
              onChange={(e) => setWidth(e.target.value)}
              value={width}
            />
          </div>
          <div className="flex">
            <p>Height:</p>
            <input
              type="text"
              className="border rounded-sm border-gray-400 ml-4"
              onChange={(e) => setHeight(e.target.value)}
              value={height}
            />
          </div>
          <div className="flex">
            <p>Depth:</p>
            <input
              type="text"
              className="border rounded-sm border-gray-400 ml-4"
              onChange={(e) => setDepth(e.target.value)}
              value={depth}
            />
          </div>
          <input type="submit" className="bg-blue-500 p-4 text-white text-xl" />
        </form>
      </div>
      <div className="flex-grow flex-shrink overflow-y-auto pt-4 px-4">
        {<Comments />}
      </div>
    </div>
  );
};

export default ProductManagerPage;
