require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
let path = require("path")
const connectDB = require('./config/db')
const errorHandler = require('./middlewares/error-handler')
const sendEmail = require('./heplers/sendemail')
global.helper = require('./heplers/helper')
const localization = require('./middlewares/localization')
const routes = require('./routes')

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

const app = express()
const cors = require('cors')

// Trust proxy for Vercel deployment
app.set('trust proxy', true)

global.appRoot = path.join(__dirname)


//localization configuration 
const i18next = require('i18next')
const Backend = require('i18next-fs-backend')
const langMiddleware = require('i18next-http-middleware')
// mongodb configuration
connectDB();


app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors())
app.options('*', cors())

app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// Import rate limiters
const { apiLimiter, authLimiter } = require('./middlewares/rate-limit')

// Apply rate limiting to all routes under /v1
app.use('/v1', apiLimiter)

// Apply stricter rate limiting to authentication routes
app.use('/v1/user/login', authLimiter)
app.use('/v1/user/register', authLimiter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))




//localization configuration
i18next.use(Backend).use(langMiddleware.LanguageDetector).init({
  fallbackLng: 'en',
  backend: {
    loadPath: appRoot + '/locales/{{lng}}/translation.json'
  }
})
app.use(langMiddleware.handle(i18next))


//set server lang middlewares
app.use(localization)

// API routes
app.use(routes)


app.get('/', (req, res, next) => {
  res.send('working server');
})


// Error Middlewares
//404 not found handle
app.use(errorHandler.notFound)
// generic Error handler
app.use(errorHandler.genericErrorHandler);





//server configuration
const server = app.listen(process.env.PORT, async () => {
  console.log(`Server up successfully - host: ${process.env.HOST} port: ${process.env.PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('possibly unhandled rejection happened');
  console.log(err.message);
});

const closeHandler = () => {
  Object
    .values(connections)
    .forEach((connection) => connection.close());

  server.close(() => {
    console.log('Server is stopped succesfully');
    process.exit(0); /* eslint-disable-line */
  });
};

process.on('SIGTERM', closeHandler);
process.on('SIGINT', closeHandler);

//for jest testing
module.exports = app






