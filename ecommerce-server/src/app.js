const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const firebaseAdmin = require("./common/firebase");
const db = require("./models/index");
const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

//send notification kodu
const tokens = [
  "dQWC9d6A2nkF31RIj-RMVm:APA91bHALJS9x0lzI6ApkHHRIdqcSmFlRxgjJ50OuI5IvhY9_neBggMu0dqYIv2BzY8jAJim8Gj-mLfMPe2lbwuAvf-vIbwltvfH8VBCVJSlEo302t7tAqS8l8_PcgZzq0InZ1NYcOlI",
];

app.post("/", async (req, res) => {
  try {
    const { title, body, imageUrl, notificationToken } = req.body;
    await firebaseAdmin
      .messaging()
      .sendMulticast({
        tokens: [notificationToken],
        notification: {
          title: "Your order status",
          body: "Order has been shipped to your address",
          imageUrl,
        },
      })
      .then((e) => console.log(e))
      .catch((err) => console.log(err));
    res.status(200).json({ message: "Successfully sent notifications!" });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Something went wrong!" });
  }
});

app.use(middlewares.validateRequest);
app.use(middlewares.verifyToken);
app.use(middlewares.isProductManager);

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
