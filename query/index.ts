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

const posts: { [key: string]: Post } = {};

const handleEvent = (type: string, data: any) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((e) => e.id === id);
    if (comment) {
      comment.status = status;
      comment.content = content;
    }
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Server is running on port 4002");
  const res: any = await axios.get("http://localhost:4005/events");

  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvent(event.type, event.data);
  }
});
