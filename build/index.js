"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("./server"));
const PORT = 3400;
mongoose_1.default
    .connect("mongodb+srv://adeoul001:RMfBrCYYtvUyXiNR@nodejsintern.d53fa5k.mongodb.net")
    .then(() => {
    console.log("Connected to database ");
})
    .catch((err) => {
    console.log(err);
});
server_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = server_1.default;
// RMfBrCYYtvUyXiNR
