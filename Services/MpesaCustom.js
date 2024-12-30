"use strict";

import { Buffer } from "buffer";
import { RSA_PKCS1_PADDING } from "constants";
import { publicEncrypt } from "crypto";
import { promises as fs } from "fs";
import { resolve } from "path";
import { routes } from "./routes.js";
import { HttpService } from "./services/http.service.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// let __dirname = dirname
class Mpesa {
  constructor(
    {
      clientKey,
      clientSecret,
      securityCredential,
      initiatorPassword,
      certificatePath,
    },
    environment
  ) {
    this.clientKey = clientKey;
    this.clientSecret = clientSecret;
    this.environment = environment;
    this.http = new HttpService({
      baseURL:
        environment === "production" ? routes.production : routes.sandbox,
      headers: { "Content-Type": "application/json" },
    });

    if (!securityCredential && !initiatorPassword) {
      throw new Error(
        "Provide either securityCredential or initiatorPassword."
      );
    }

    if (!securityCredential) {
      this.generateSecurityCredential(initiatorPassword, certificatePath);
    } else {
      this.securityCredential = securityCredential;
    }
  }

  async authenticate() {
    const response = await this.http.get(routes.oauth, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${this.clientKey}:${this.clientSecret}`).toString(
            "base64"
          ),
      },
    });
    console.log(response.data.access_token)
    return response.data.access_token;
  }

  async generateSecurityCredential(password, certificatePath) {
    const certificateBuffer = certificatePath
      ? await fs.readFile(certificatePath)
      : await fs.readFile(
          resolve(
            __dirname,
            this.environment === "production"
              ? "keys/production-cert.cer"
              : "keys/sandbox-cert.cer"
          )
        );

    const certificate = String(certificateBuffer);
    this.securityCredential = publicEncrypt(
      {
        key: certificate,
        padding: RSA_PKCS1_PADDING,
      },
      Buffer.from(password)
    ).toString("base64");
  }

  async c2bRegister({
    ShortCode,
    ResponseType,
    ConfirmationURL,
    ValidationURL,
  }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.c2bregister,
      { ShortCode, ResponseType, ConfirmationURL, ValidationURL },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async c2bSimulate({
    ShortCode,
    CommandID,
    Amount,
    Msisdn,
    BillRefNumber = "account",
  }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.c2bsimulate,
      { ShortCode, CommandID, Amount, Msisdn, BillRefNumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async transactionStatus({
    Initiator,
    CommandID = "TransactionStatusQuery",
    TransactionID,
    PartyA,
    IdentifierType,
    ResultURL,
    QueueTimeOutURL,
    Remarks = "Transaction Status",
    Occasion = "TransactionStatus",
  }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.transactionStatus,
      {
        Initiator,
        SecurityCredential: this.securityCredential,
        CommandID,
        TransactionID,
        PartyA,
        IdentifierType,
        ResultURL,
        QueueTimeOutURL,
        Remarks,
        Occasion,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async b2c({
    Initiator,
    CommandID,
    Amount,
    PartyA,
    PartyB,
    Remarks = "account",
    QueueTimeOutURL,
    ResultURL,
    Occasion = "account",
  }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.b2c,
      {
        InitiatorName: Initiator,
        SecurityCredential: this.securityCredential,
        CommandID,
        Amount,
        PartyA,
        PartyB,
        Remarks,
        QueueTimeOutURL,
        ResultURL,
        Occasion,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async lipaNaMpesaOnline({
    BusinessShortCode,
    passKey,
    TransactionDesc = "Lipa Na Mpesa Online",
    TransactionType = "CustomerPayBillOnline",
    PartyA,
    PartyB,
    Amount,
    AccountReference,
    CallBackURL,
    PhoneNumber,
  }) {
    const Timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);
    const Password = Buffer.from(
      `${BusinessShortCode}${passKey}${Timestamp}`
    ).toString("base64");
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.stkPush,
      {
        BusinessShortCode,
        Password,
        Timestamp,
        TransactionType,
        Amount,
        PartyA,
        PartyB,
        PhoneNumber,
        CallBackURL,
        AccountReference,
        TransactionDesc,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async lipaNaMpesaQuery({ BusinessShortCode, passKey, CheckoutRequestID }) {
    const Timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);
    const Password = Buffer.from(
      `${BusinessShortCode}${passKey}${Timestamp}`
    ).toString("base64");
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.stkQuery,
      {
        BusinessShortCode,
        Password,
        Timestamp,
        CheckoutRequestID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async reversal({
    Initiator,
    CommandID = "TransactionReversal",
    TransactionID,
    Amount,
    ReceiverParty,
    RecieverIdentifierType = "4",
    ResultURL,
    QueueTimeOutURL,
    Remarks = "Transaction Reversal",
    Occasion = "TransactionReversal",
  }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.reversal,
      {
        Initiator,
        SecurityCredential: this.securityCredential,
        CommandID,
        TransactionID,
        Amount,
        ReceiverParty,
        RecieverIdentifierType,
        ResultURL,
        QueueTimeOutURL,
        Remarks,
        Occasion,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async accountBalance({
    Initiator,
    CommandID = "AccountBalance",
    PartyA,
    IdentifierType = "4",
    Remarks = "Account Balance",
    QueueTimeOutURL,
    ResultURL,
  }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.accountbalance,
      {
        Initiator,
        SecurityCredential: this.securityCredential,
        CommandID,
        PartyA,
        IdentifierType,
        Remarks,
        QueueTimeOutURL,
        ResultURL,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async billManagerOnBoarding({
    BusinessShortCode,
    email,
    officialContact,
    sendReminders,
    logo,
    callbackurl,
  }) {
    const token = await this.authenticate();
    
    const response = await this.http.post(
      routes.billManagerOnboarding,
      {
        shortcode:BusinessShortCode,
        email,
        officialContact,
        sendReminders,
        logo,
        callbackurl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response)
    return response.data;
  }
  async billManagerSingleInvoicing({
    externalReference,
    billedFullName,
    billedPhoneNumber,
    billedPeriod,
    invoiceName,
    dueDate,
    accountReference,
    amount,
    invoiceItems,
  }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.billManagerSingleInvoice,
      {
        externalReference,
        billedFullName,
        billedPhoneNumber,
        billedPeriod,
        invoiceName,
        dueDate,
        accountReference,
        amount,
        invoiceItems,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async billManagerBulkInvoicing(invoices) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.billManagerBulkInvoice,
      invoices,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async billManagerCancelInvoice({ externalReference }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.cancelSingleInvoice,
      { externalReference },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async billManagerCancelBulkInvoice(ExternalReferences) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.cancelSingleInvoice,
      ExternalReferences,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async billManagerAcknowledgment({
    paymentDate,
    paidAmount,
    accountReference,
    transactionId,
    phoneNumber,
    fullName,
    invoiceName,
    externalReference,
  }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.billManagerReconciliation,
      {
        paymentDate,
        paidAmount,
        accountReference,
        transactionId,
        phoneNumber,
        fullName,
        invoiceName,
        externalReference,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  async billManagerOnBoardingUpdate({
    BusinessShortCode,
    email,
    officialContact,
    senReminders,
    logo,
    callbackurl,
  }) {
    const token = await this.authenticate();
    const response = await this.http.post(
      routes.billManagerOnboarding,
      {
        BusinessShortCode,
        email,
        officialContact,
        senReminders,
        logo,
        callbackurl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  
}

export { Mpesa };
