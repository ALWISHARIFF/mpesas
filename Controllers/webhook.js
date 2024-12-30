import MpesaTransaction from "../Models/Transaction.js";

export const webhook = async (req, res) => {
  console.log(req.body);
  try {
    const data = req.body.Body.stkCallback;

    const transaction = new MpesaTransaction({
      MerchantRequestID: data.MerchantRequestID,
      CheckoutRequestID: data.CheckoutRequestID,
      ResultCode: data.ResultCode,
      ResultDesc: data.ResultDesc,
      Amount: data.CallbackMetadata?.Item[0].Value,
      MpesaReceiptNumber: data.CallbackMetadata?.Item[1].Value,
      Balance: data.CallbackMetadata?.Item[2].Value,
      TransactionDate: data.CallbackMetadata?.Item[3].Value,
      PhoneNumber: data.CallbackMetadata?.Item[4].Value,
    });
    try {
      await transaction.save();
      console.log("Transaction saved successfully");
      res.json({ message: "WEBHOOK DATA SAVED" });
    } catch (error) {
      console.error("Error saving transaction:", error);
      res.json({ message: "Error saving transaction" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error Creating StkPush", error });
  }
};

export const webhookBillManager = async (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "OK" });
};
