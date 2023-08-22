"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const todoSchema = new mongoose_1.default.Schema({
    title: { type: String },
    completed: { type: Boolean, default: false },
    userId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: "User",
        required: [true, "Only a registered User Can Create A todo"],
    },
});
todoSchema.pre("find", function populateUser(next) {
    this.populate("userId");
    next();
});
exports.default = mongoose_1.default.model("Todo", todoSchema);
