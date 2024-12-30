// routes/c2b.js
import { Router } from "express";
import { onBoardingOptin } from "../Controllers/billManager.js";
// import { stkPush, stkQuery } from "../Controllers/c2b.js";

const router = Router();

// Create a new user
router.post("/onboardingoptin", onBoardingOptin);
// router.post("/singleinvoicing");
// router.post("/bulkinvoicing");
// router.post("/cancelinvoice");
// router.post("/cancelinvoices");
// router.post("/updateoptin");


export default router;
