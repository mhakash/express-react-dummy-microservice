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

const posts: { [key: string]: Post } = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  res.send({});
});

app.listen(4002, () => {
  console.log("Server is running on port 4002");
});
