// app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import routes from "./Routes/index.js";
import errorHandler from "./Middlewares/errorHandler.js";
import passport from "passport";
import { Strategy } from "passport-http-bearer";
import webhookRoutes from "./Routes/webhook.js";
import c2bRoutes from "./Routes/c2b.js";
import User from "./Models/user.js";
dotenv.config();
passport.use(
  new Strategy(async function (token, cb) {
    try {
      let user = await User.findOne({ token: token });
      if (!user) {
        return cb(null, false);
      }
      return cb(null, user);
    } catch (err) {
      if (err) {
        return cb(err);
      }
    }

    //   db.users.findByToken(token, function(err, user) {
    //     if (err) { return cb(err); }
    //     if (!user) { return cb(null, false); }
    //     return cb(null, user);
    //   });
  })
);

const app = express();
// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", passport.authenticate("bearer", { session: false }), routes);
app.use(
  "/stkpush",
  webhookRoutes
);
app.use(
  "/billmanager",
  webhookRoutes
);
// app.use(
//   "/api/c2b",
//   passport.authenticate("bearer", { session: false }),
//   c2bRoutes
// );

// Error handling middleware (optional)
app.use(errorHandler);

export default app;
