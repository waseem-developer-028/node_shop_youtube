const nodeMailer = require('nodemailer')
const { renderFile } = require("ejs")
const path = require('path')

// Get the root directory for the application
const appRootDir = path.resolve(process.cwd())

const sendMail = async (to, subject, text, sendData = { test: 'test' }, attachment = null) => {
 
try{    
// Log email configuration attempt (without sensitive data)
console.log('Attempting email configuration with:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    hasAuth: !!process.env.EMAIL_EMAIL && !!process.env.EMAIL_PASS
});

var transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_EMAIL,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    debug: true,
    logger: true
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
    // Set a timeout for SMTP operations
    const timeout = new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('SMTP Operation timed out')), 30000); // 30 seconds timeout
    });

    // Verify SMTP connection first with timeout
    console.log('Verifying SMTP connection...');
    await Promise.race([
        transporter.verify(),
        timeout
    ]);
    console.log('SMTP Connection verified successfully');
    
    // Send email with timeout
    const info = await Promise.race([
        transporter.sendMail(mailOptions),
        timeout
    ]);

    console.log('Email sent successfully:', {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
        envelope: info.envelope
    });
    return true;
  } catch (error) {
    // Log detailed error information
    console.error('Email sending failed:', {
        error: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
        stack: error.stack
    });

    // Check for specific error types
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
        throw new Error('Failed to connect to email server. Please check your network connection.');
    } else if (error.code === 'EAUTH') {
        throw new Error('Email authentication failed. Please check your credentials.');
    } else {
        throw new Error(`Failed to send email: ${error.message}`);
  }
}
}
catch(e){
    console.error("Send Email Error:", e)
    throw e
}

}

module.exports = sendMail