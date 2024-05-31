import express from "express";
import notes from "./routes/notes.js";
import auth from "./routes/auth.js";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();

app.use(express.json());

app.use(express.static("dist"));
app.use("/api/notes", notes);
app.use("/api/auth", auth);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

if (process.env.AWS_CLIENT_ID === undefined) {
  console.error("YOU MIGHT NOT HAVE SETUP THE ENV VARIABLES");
}