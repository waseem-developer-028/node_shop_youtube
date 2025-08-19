require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
let path = require("path");
const connectDB = require("./config/db");
const helmet = require("helmet");
const compression = require("compression");
const errorHandler = require("./middlewares/error-handler");
const sendEmail = require("./heplers/sendemail");
global.helper = require("./heplers/helper");
const localization = require("./middlewares/localization");
const routes = require("./routes");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
// const swaggerDocument = YAML.load("./swagger.yaml");
const swaggerDocument = require("./swagger.json");

const app = express();
const cors = require("cors");

global.appRoot = path.join(__dirname);

//localization configuration
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const langMiddleware = require("i18next-http-middleware");
// mongodb configuration
connectDB();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  compression({
    level: 6,
    threshold: 0, // for 10 MB 10 * 1000
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.options("*", cors());

// fileupload middleware use
app.use(fileUpload());

app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//localization configuration
i18next
  .use(Backend)
  .use(langMiddleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: appRoot + "/locales/{{lng}}/translation.json",
    },
  });
app.use(langMiddleware.handle(i18next));

//set server lang middlewares
app.use(localization);

app.get("/", (req, res, next) => {
  res.send("working server");
});

// Error Middlewares
// generic Error handler
app.use(errorHandler.genericErrorHandler);

// API routes
app.use("/", routes);

//404 not found handle
app.use(errorHandler.notFound);

//server configuration
app.listen(process.env.PORT, async () => {
  console.log(
    `Server up successfully - host: ${process.env.HOST} port: ${process.env.PORT}`
  );
});

process.on("unhandledRejection", (err) => {
  console.log("possibly unhandled rejection happened");
  console.log(err.message);
  console.log(err);
  // const error = {
  //   success: false,
  //   code: err.code,
  //   message: err.message,
  //   type: "possibly unhandled rejection happened",
  // };
  // res.status(200).json({ error });
});

const closeHandler = () => {
  Object.values(connections).forEach((connection) => connection.close());

  app.close(() => {
    console.log("Server is stopped succesfully");
    process.exit(0); /* eslint-disable-line */
  });
};

process.on("SIGTERM", closeHandler);
process.on("SIGINT", closeHandler);

// //for jest testing
// module.exports = server;
