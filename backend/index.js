import connectToMongo from "./database/db.js";
import express from "express";
import notes from "./routes/notes.js";
import auth from "./routes/auth.js";
import cors from "cors";

connectToMongo();
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/notes", notes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
