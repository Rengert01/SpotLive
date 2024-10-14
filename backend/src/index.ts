import sequelize from "@/config/sequelize";
import express, { Express, Request, Response } from "express";
import env from "env";

const app: Express = express();
const port = env.BACKEND_API_PORT ?? 3001;

app.get("/", async (req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    res.send("Connection to sequelize has been established successfully.");
  } catch (error) {
    console.log(error);
    res.send("Error").status(500);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});