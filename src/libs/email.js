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

export const sendCustomPasswordResetEmail = async (email, link) => {
  let htmlMessage = '';

  htmlMessage += `<p>A request for password change was initiated from Asker website.`
  htmlMessage += ` If this was you please follow link below. Otherwise just ignore this message.</p>`;
  htmlMessage += `<p><strong>Link:</strong> <a href="${link}">${link}</a></p>`;
  htmlMessage += `<div><em>Asker platform</em></div>`;

  return transporter.sendMail({
    from: process.env.NEXT_PUBLIC_NOREPLY_EMAIL,
    to: email,
    subject: "Password change",
    text: striptags(htmlMessage),
    html: htmlMessage
  });
}

export const sendInvitationEmail = async (email, password, company) => {
  let htmlMessage = '';

  if (company && company.id != 'asker') {
    htmlMessage += `<p>Company invites you to join their shared Asker account.`
  } else {
    htmlMessage += `<p>Asker team invites you to join their platform.`
  }

  htmlMessage += ` Below you'll find a login link and authentication credentials.</p>`;
  htmlMessage += `<p><strong>Link:</strong> <a href="${process.env.NEXT_PUBLIC_PLATFORM_URL}login">${process.env.NEXT_PUBLIC_PLATFORM_URL}login</a></p>`;
  htmlMessage += `<p><strong>Username:</strong> ${email}</p>`;
  htmlMessage += `<p><strong>Password:</strong> ${password}</p>`;

  htmlMessage += `<div><em>Asker platform</em></div>`;

  return transporter.sendMail({
    from: process.env.NEXT_PUBLIC_NOREPLY_EMAIL,
    to: email,
    subject: "Your credentials",
    text: striptags(htmlMessage),
    html: htmlMessage
  });
}
