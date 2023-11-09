import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const otpSchema = new Schema({
    phoneNumber: {type: String, length: 14, unique: true, required: [true, 'a phone number must be provided!'], trim: true},
    code: {type: String, required: true, trim: true},
}, {
    timestamps: true,
});

const Otp = model('Otps', otpSchema);

export default Otp;