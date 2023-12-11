import mongoose, { Schema } from "mongoose";

const blogPostsSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
    required: true,
  },
  readTime: {
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },

  /*vogliamo un riferimento agli autori! Così da rendere robusti i nostri dati (gli devono essere gli stessi!)
  author: {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },*/

  author: {
    type: Schema.Types.ObjectId, //è un tipo ObjecId
    ref: "authors", //Questo è il riferimento alla collezione degli autori
  },

  content: {
    type: String,
    required: true,
  },
});

export const BlogPost = mongoose.model("blogPosts", blogPostsSchema, "blogPosts");
