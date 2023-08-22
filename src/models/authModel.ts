import mongoose, { Document, Model } from "mongoose";
import { UserInterface } from "../interface/userInterface";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "PLease tell us Your Name "],
  },
  email: {
    type: String,
    required: true,
    minlength: [5, "This email is too short"],
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: [true, "Please Provide a password"],
    minlength: [8, "Password is too short"],
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) throw new Error("Password is missing.");
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User: Model<UserInterface> = mongoose.model<UserInterface>(
  "User",
  userSchema
);
export default User;

// export default mongoose.model<UserInterface>("User", userSchema);
