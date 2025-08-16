const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const moment = require('moment-timezone')
const fs = require('fs')
const axios      = require('axios')
const User       = require('../models/user')
const Notification = require('../models/notification')


module.exports = {
     ObjectId: ObjectId,
     
     trans(key="hello"){
        const data = fs.readFileSync(`${appRoot}/locales/${LOCALE}/translation.json`)
        const row = JSON.parse(data)
        return row[key]
      },
    
    sendSuccess(data, res, message, status=200){
        let response = {
            "success": true,
            "status":status,
            "data":data,
            "message":message,
            "responseCode": 200
        };
        let errorCode = 200;
        res.status(errorCode || 200).json(response);
    },
    
    sendError(data,res, message, status=200){
        let response = {
            "success": false,
            "status":status,
            "data":data,
            "message":message,
            "responseCode": 204
        };
        let errorCode = 200;
        res.status(errorCode || 200).json(response)
    },
    
    sendException(res, message, status=200){
        if(process.env.NODE_ENV !== 'production')
        message=message
        else
        message = "Something is wrong"
        let response = {
            "success": false,
            "status":status,
            "message":message,
            "responseCode": 204
        };
        let errorCode = 200;
        res.status(errorCode || 200).json(response)
    },
    
    myConsole(data){
       if(process.env.NODE_ENV !== 'production')
        console.log(data)
       else
       console.log("Something is wrong")
    },
    
    rand(min, max) 
    {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    
    toTimeZone(time, zone = 'Asia/Kolkata') {
        var format = 'YYYY-MM-DD HH:mm:ss';
        return moment(time, format).tz(zone).format(format);
    },

    paginate(page, page_size = 6, type = ''){

        page = page ? parseInt(page) : 0;
    
        if (page >= 1) {
            page = page - 1;
        }
    
        const offset = page * page_size
        const limit = page_size
        if (type != '' && type == 'export')
            return {}
        else
            return { offset, limit }
    },

    deliveryFee(amt)
    {
       amt = +amt 
       let fee=0;
       if(amt>0 && amt <= 1000)
         fee =  (amt*10)/100;
       else if(amt>1000 && amt <= 2000)
         fee =  (amt*5)/100;
       else if(amt>2000 && amt <= 6000)
         fee =  (amt*3)/100;
       else if(amt>6000 && amt <= 10000) 
         fee =  (amt*2)/100; 
       else if(amt>10000) 
         fee =  0;   
       return parseFloat(fee).toFixed(2);
    }, 

    orderStatus(key){

       const order_status = {
         1 : "confirmed",
         2 : "shiped",
         3 : "delivered"
       }

       return (!order_status[key]) ? '' : order_status[key]
    },


    sendPush(title="title", body="body", device_token="evooy2mXFUCsSk60mSohrg:APA91bE1j75NGD-94jZC7vS2p84kaHxOhrrDI_8j2Sv7oSzF9DazJ7_LhBk7U6mezj5K3sbq2nW0GK-FeR4Up-wUB7kpPfog104O1mENFrkeiH0nBt4GIzTgEW-wRvcjGC5JQhZdnvvF"){
      let data  = {to:device_token,notification:{title:title,body:body}}
      let headers = {
         headers: {
           Authorization:'key='+process.env.FIREBASE_KEY,
           "Content-Type": "application/json"
         }
      }
 
      axios.post('https://fcm.googleapis.com/fcm/send',data,headers).then(function (response) {

        return JSON.stringify(response)
     })
     .catch(function (error) {
       return error
     })
     
    },

    sendNotification: async function(userId=null, title='title', body='body')
    {
      const userInfo = await User.findById(userId)

      await Notification.create({
        user_id:userId,
        title:title,
        body:body
      });

      helper.sendPush(title, body, userInfo.device_token)
    }
     
    
}