const Mongoose = require("mongoose")
const OtpSchema =Mongoose.Schema(
    {
        email:String,
        otp: Number,
        otpId:String

    }
);
const OtpModel = Mongoose.model("Otp",OtpSchema);
module.exports = OtpModel;