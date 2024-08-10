import cors from "cors";
import express from "express";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

const events: any = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  try {
    axios.post("http://localhost:4000/events", event);
    axios.post("http://localhost:4001/events", event);
    axios.post("http://localhost:4002/events", event);
    axios.post("http://localhost:4003/events", event);
  } catch (err) {
    console.log(err);
  }

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Server is running on port 4005");
});
