// routes/index.js
import { Router } from "express";
import user from "./user.js";
import c2b from "./c2b.js";
import billManager from "./billManager.js";

const router = Router();

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});
router.use("/user", user);
router.use("/c2b",c2b);
router.use("/billmanager",billManager);
// router.use("/stkpush",webhook);
export default router;
