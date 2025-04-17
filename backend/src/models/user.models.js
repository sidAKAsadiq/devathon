import mongoose from "mongoose";
import bcrypt from "bcrypt";

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

// 🔐 Hash password before saving
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// 🔐 Compare password
userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
