import express from "express";
import { authControllers } from "./auth.controllers";

const route = express.Router();

// POST method
route.post('/signin', authControllers.loginUser);

export const authRoutes = route;