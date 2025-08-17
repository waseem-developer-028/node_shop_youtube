// const fs = require("fs")
// let pdf  = require("html-pdf")
// const path = require("path")
// const { renderFile} = require("ejs")
// const ProductOrder = require("../../models/productOrder")
// const OrderCoupon = require("../../models/orderCoupon")
// const Order = require("../../models/order")
// const _ = require('lodash')
// const moment = require('moment')

// function generatePdf(html, fileName, options) {

// return new Promise(function(resolve,reject){
//       const error = true

//       pdf.create(html, options).toFile(appRoot+'/public/docs/' + fileName, function (err, res) {
//         if (err) reject(err);
//         else
//         resolve("Pdf Created Successfully")
//       })

//     })
//   }

// const index = async(req, res) => {
//   try{

  

//     const { order_id } = req.query

//     const timezone     = req.body.timezone || 'Asia/Kolkata' 

//     if(_.isEmpty(order_id))
//     return helper.sendError({}, res, req.t("invalid_order"), 200)

    

//     const orderInfo = await Order.findById(order_id).populate({ path: 'transaction_id', select: 'payment_method' })

//     if(!orderInfo)
//     return helper.sendError({}, res, req.t("invalid_order"), 200)

//     const products = await ProductOrder.find({order_id: helper.ObjectId(order_id)}).populate({ path: 'product_id', select: 'name' })

//     const CouponOrder = await OrderCoupon.findOne({ order_id: helper.ObjectId(order_id)}).populate({ path: 'user_coupon_id', select: 'coupon_amount', populate: {
//       path: 'coupon_id',
//       select: 'title'
//     }  })

//     let  coupon  =  (!CouponOrder) ? null : CouponOrder

//     const payment_method = orderInfo.transaction_detail.payment_method_types[0]

//     //  if(orderInfo.transaction_id.payment_method=='stripe')
//     //    {
//     //     payment_method = 'Card *** '+orderInfo.transaction_detail.payment_method_details.card.last4  
//     //    }
//     //   else{
//     //     payment_method = "Coupon"
//     //   } 

     



     

//     let fileName = `${orderInfo.order_id}_orderinvoice.pdf`;
   
//     let image_url = `${process.env.APP_URL}/image/weblogo.png`

//     let order_time = moment.utc(orderInfo.createdAt).tz(timezone)

//     order_time = moment(order_time).format('DD-MMM-YYYY h:mm A')

//     let web_url = process.env.WEB_URL
  
//   let html = await renderFile(appRoot + "/views/mail/orderpdf.ejs", { products: products, payment_method: payment_method,orderInfo: orderInfo, order_time: order_time, coupon: coupon, image_url: image_url, web_url: web_url})

//   let options = { format: 'A4' };

//    await generatePdf(html, fileName, options)

//   const directory = appRoot+'/public/docs';

//   const file = `${appRoot}/public/docs/${fileName}`;
//   res.download(file, fileName); 

  
//   //unlink file after successful download
//   setTimeout(() => {
//     fs.unlink(path.join(directory, fileName), err => {
//       if (err) throw err;
//     });
//   }, 3000)
//   }
//   catch(e) {
//     console.log('===', e)
//     helper.sendError({}, res, e.message, 200)
//   }
// }

// module.exports = {
//     index
//   };
const path = require("path");
const { renderFile } = require("ejs");
const ProductOrder = require("../../models/productOrder");
const OrderCoupon = require("../../models/orderCoupon");
const Order = require("../../models/order");
const _ = require('lodash');
const moment = require('moment');
const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

async function generatePdfBuffer(html) {
  const browser = await puppeteer.launch({
    args: [
      ...chromium.args,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none'
    ],
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();
  await page.setContent(html, { 
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  const buffer = await page.pdf({ 
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px'
    },
    scale: 1,
    landscape: false,
    displayHeaderFooter: false,
    timeout: 30000
  });
  await browser.close();
  return buffer;
}

const index = async (req, res) => {
  try {
    const { order_id } = req.query;
    const timezone = req.body.timezone || 'Asia/Kolkata';

    if (_.isEmpty(order_id))
      return helper.sendError({}, res, req.t("invalid_order"), 200);

    const orderInfo = await Order.findById(order_id).populate({ path: 'transaction_id', select: 'payment_method' });
    if (!orderInfo)
      return helper.sendError({}, res, req.t("invalid_order"), 200);

    const products = await ProductOrder.find({ order_id: helper.ObjectId(order_id) }).populate({ path: 'product_id', select: 'name' });
    const CouponOrder = await OrderCoupon.findOne({ order_id: helper.ObjectId(order_id) }).populate({ path: 'user_coupon_id', select: 'coupon_amount', populate: {
      path: 'coupon_id',
      select: 'title'
    } });
    let coupon = (!CouponOrder) ? null : CouponOrder;

    const payment_method = orderInfo.transaction_detail.payment_method_types[0];

    let fileName = `${orderInfo.order_id}_orderinvoice.pdf`;
    let image_url = `${process.env.APP_IMAGE_URL}/image/weblogo.png`;
    let order_time = moment.utc(orderInfo.createdAt).tz(timezone);
    order_time = moment(order_time).format('DD-MMM-YYYY h:mm A');
    let web_url = process.env.WEB_URL;

    let html = await renderFile(appRoot + "/views/mail/orderpdf.ejs", {
      products: products,
      payment_method: payment_method,
      orderInfo: orderInfo,
      order_time: order_time,
      coupon: coupon,
      image_url: image_url,
      web_url: web_url
    });

    const pdfBuffer = await generatePdfBuffer(html);

    // Set proper headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Prevent caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', 0);

    // Send the buffer
    res.end(pdfBuffer);
  } catch (e) {
    console.error('PDF Generation Error:', e);
    
    // Check if headers are already sent
    if (!res.headersSent) {
      if (e.message.includes('timeout') || e.message.includes('ETIMEDOUT')) {
        helper.sendError({}, res, 'PDF generation timed out. Please try again.', 408);
      } else if (e.message.includes('memory')) {
        helper.sendError({}, res, 'Server is busy. Please try again later.', 503);
      } else {
        helper.sendError({}, res, 'Failed to generate PDF. Please try again.', 500);
      }
    } else {
      // If headers are already sent, we need to end the response
      res.end();
    }
  }
};

module.exports = {
  index
};