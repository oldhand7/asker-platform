import nodemailer from 'nodemailer'
import striptags from 'striptags';

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  // secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
});

export const sendCustomPasswordResetEmail = async (userEmail, link) => {
  let htmlMessage = '';

  htmlMessage += `<p>A request for password change was initiated from Asker website.`
  htmlMessage += ` If this was you plese follow link below. Otherwise just ignore this message.</p>`;
  htmlMessage += `<p><strong>Link:</strong> <a href="${link}">${link}</a></p>`;
  htmlMessage += `<div><em>Asker team</em></div>`;

  return transporter.sendMail({
    from: process.env.NEXT_PUBLIC_NOREPLY_EMAIL,
    to: userEmail,
    subject: "Password change",
    text: striptags(htmlMessage),
    html: htmlMessage
  });
}
