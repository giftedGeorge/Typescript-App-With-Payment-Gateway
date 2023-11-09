import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const transactionSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'Users'},
    name: {type: String, trim: true},
    amount: {type: String, required: [true, 'amount must be provided!'], trim: true},
    paymentReference: {type: String, unique: true},
}, {
    timestamps: true,
});

const Transaction = model('Transactions', transactionSchema);

export default Transaction;