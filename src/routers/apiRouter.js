import express from "express";
import authorsRouter from "./authorsRouter.js";
import blogPostsRouter from "./blogPostsRouter.js";

const apiRouter = express.Router();

apiRouter.use("/authors", authorsRouter);
apiRouter.use("/blogPosts", blogPostsRouter);

apiRouter.get("/", (req, res) => {
  res.json({ message: "apiRouter is working👍" });
});

export default apiRouter;
