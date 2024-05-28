import express from "express";
import notes from "./routes/notes.js";

const app = express();

app.use(express.static("dist"));
app.use("/api/notes", notes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
