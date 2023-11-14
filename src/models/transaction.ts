import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const transactionSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'Users'},
    type: {type: Number, required: true},
    currency: {type: String, default: 'NGN'},
    amount: {type: Number, required: [true, 'amount must be provided!']},
    recipientAccountNo: {type: String, length: 10},
    recipientBankName: {type: String},
    recipientAccountName: {type: String},
    recipientWalletId: {type: String},
    description: {type: String},
    code: {type: String},
    codeType: {type: Number},    
    transactionReference: {type: String, unique: true},
    status: {type: String}
}, {
    timestamps: true,
});

const Transaction = model('Transactions', transactionSchema);

export default Transaction;