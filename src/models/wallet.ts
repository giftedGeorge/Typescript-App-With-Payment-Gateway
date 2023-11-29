import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const walletSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'Users', unique: true, required: true},
    balance: {type: Number, default: 0},
    currency: {type: String, default: 'NGN'},
    accountNumber: {type: String, length: 10},
    recipientCode: {type: String},
    bankCode: {type: String},
    customerCode: {type: String},
}, {
    timestamps: true
});

const Wallet = model('Wallets', walletSchema);

export default Wallet;