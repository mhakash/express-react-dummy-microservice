import axios from "axios";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

type Comment = {
  id: string;
  content: string;
  status: "approved" | "pending" | "rejected";
};

type Post = {
  id: string;
  title: string;
  comments: Comment[];
};

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const { id, content, status, postId } = data;
    const newStaus = content.includes("orange") ? "rejected" : "approved";
    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id,
        content,
        postId,
        status: newStaus,
      },
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log("Server is running on port 4003");
});
