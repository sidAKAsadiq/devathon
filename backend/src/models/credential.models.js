import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  skill: String,
  assessmentType: String,
  status: String,
  dateEarned: Date,
}, { timestamps: true });

const Credential = mongoose.model("Credential", credentialSchema);
export default Credential;
