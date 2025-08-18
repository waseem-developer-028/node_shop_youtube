const nodeMailer = require("nodemailer");
const { renderFile } = require("ejs");
const path = require("path");

// Get the root directory
const appRootDir = path.resolve(process.cwd());

const sendMail      = async (to,subject,text, sendData={test:'test'},attachment=null) =>{
 
try{    
const transporter = nodeMailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        secure:process.env.SECURE,
        // requireTls:true,
        //cc:"test@gmail.com",
        //bcc:"test@gmail.com",
        auth:{
            user:process.env.EMAIL_EMAIL,
            pass:process.env.EMAIL_PASS
        }
  });

       let htmlText = null
       try{
       htmlText = await renderFile(appRootDir + "/views/mail/"+text, sendData)
       }
       catch(e){
         helper.myConsole("Email File Ejs Error="+e);
         return e
       }
    
  
  let mailOptions = {
    from: process.env.EMAIL_FROM_EMAIL,
    to:to,
    subject:subject,
    text:'',
    html:htmlText,
  };

     if(attachment!=null)
     {
        
      mailOptions= {...mailOptions,
           attachments: [{
           filename: attachment.filename,
           path: attachment.filepath,
           contentType:  attachment.contentType
          }]
        }
     }

 
  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log(error);
  //   } 
  // });
  await transporter.sendMail(mailOptions)

}

catch(e){
    console.log("Send Email Error="+e);
    return e
}

  return true

}


module.exports = sendMail;
