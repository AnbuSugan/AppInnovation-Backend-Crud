import * as nodemailer from 'nodemailer';
import ProductModel from "../models/product";
import schedule from 'node-schedule';
import env from "../util/validateEnv";


export const cronJob = () => {
const transporter  = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: env.MAILTRAP_USER,
      pass: env.MAILTRAP_PASS
    }
  });

  
  const job = schedule.scheduleJob('* * * * * *', async () => {
  
    try {
      const products = await ProductModel.find().exec();
      const productList = products
        .map(product => `<li>${product.name}: ${product.price}</li>`)
        .join("");  

      const mailOptions = {
        from: "anbarasudhandapani18@gmail.com",
        to: "noreply@jvlcart.com",
        subject: "Product List",
        html: `<h2>List of Products</h2><ul>${productList}</ul>`
      };
      await transporter.sendMail(mailOptions);
    console.log("Email sent with product list");
  } catch (error) {
    console.error("Error sending email:", error);
  }
});


setTimeout(() => {
    job.cancel(); 
    console.log('Scheduler cancelled. Performing graceful shutdown.');
    // process.exit(0); 
  }, 100);
};