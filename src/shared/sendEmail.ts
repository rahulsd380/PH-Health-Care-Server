import nodemailer from 'nodemailer'

export const sendEmail = async (to:string, html:string) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "rahulsd380@gmail.com",
          pass: "yomx kvvv cdua nnmc",
        },
      });

      await transporter.sendMail({
        from: 'rahulsd380@gmail.com', // sender address
        to,
        subject: "Reset your password within 5 minutes", // Subject line
        text: "Reset your password within 5 minutes", // plain text body
        html
      });
}