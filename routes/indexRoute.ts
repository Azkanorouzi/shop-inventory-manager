import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
    res.render("index", {test: "Hi this is a test from ejs"})
})