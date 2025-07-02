import express from "express";

const router = express.Router();
router.get("/", (_req, res) => {
  return res.status(200).json({ message: "Hello To do List Project!." });
});

module.exports = router;