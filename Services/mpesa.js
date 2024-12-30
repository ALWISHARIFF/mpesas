import { Mpesa } from "./MpesaCustom.js";

const credentials = {
  clientKey: process.env.clientKey,
  clientSecret: process.env.clientSecret,
  initiatorPassword: process.env.initiatorPassword,
  // securityCredential:process.env.securityCredential
};
let environment = process.env.environment
export const mpesa = new Mpesa(credentials, environment);


// export const stkPushService = () => {
//   mpesa
//     .lipaNaMpesaOnline({
//       BusinessShortCode: 123456,
//       Amount: 1000 /* 1000 is an example amount */,
//       PartyA: "Party A",
//       PhoneNumber: "Phone Number",
//       CallBackURL: "CallBack URL",
//       AccountReference: "Account Reference",
//       passKey: "Lipa Na Mpesa Pass Key",
//       TransactionType: "Transaction Type" /* OPTIONAL */,
//       TransactionDesc: "Transaction Description" /* OPTIONAL */,
//     })
//     .then((response) => {
//       //Do something with the response
//       //eg
//       console.log(response);
//     })
//     .catch((error) => {
//       //Do something with the error;
//       //eg
//       console.error(error);
//     });
// };
