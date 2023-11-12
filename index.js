const Express = require("express")
const Mongoose =require("mongoose")
const BodyParser = require("body-parser")
const Cors = require("cors")
const bcrypt= require('bcrypt')
const jwt =require("jsonwebtoken")
const nodemailer = require('nodemailer');

const path = require("path")

const app= new Express()

app.use(Express.static(path.join(__dirname, "/build")));
app.get("/*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended:true}))
app.use(Cors())

Mongoose.connect("mongodb+srv://aatish:aatish@cluster0.euclaxo.mongodb.net/otpdb?retryWrites=true&w=majority", {useNewUrlParser: true,useUnifiedTopology: true,})



const OtpModel = require('./models/Otp');

app.use(BodyParser.json());

app.post("/getcurotp",async(req,res)=>{
  try {
      var result= await OtpModel.findOne({"otpId":req.body.otpId});
      res.send(result);
  } catch(error){
      res.status(500).send(error);
  }
})



// API to send OTP
app.post('/sendotp', async (req, res) => {
  try {
const { email, otpId } = req.body;

// Save OTP, email, and OTP ID to MongoDB



    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save OTP and email to MongoDB
    await OtpModel.create({ email, otp, otpId: otpId });

    // Send OTP to the provided email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'aatishskumar25@gmail.com',
        pass: 'jmzo gbhm pbuu rztz',
      },
    });

    const mailOptions = {
      from: 'aatishskumar25@gmail.com',
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to send OTP' });
      }
      console.log(`Email sent: ${info.response}`);
      res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





app.listen(3012,()=>{
    console.log("Server Started")
})

