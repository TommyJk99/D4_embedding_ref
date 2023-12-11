import express from "express";
import { BlogPost } from "../modules/blogPosts.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const blogPostsRouter = express.Router();

blogPostsRouter.use(express.json());

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await BlogPost.find({})
      .populate("author", "-_id -__v")
      .select("-__v");
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
    const updatePost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
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

//commenti

blogPostsRouter
  .get("/:id/comments", async (req, res, next) => {
    try {
      const { id } = req.params;
      const comments = await BlogPost.findById(id).select("comments -_id");

      if (!comments) return res.status(404).send();

      res.json(comments);
    } catch (err) {
      next(err);
    }
  })
  .get("/:id/comments/:commentId", async (req, res, next) => {
    try {
      const { id, commentId } = req.params;
      const post = await BlogPost.findOne(
        { _id: id, "comments._id": commentId },
        { "comments.$": 1, _id: 0 }
      );

      if (!post || !post.comments.length) {
        return res.status(404).send("Commento non trovato");
      }

      const comment = post.comments[0];
      res.json(comment);
    } catch (err) {
      next(err);
    }
  });

export default blogPostsRouter;
