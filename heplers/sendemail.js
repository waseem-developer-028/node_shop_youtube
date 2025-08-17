const nodemailer = require("nodemailer");
const { renderFile } = require("ejs");
const path = require("path");

// Get the root directory
const appRootDir = path.resolve(process.cwd());

const sendMail = async (
  to,
  subject,
  templateFile, // e.g. "welcome.ejs"
  sendData = {},
  attachment = null
) => {
  try {
    // Setup transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Render EJS template to HTML
    let htmlText;
    try {
      const templatePath = path.join(appRootDir, "views", "mail", templateFile);
      htmlText = await renderFile(templatePath, sendData);
    } catch (e) {
      console.error("EJS Render Error:", e);
      return e;
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM_EMAIL,
      to,
      subject,
      text: '',
      html: htmlText,
      ...(attachment && {
        attachments: [
          {
            filename: attachment.filename,
            path: attachment.filepath,
            contentType: attachment.contentType,
          },
        ],
      }),
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return true;

  } catch (err) {
    console.error("Send Email Error:", err);
    return err;
  }
};

module.exports = sendMail;
