import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const signUpSchema = new Schema({
    phoneNumber: {type: String, length: 14, unique: true, required: [true, 'a phone number must be provided!'], trim: true},
    userType: {type: Number, required: [true, 'type of user must be provided'], trim: true},
    isInterestAllowed: {type: Boolean, default: true},
    isPhoneNumberVerified: {type: Boolean, default: false}
}, {
    timestamps: true,
});

const SignUp = model('SignUps', signUpSchema);

export default SignUp;