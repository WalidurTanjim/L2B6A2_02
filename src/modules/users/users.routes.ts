import express from "express";
import { usersControllers } from "./users.controllers";

const route = express.Router();

// POST method
route.post('/auth/signup', usersControllers.createUser);

// GET method
route.get("/users", usersControllers.getUsers);

export const usersRoutes = route;