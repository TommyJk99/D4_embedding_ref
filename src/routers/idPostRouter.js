import express from "express";
import { Author } from "../modules/authors.js";

const idPostRouter = new express.Router();

//http://localhost:3030/api/blogPosts/:id/
idPostRouter
  .get("/", async (req, res, next) => {
    try {
      const { id } = req.params;
      const comments = await Author.findById(id).select("comments -_id");
      res.json(comments);
    } catch (err) {
      next(err);
    }
  })
  .get("/:commentId", (req, res, next) => {})
  .put("/:commentId", (req, res, next) => {})
  .delete("/:commentId", (req, res, next) => {});

export default idPostRouter;
