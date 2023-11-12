const Express = require("express")
const Mongoose =require("mongoose")
const BodyParser = require("body-parser")
const Cors = require("cors")
const bcrypt= require('bcrypt')
const jwt =require("jsonwebtoken")
const nodemailer = require('nodemailer');



const app= new Express()

app.use(Express.static(path.join(__dirname, "./build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./build/index.html"),
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


// app.post('/verifyotp', async (req, res) => {
//   try {
//     const { email, enteredOTP } = req.body;

//     // Find the saved OTP for the provided email
//     const savedOTPData = await OtpModel.findOne({ email });

//     if (!savedOTPData) {
//       return res.status(404).json({ message: 'OTP data not found' });
//     }

//     const savedOTP = savedOTPData.otp;

//     if (savedOTP === enteredOTP) {
//       // OTP is correct, navigate to "/welcome"
//       res.status(200).json({ message: 'OTP verification successful' });
//     } else {
//       res.status(401).json({ message: 'Incorrect OTP' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// app.use(bodyParser.json());

// // Endpoint to send OTP
// app.post("/send-otp", async (req, res) => {
//   const { email } = req.body;

//   // Generate a random OTP
//   const otp = Math.floor(100000 + Math.random() * 900000);

//   // Save OTP to MongoDB using the otpModel
//   try {
//     const newOTP = new otpModel({ email, otp });
//     await newOTP.save();
//   } catch (error) {
//     return res.status(500).json({ message: "Error saving OTP to the database" });
//   }

//   // Send OTP to the provided email
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "your_email@gmail.com", // Replace with your email
//       pass: "your_email_password", // Replace with your email password
//     },
//   });

//   const mailOptions = {
//     from: "your_email@gmail.com", // Replace with your email
//     to: email,
//     subject: "Your OTP",
//     text: `Your OTP is: ${otp}`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).json({ message: "Error sending OTP via email" });
//     }
//     res.status(200).json({ message: "OTP sent successfully" });
//   });
// });
// Create a mongoose schema and model for storing OTPs

  
  // Body parser middleware
//   app.use(BodyParser.json());
  
//   // Endpoint to send OTP
//   app.post("/send-otp", async (req, res) => {
//     const { email, otp } = req.body;
  
//     // Save OTP to MongoDB
//     try {
//       const newOTP = new OTP({ email, otp });
//       await newOTP.save();
//     } catch (error) {
//       return res.status(500).json({ message: "Error saving OTP to the database" });
//     }
  
//     // Send OTP to the provided email
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: "your_email@gmail.com", // Replace with your email
//         pass: "your_email_password", // Replace with your email password
//       },
//     });
  
//     const mailOptions = {
//       from: "your_email@gmail.com", // Replace with your email
//       to: email,
//       subject: "Your OTP",
//       text: `Your OTP is: ${otp}`,
//     };
  
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         return res.status(500).json({ message: "Error sending OTP via email" });
//       }
//       res.status(200).json({ message: "OTP sent successfully" });
//     });
//   });
  


// app.post("/signupa",async (req,res)=>{
//     console.log(req.body)
//     const newUsera = new UseraModel (req.body)
//     await newUsera.save(
    
//         (error,data)=>{
//             if (error) {
//                 res.json({"Status": "Error" ,"Error": error})
//             } else {
//                 res.json({"Status":"Success", "Data":data})
//             }
//         }
//     ) 
// })



// app.post("/signup",async(req,res)=>{
//     console.log(req.body)
//     const newUser = new UserModel ({name :req.body.name, 
//         address :req.body.address,
//         phonenumber:req.body.phonenumber,
//         email: req.body.email,
//         username: req.body.username,
//         password: bcrypt.hashSync(req.body.password,10) })
//     await newUser.save(
      
//         (error,data)=>{
//             if(error){
//                 res.json({"Status":"Error","Error":error})
            
//             }
//             else{
//                 res.json({"Status":"Success","Data":data})
//             }
//         }
//     )
// })
// app.post("/addposts",(req,res)=>{

//     jwt.verify(req.body.token,"ictacademy",(err,decoded)=>{
//         if(decoded && decoded.username){
            

//             let newPost = new PostModel ({userid :req.body.userid, 
//                 post :req.body.post })
//                 newPost.save()
//                 res.json({"status":"post added successfully"})
//         }
//         else{
//             res.json({"status":"unauthorised user"})
//         }
//     })
//     // console.log(req.body)
//     // const newPost = new PostModel (req.body)
//     // await newPost.save(
//     //     (err,data)=>{
//     //     if(err){
//     //         res.json({"Status": "Error", "Error":err})
//     //     }
//     //     else{
//     //         res.json({"Status":"Success","Data":data})
//     //     }
//     //     })
// })

// app.get("/viewallposts",async(req,res)=>{
//     try{
//         var result= await PostModel.find();
//     res.send(result);
//     } catch(error){
//         res.status(500).send(error);
//     }
// })

// app.post("/viewmyposts",async(req,res)=>{
//     try {
//         var result= await PostModel.find({"userid":req.body.userid});
//         res.send(result);
//     } catch(error){
//         res.status(500).send(error);
//     }
// })

// app.post("/viewmyprofile",async(req,res)=>{
//     try {
//         var result= await UserModel.findOne({"_id":req.body._id});
//         res.send(result);
//     } catch(error){
//         res.status(500).send(error);
//     }
// })

// app.post("/login",async(req,res)=>{
//     var getUsername = req.body.username
//     var password = req.body.password
//     let result = UserModel.find({username:getUsername}, (err,data)=>{
//         if (data.length>0){
//             const passwordValidator = bcrypt.compareSync(password,data[0].password)
//             if (passwordValidator){
//                 // res.send({"status":"success","data":data})
//                 jwt.sign({username: getUsername ,id:data[0]._id},"ictacademy",{expiresIn:"1d"},
//                 (err,token)=>{
//                     if(err){
//                         res.json({"status":"error","error":err})
//                     }else{
//                         res.json({"status":"success","data":data,"token":token})
//                     }
//                 })

//             }else{
//                 res.send({"status":"failed","data":"invalid username"})
//             }

//         }else{
//             res.send({"status":"failed","data":"invalid username"})
//         }
// })
//     // UserModel.find(
//     //     {
//     //     $and: [{username : req.body.username},{password: req.body.password}]
//     //     }
//     // ).then(
//     //     (data)=>{
//     //         res.json({"data":data})
//     //     }
//     // ).catch(
//     //     (error)=>{
//     //         res.json({"Error":error})
//     //     }
//     // )
    
// })


app.listen(3012,()=>{
    console.log("Server Started")
})

