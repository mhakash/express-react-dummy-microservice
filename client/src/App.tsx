import { Fragment, PropsWithChildren, useEffect, useState } from "react";
import "./App.css";

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

const CreateComment = (props: PropsWithChildren<{ postId: string }>) => {
  const [content, setContent] = useState("");

  const createComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:4001/posts/${props.postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      }
    );

    const data = await res.json();
    setContent("");

    console.log(data);
  };

  return (
    <form className="flex flex-col items-center mt-4" onSubmit={createComment}>
      <input
        type="text"
        name="comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Comment"
        className="border border-gray-300 rounded p-2"
      />
      <button className="bg-blue-500 text-white rounded p-2 mt-2">
        Create Comment
      </button>
    </form>
  );
};

const ListComments = (props: PropsWithChildren<{ comments: Comment[] }>) => {
  return (
    <ul className="mt-4">
      {props.comments.length === 0 && <li>No comments</li>}
      {props.comments.map((comment: any) => (
        <li
          key={comment.id}
          className="border border-gray-300 rounded p-2 mt-2"
        >
          {comment.content}
        </li>
      ))}
    </ul>
  );
};

const Post = (props: PropsWithChildren<{ post: Post; id: string }>) => {
  const { post } = props;

  return (
    <li className="border border-gray-300 rounded p-2 mt-2">
      {post.title}
      <CreateComment postId={props.id} />
      <ListComments comments={post.comments} />
    </li>
  );
};

const ListPosts = () => {
  const [posts, setPosts] = useState<{ [key: string]: Post }>({});

  const getPosts = async () => {
    const res = await fetch("http://localhost:4002/posts");
    const data: { [key: string]: Post } = await res.json();

    setPosts(data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <h2 className="text-2xl text-center mt-4">Posts</h2>
      <button
        onClick={getPosts}
        className="bg-blue-500 text-white rounded p-2 mt-2"
      >
        Get Posts
      </button>
      <ul className="mt-4">
        {Object.values(posts).map((post: any) => (
          <Fragment key={post.id}>
            <Post post={post} id={post.id} />
          </Fragment>
        ))}
      </ul>
    </>
  );
};

function App() {
  const [title, setTitle] = useState("");

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();
    setTitle("");

    console.log(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <h1 className="text-4xl mt-4">Blog App</h1>
      <h2 className="text-2xl mt-4">Create posts</h2>
      <form className="flex flex-col mt-4" onSubmit={createPost}>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border border-gray-300 rounded p-2"
        />
        <button className="bg-blue-500 text-white rounded p-2 mt-2">
          Create Post
        </button>
      </form>

      <ListPosts />
    </div>
  );
}

export default App;
