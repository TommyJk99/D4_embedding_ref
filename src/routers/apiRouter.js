import express from "express";
import authorsRouter from "./authorsRouter.js";
import blogPostsRouter from "./blogPostsRouter.js";
import multer from "multer";

// STORAGE MANUALE, SALVA I FILE IN UNA CARTELLA NEL NOSTRO PROGETTO
// const storage = multer.diskStorage({
//   destination: "./uploads",
//   filename: function (req, file, callback) {
//     if (["image/jpeg", "image/png"].includes(file.mimetype)) {
//       callback(null, `${Date.now()}_${file.originalname}`);
//     } else {
//       const error = new Error("Please upload png or jpg");
//       error.statusCode = 500;
//       callback(error);
//     }
//   },
// });

const upload = multer({ storage });
const apiRouter = express.Router();

apiRouter.use("/authors", authorsRouter);
apiRouter.use("/blogPosts", blogPostsRouter);

apiRouter.get("/", (req, res) => {
  res.json({ message: "apiRouter is working👍" });
});

apiRouter.patch("/multipart", upload.single("avatar"), (req, res, next) => {
  console.log(req.file.path);
  res.send();
});

//servirebbe a recuperare i file nel server tramite il loro percorso ma noi useremo cloudinary
// apiRouter.get("/download/:filename"),
//   (req, res, next) => {
//     res.send(path.resolve("./src/uploads/" + req.params.filename));
//   };

// export default apiRouter;
