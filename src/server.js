import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import usersRoute from "./routes/usersRoute.js";
import suppliersRoute from "./routes/suppliersRoute.js";
import productsRoute from "./routes/productsRoute.js";
import job from "./config/cron.js";

dotenv.config();
const app = express();
if (process.env.NODE_ENV === "production") job.start();
app.use(rateLimiter);
// middleware
app.use(express.json());
const PORT = process.env.PORT || 5002;

app.get("/api/health", (req, res) => {
    res.status(200),json({ status: "ok"});
});

app.get("/", (req, res) => 
{ res.send("It's working");
});

app.use("/api/transactions",transactionsRoute);
app.use("/api/users", usersRoute);
app.use("/api/suppliers", suppliersRoute);
app.use("/api/products", productsRoute);

initDB().then(() => {
    app.listen(PORT, () => {
    console.log("server is up and runnig on port: " , PORT);
});
});