const express = require("express");
const router = express.Router();
const { storeAnswer, getAnswers,getQuestions } = require("../Controller/controller");

// Define routes
router.post("/answer", storeAnswer); // POST route to store/update answers
router.get("/", getAnswers);   
router.get("/questions", getQuestions);

module.exports = router;
