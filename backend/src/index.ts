import express, { Express, Request, Response } from "express";
import env from "../env";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import corsOptions from "@/config/cors";

const app: Express = express();
const port = env.BACKEND_API_PORT ?? 3001;

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.session());

import authRoutes from "@/routes/auth"
import isAuthenticated from "@/middleware/auth";

app.use("/api/auth", authRoutes);

// Everything below this line will require authentication
app.use(isAuthenticated);

app.get("/protected", (req: Request, res: Response) => {
  res.status(200).json({ message: "If you are reading this you are authenticated" });
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});