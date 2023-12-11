import express from "express";
import { Author } from "../modules/authors.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const authorsRouter = express.Router();

authorsRouter.use(express.json()); //non riusciva a leggermi il body dell req, questo risolve
authorsRouter.use(checkAuth);

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await Author.find({});
    res.json(authors);
  } catch (error) {
    next(error);
  }
});

authorsRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.params);

    const user = await Author.findById(id);

    if (!user) {
      return res.status(404).send();
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author(req.body);
    await newAuthor.save();

    res.status(201).json(newAuthor);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

export default authorsRouter;

authorsRouter.put("/:id", async (req, res, next) => {
  try {
    const updateAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updateAuthor);
  } catch (error) {
    next(error);
  }
});

authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedDocument = await Author.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      res.status(404).send();
    } else {
      console.log("Autore eliminato con successo");
      res.status(204).send();
    }
  } catch {}
});
