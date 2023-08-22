import { Document } from "mongoose";

export interface TodoListInterface extends Document {
  title: string;
  completed: boolean;
}
