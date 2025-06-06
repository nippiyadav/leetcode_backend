import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"],
    default: "EASY",
  },
  tags: {
    type: [String], // Correct: it's an array of strings
    default: [],
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  example: {
    type: mongoose.Schema.Types.Mixed,
  },
  company: {
    type: [String],
    default: [],
  },
  demo: {
    type: Boolean,
    default: false,
  },
  templateCode: {
    type: mongoose.Schema.Types.Mixed,
  },
  constraints: {
    type: [String],
    default: [],
  },
  hints: {
    type: [String],
    default: [],
  },
  editorial: {
    type: String,
  },
  codeSnippets: {
    type: mongoose.Schema.Types.Mixed,
  },
  testCases: {
    type: mongoose.Schema.Types.Mixed,
  },
  referenceSolution: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

export const Problem = mongoose.model("Problem", ProblemSchema);
