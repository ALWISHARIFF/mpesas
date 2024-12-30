
import { Router } from "express";
import { webhook } from "../Controllers/webhook.js";

const router = Router();

// Create a new user
router.post("/webhook",webhook);
router.post("/billmanager-webhook",webhook);


export default router;
