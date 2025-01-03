import {
  clerkMiddleware,
  createClerkClient,
  requireAuth,
} from "@clerk/express";
import cors from "cors";
import dotenv from "dotenv";
import * as dynamoose from "dynamoose";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

/* ROUTE IMPORTS */

import courseRouter from "./routes/courseRoutes";
import userClerkRoutes from "./routes/userClerkRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import userCourseProgressRoutes from "./routes/userCourseProgressRoutes";

/* CONFIGURATIONS */
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  dynamoose.aws.ddb.local();
}

export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use(clerkMiddleware());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/course", courseRouter);
app.use("/api/user/clerk", requireAuth(), userClerkRoutes);
app.use("/api/transaction", requireAuth(), transactionRoutes);
app.use("/api/user/course-progress", requireAuth(), userCourseProgressRoutes);

/* SERVER */
const port = process.env.PORT || 3000;
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
