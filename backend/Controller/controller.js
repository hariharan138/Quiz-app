const { AnswerData, SecondCollection } = require("../Models/models");

// Store or update answers based on IP
const storeAnswer = async (req, res) => {
  try {
    const { Answers } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Find the existing entry and update it, or create a new one if it doesn't exist
    const updatedEntry = await AnswerData.findOneAndUpdate(
      { ipAddress }, // Filter by IP
      { 
        $set: { 
          Answers,
          lastUpdated: new Date()
        }
      },
      { new: true, upsert: true } // Return the updated document, create if it doesn't exist
    );

    res.status(200).json({
      error: false,
      message: "Answers stored successfully.",
      data: updatedEntry,
    });
  } catch (err) {
    console.error("Error storing answers:", err);
    res.status(500).json({ error: true, message: err.message });
  }
};

// Get all answers
const getAnswers = async (req, res) => {
  try {
    console.log("Fetching answers...");
    const answers = await AnswerData.find({});
    console.log("Answers fetched:", answers);
    res.status(200).json({
      error: false,
      message: "Fetched all answers successfully.",
      data: answers,
    });
  } catch (err) {
    console.error("Error fetching answers:", err);
    res.status(500).json({ error: true, message: err.message });
  }
};

// Get all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await SecondCollection.find({}); // Fetch all questions from the second collection
    res.status(200).json({
      error: false,
      message: "Fetched all questions successfully.",
      data: questions,
    });
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: true, message: err.message });
  }
};

module.exports = { storeAnswer, getAnswers, getQuestions };

