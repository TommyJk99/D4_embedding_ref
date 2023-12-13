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

//COMMENTI

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
      console.log(req.params);
      const comment = await BlogPost.findOne(
        { _id: id }, //trova il blog con queste caratteristiche
        { comments: { $elemMatch: { _id: commentId } } } //restituisce i commenti con questa caratteristica
      );

      if (!comment || !comment.comments.length) {
        return res.status(404).send("Commento non trovato");
      }

      res.json(comment.comments[0]);
    } catch (err) {
      next(err);
    }
  })
  .post("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const newComment = req.body;

      const updatedPost = await BlogPost.findOneAndUpdate(
        { _id: id },
        { $push: { comments: newComment } },
        { new: true, runValidators: true } // restituisce il documento aggiornato e esegue i validatori dello schema
      );

      if (!updatedPost) {
        return res.status(404).send("Post non trovato");
      }

      res.status(201).send("Commento aggiunto con successo");
    } catch (err) {
      next(err);
    }
  })
  .put("/:id/comments/:commentId", async (req, res, next) => {
    try {
      const { id, commentId } = req.params; // Estraggo id e commentId dall'URL
      const { name, text } = req.body; // Estraggo name e text dal body

      const updatedComment = await BlogPost.findOneAndUpdate(
        { _id: id, "comments._id": commentId },
        {
          $set: {
            "comments.$.name": name, // Aggiorno il nome del commento
            "comments.$.text": text, // Aggiorno il testo del commento
          },
        },
        { new: true } // Restituisce il documento aggiornato
      );

      res.status(200).json(updatedComment);
    } catch (err) {
      next(err);
    }
  })
  .delete("/:id/comments/:commentId", async (req, res, next) => {
    try {
      const { id, commentId } = req.params;

      // Trova il post e rimuove il commento specifico
      const updatedPost = await BlogPost.findOneAndUpdate(
        { _id: id }, //trovo il post che ha questo id
        { $pull: { comments: { _id: commentId } } }, // Rimuovo il commento che ha come id commentId
        { new: true } // Restituisco il documento aggiornato
      );

      if (!updatedPost) {
        return res
          .status(404)
          .send("Post non trovato o commento non esistente");
      }

      res.status(200).send("Commento eliminato con successo");
    } catch (err) {
      next(err);
    }
  });

export default blogPostsRouter;
