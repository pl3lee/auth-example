import express from 'express';
import cors from "cors";
import { authRouter } from "./routes/auth";
import { Pool } from "pg";
import dotenv from "dotenv";

export const app = express();
const port = 3001;
dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432")
});

const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};
connectToDB();


app.use(express.json());
app.use(cors());

app.use("/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});