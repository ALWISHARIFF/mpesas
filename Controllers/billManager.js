import { mpesa } from "../Services/mpesa.js";

export const onBoardingOptin = async (req, res) => {
  console.log("hello");
  const shortcode = req.body.shortcode;
  const email = req.body.email;
  const officialContact = req.body.officialContact;
  const sendReminders = req.body.sendReminders;
  const callbackurl = req.body.callbackurl;
  const logo = req.body.logo;
  try {
    let stkPushResponse = await mpesa.billManagerOnBoarding({
        BusinessShortCode: shortcode,
        email: email,
        officialContact,
        sendReminders,
        callbackurl,
        logo,
      });
      console.log(stkPushResponse);
  } catch (error) {
    console.error(error)
  }
  
  
};

export const stkQuery = async (req, res) => {
  const CheckoutRequestID = req.body.CheckoutRequestID;

  try {
    let stkPushResponse = await mpesa.lipaNaMpesaQuery({
      BusinessShortCode: "174379",
      passKey:
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
      CheckoutRequestID,
    });
    console.log(stkPushResponse);
    res.json({ message: "Stk query Success", stkPushResponse });
  } catch (error) {
    res.status(400).json({ message: "Error Creating StkPush", error });
  }
};
