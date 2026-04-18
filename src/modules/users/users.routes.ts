import express from "express";
import { usersControllers } from "./users.controllers";

const route = express.Router();

// POST method
route.post('/auth/signup', usersControllers.createUser);

export const usersRoutes = route;