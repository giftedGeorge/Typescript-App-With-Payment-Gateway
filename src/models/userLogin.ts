import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const userLoginSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'Users'},
    phoneNumber: {type: String, length: 14, unique: true, required: [true, 'a phone number must be provided!']},
    pin: {type: String, required: [true, 'a pin must be provided!'], trim: true}
}, {
    timestamps: true,
});

const UserLogin = model('UserLogins', userLoginSchema);

export default UserLogin;