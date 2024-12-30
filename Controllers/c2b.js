import { mpesa } from "../Services/mpesa.js";

export const stkPush = async (req, res) => {
  const Amount = req.body.Amount;
  const AccountReference = req.body.AccountReference;
  const PartyA = req.body.PartyA;
  const PhoneNumber = req.body.PhoneNumber;
  const TransactionDesc = req.body.TransactionDesc;

  try {
    let stkPushResponse = await mpesa.lipaNaMpesaOnline({
      BusinessShortCode: "174379",
      Amount,
      PartyA,
      PartyB: "174379",
      PhoneNumber,
      CallBackURL:
        "https://2e9a-154-227-128-119.ngrok-free.app/stkpush/webhook",
      AccountReference,
      passKey:
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
      TransactionType: "CustomerPayBillOnline" /* OPTIONAL */,
      TransactionDesc /* OPTIONAL */,
    });
    console.log(stkPushResponse);
    res.json({ message: "Stk Push Success", stkPushResponse });
  } catch (error) {
    res.status(400).json({ message: "Error Creating StkPush", error });
  }
};

export const stkQuery = async (req, res) => {
  const CheckoutRequestID = req.body.CheckoutRequestID;

  try {
    let stkPushResponse = await mpesa.lipaNaMpesaQuery({
      BusinessShortCode: "174379",
      passKey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
      CheckoutRequestID,
    });
    console.log(stkPushResponse);
    res.json({ message: "Stk query Success", stkPushResponse });
  } catch (error) {
    res.status(400).json({ message: "Error Creating StkPush", error });
  }
};
