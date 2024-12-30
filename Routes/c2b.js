// routes/c2b.js
import { Router } from "express";
import { stkPush, stkQuery } from "../Controllers/c2b.js";

const router = Router();

// Create a new user
router.post("/stkpush",stkPush );
router.post("/stkquery",stkQuery );

// // Get all users
// router.get("/", getUsers);

// // Get a user by ID
// router.get("/:id", getUserById);

// // Update a user by ID
// router.put("/:id", updateUser);

// Delete a user by ID

export default router;
