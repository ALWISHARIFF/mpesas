// models/MpesaTransaction.js
import mongoose from 'mongoose';

const mpesaTransactionSchema = new mongoose.Schema({
  MerchantRequestID: {
    type: String,
    required: true,
  },
  CheckoutRequestID: {
    type: String,
    required: true,
  },
  ResultCode: {
    type: Number,
    required: true,
  },
  ResultDesc: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
   
  },
  MpesaReceiptNumber: {
    type: String,
  
  },
  Balance: {
    type: Number,
    required: false,
  },
  TransactionDate: {
    type: Date,
    
  },
  PhoneNumber: {
    type: String,
    
  },
}, {
  timestamps: true,
});

const MpesaTransaction = mongoose.model('MpesaTransaction', mpesaTransactionSchema);

export default MpesaTransaction;
