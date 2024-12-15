const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, unique: true },
  Answers: [{ type: String, required: true }], // Array of answers
},{
    versionKey:false,
    timestamps:true
});
const secondSchema = new mongoose.Schema({
    question: String,
    options: [String], 
  }, {
    versionKey: false,
    timestamps: true,
  });
  
module.exports ={
    AnswerData: mongoose.model("AnswerData", answerSchema),
    SecondCollection: mongoose.model("SecondCollection", secondSchema)
} 

