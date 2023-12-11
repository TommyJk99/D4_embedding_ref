export const genericError = (err, req, res, next) => {
  console.log("\n😒", err.name, "\n", "👉", err);
  if (err.name === "CastError") {
    res.status(404).json({ message: "Il codice identificativo deve avere almeno 24 caratteri" });
  } else if (err.name === "ValidationError") {
    res.status(400).json({ message: "I dati inseriti sono incompleti 😒" });
  } else {
    res.status(err.statusCode || 500).send(err.message);
  }
};
