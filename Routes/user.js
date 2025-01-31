// routes/userRoutes.js
import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../Controllers/user.js";

const router = Router();

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getUsers);

// Get a user by ID
router.get("/:id", getUserById);

// Update a user by ID
router.put("/:id", updateUser);

// Delete a user by ID
router.delete("/:id", deleteUser);

export default router;
