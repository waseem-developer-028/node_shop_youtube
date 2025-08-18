const nodeMailer = require("nodemailer");
const { renderFile } = require("ejs");
const path = require("path");

// Get the root directory
const appRootDir = path.resolve(process.cwd());

const sendMail = async (to, subject, text, sendData = { test: 'test' }, attachment = null) => {
    try {
        // Create transporter with proper configuration for Gmail
        const transporter = nodeMailer.createTransport({
            service: 'gmail',  // Using 'gmail' service instead of manual host/port
            auth: {
                user: process.env.EMAIL_EMAIL,
                pass: process.env.EMAIL_PASS  // Use App Password if 2FA is enabled
            },
            tls: {
                rejectUnauthorized: false  // Needed for some environments like Vercel
            }
        });

        // Verify connection configuration
        try {
            await transporter.verify();
            console.log('SMTP connection verified successfully');
        } catch (verifyError) {
            console.error('SMTP Verification Error:', verifyError);
            throw new Error(`Failed to verify SMTP connection: ${verifyError.message}`);
        }

        // Render email template
        let htmlText;
        try {
            const templatePath = path.join(appRootDir, 'views', 'mail', text);
            htmlText = await renderFile(templatePath, sendData);
            console.log('Email template rendered successfully');
        } catch (templateError) {
            console.error('Template Error:', templateError);
            throw new Error(`Failed to render email template: ${templateError.message}`);
        }

        // Prepare mail options
        const mailOptions = {
            from: {
                name: process.env.EMAIL_FROM_NAME || 'Node Shop',
                address: process.env.EMAIL_FROM_EMAIL
            },
            to: to,
            subject: subject,
            html: htmlText
        };

        // Add attachment if provided
        if (attachment) {
            mailOptions.attachments = [{
                filename: attachment.filename,
                path: attachment.filepath,
                contentType: attachment.contentType
            }];
        }

        // Send mail with proper async/await
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', {
            messageId: info.messageId,
            response: info.response,
            accepted: info.accepted,
            rejected: info.rejected
        });

        return true;

    } catch (error) {
        console.error('Send Email Error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });

        // Specific error handling
        if (error.code === 'EAUTH') {
            throw new Error('Email authentication failed. Please check your credentials.');
        } else if (error.code === 'ESOCKET') {
            throw new Error('Failed to connect to email server. Please check your network settings.');
        }

        throw error;  // Re-throw the error for proper handling up the chain
    }
}


module.exports = sendMail;
