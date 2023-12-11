import express from "express";
import { BlogPost } from "../modules/blogPosts.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const blogPostsRouter = express.Router();

blogPostsRouter.use(express.json());

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPost.find({});
    res.json(blogPosts);
  } catch (err) {
    err.statusCode = 404;
    next(err);
  }
});

blogPostsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: "L'utente non è stato trovato" });
    } else {
      res.json(post);
    }
  } catch (err) {
    next(err);
  }
});

blogPostsRouter.use(checkAuth);

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new BlogPost(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
});

blogPostsRouter.put("/:id", async (req, res, next) => {
  try {
    const updatePost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatePost);
  } catch (err) {
    next(err);
  }
});

blogPostsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deleteDocument = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deleteDocument) {
      res.status(404).send();
    } else {
      res.status(204).send(); //quandio eliminiamo non serve che il server risponda con del json
    }
  } catch (err) {
    next(err);
  }
});

export default blogPostsRouter;
