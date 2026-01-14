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
import {
	StandardCheckoutClient,
	Env,
	StandardCheckoutPayRequest,
} from "pg-sdk-node";
import { randomUUID } from "crypto";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const clientVersion = process.env.CLIENT_VERSION;
const env = Env.SANDBOX;

const client = StandardCheckoutClient.getInstance(
	clientId,
	clientSecret,
	clientVersion,
	env
);

app.post("/api/create-payment", async (req, res) => {
	try {
		const amount = req.body;
		if (!amount) {
			return res.status(400).send("Amount Is Required");
		}

		const merchantOrderId = randomUUID();
		const redirectUrl = `http://localhost:${process.env.PORT}/api/check-status?merchantOrderId=${merchantOrderId}`;

		const request = StandardCheckoutPayRequest.builder()
			.merchantOrderId(merchantOrderId)
			.amount(amount)
			.redirectUrl(redirectUrl)
			.build();

		const response = await client.pay(request);

		return res.json({
			checkoutPageUrl: response.redirectUrl,
		});
	} catch (error) {
		console.error("Error Creating Order" + error);
		res.status(500).send(error);
	}
});

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
