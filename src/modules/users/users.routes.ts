import express from "express";
import { usersControllers } from "./users.controllers";

const route = express.Router();

// POST method
route.post('/auth/signup', usersControllers.createUser);

// GET method
route.get("/users", usersControllers.getUsers);
route.get("/users/:userId", usersControllers.getUserById);

// DELETE method
route.delete("/users/:userId", usersControllers.deleteUserById);

// PUT method
route.put("/users/:userId", usersControllers.updateUserById);

export const usersRoutes = route;