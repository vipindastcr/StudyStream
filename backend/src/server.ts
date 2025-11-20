

import express from "express";
import { env } from "@infrastructure/config/env";
import userRoutes from "@presentation/routes/userRoutes"
import cors from "cors";
import { connectDB} from "@infrastructure/database/connection"


const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

connectDB();

app.use("/api/users", userRoutes)

app.listen(5000, () => {
  console.log(`Server running on http://localhost:5000`);
});
