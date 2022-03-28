import nc from "next-connect";
import nodemailer from 'nodemailer'
const handler = nc();
var escape = require('escape-html');

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  // secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
});


handler.post(async (req, res) => {
  let htmlMessage = '';

  htmlMessage += `<p>You got a new message.</p>`;
  htmlMessage += `<p><strong>Name:</strong> ${escape(req.body.contact_name)}</p>`;
  htmlMessage += `<p><strong>Email:</strong> ${escape(req.body.contact_email)}</p>`;
  htmlMessage += `<p><strong>Message:</strong></p>`;
  htmlMessage += `<div><em>${escape(req.body.contact_message)}</em></div>`;

  let info = await transporter.sendMail({
    from: process.env.NEXT_PUBLIC_NOREPLY_EMAIL,
    to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    subject: "New message via ASKER web from",
    text: '',
    html: htmlMessage
  });

  res.json({
    success: true
  })
});

export default handler;
