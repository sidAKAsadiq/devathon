import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resumeText: String,
  careerGoal: String,
  skills: [String],
  missingSkills: [String],
  transferableSkills: [String],
  verifiedSkills: [
    {
      skill: String,
      issuedAt: Date,
      method: String,
      badgeId: String
    }
  ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
