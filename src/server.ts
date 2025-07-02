import path from "path";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import express from "express";
import { readdirSync } from "fs";
dotenv.config();
// initial app
const app = express();
const port = process.env.PORT ?? 5500;
// set middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// route
const routes = path.join(__dirname, "routes");
const route_files = readdirSync(routes);
for (let route of route_files) app.use("/api", require("./routes/" + route));
// listen
app.listen(port, () => console.log(`The server is running on http://localhost:${port}`));