const nodemailer = require("nodemailer");

let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

exports.sendResetPasswordEmail = async (userEmail, resetToken) => {
  const transporter = await getTransporter();

  const resetLink = `http://localhost:3000/auth/login/modal/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: '"Soporte de ZoSale" <no-reply@tuapp.com>',
    to: userEmail,
    subject: "Restablecimiento de contraseña",
    html: `
      <p>Hola,</p>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Este enlace expirará en 15 minutos.</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Email enviado:", info.messageId);
  console.log("Vista previa:", nodemailer.getTestMessageUrl(info));

  return nodemailer.getTestMessageUrl(info);
};
