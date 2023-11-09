import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const userSchema = new Schema({
    firstName: {type: String, maxLength: [20, 'first name cannot exceed 20 characters!'], trim: true},
    lastName: {type: String, maxLength: [20, 'last name cannot exceed 20 characters!'], trim: true},
    phoneNumber: {type: String, length: 14, unique: true, required: [true, 'a phone number must be provided!'], trim: true},
    email: {type: String, trim: true},
    bvn: {type: String, length: [11, 'BVN must be 11 numbers!'], trim: true},
    userType: {type: Number},
    isInterestAllowed: {type: Boolean, default: true}
}, {
    timestamps: true,
});

const User = model('Users', userSchema);

export default User;