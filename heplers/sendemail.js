const nodeMailer = require('nodemailer')
const { renderFile } = require("ejs")
const path = require('path')

// Get the root directory for the application
const appRootDir = path.resolve(process.cwd())

const sendMail = async (to, subject, text, sendData = { test: 'test' }, attachment = null) => {
 
try{    
var transporter = nodeMailer.createTransport({
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
       try {
         const templatePath = path.join(appRootDir, 'views', 'mail', text)
         htmlText = await renderFile(templatePath, sendData)
       } catch(e) {
         console.error("Email template rendering error:", e)
         throw new Error(`Failed to render email template: ${e.message}`)
       }
    
  var mailOptions = {
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

 
  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return true
  } catch (error) {
    console.error('Email sending failed:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

catch(e){
    console.error("Send Email Error:", e)
    throw e
}

}

module.exports = sendMail