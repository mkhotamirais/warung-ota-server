const express = require("express");
const { port } = require("./config/constants");
const app = express();
const { log } = require("console");
const db = require("./config");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoute = require("./routers/authRouter");
const userRoute = require("./routers/userRouter");
const productRoute = require("./routers/productRouter");
const categoryRoute = require("./routers/categoryRouter");
const tagRoute = require("./routers/tagRouter");

const allowedOrigins = [
  "https://mkhotamirais.my.id",
  "https://mkhotamirais.github.io",
  "https://mkhotami.vercel.app",
  "https://warung-ota.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use((req, res, next) => {
  if (allowedOrigins.includes(req.headers.origin)) res.header("Access-Control-Allow-Credentials", true);
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    allowedOrigins.indexOf(origin) !== -1 || !origin ? callback(null, true) : callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`welcome to warungota server`);
});

app.use("/api/warungota/auth", authRoute);
app.use("/api/warungota/product", productRoute);
app.use("/api/warungota/user", userRoute);
app.use("/api/warungota/category", categoryRoute);
app.use("/api/warungota/tag", tagRoute);

db.then(() => {
  app.listen(port, () => log(`connect to mongodb and running on port ${port}`));
}).catch((err) => log(err?.message || err));
