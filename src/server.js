import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";

import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
// import swaggerDocument  from "./swagger-output.json" assert { type: 'json' };
import { connectDB } from "./config/db.js";
import { uploadRouter } from "./uploadthing.js";
import { createRouteHandler } from "uploadthing/express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(
	"/api/uploadthing",
	createRouteHandler({
		router: uploadRouter,
	})
);

app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);


const swaggerDocument = JSON.parse(
	readFileSync(new URL("./swagger-output.json", import.meta.url), "utf-8")
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB()
	.then(() => {
		app.on("error", (error) => {
			console.log("server Error", error);
		});
		app.listen(process.env.PORT || 3000, () => {
			console.log(
				`server is listning on port ${process.env.PORT || 3000}`
			);
		});
	})
	.catch((err) => {
		console.log("MONGODB Connection FAILED:", err);
	});
