import mongoose, { type Document, Schema } from "mongoose"

export interface IBill extends Document {
  title: string
  amount: number
  date: string
  s3Key: string
  s3Url: string
  createdAt: Date
}

const BillSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the bill"],
    maxlength: [100, "Title cannot be more than 100 characters"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount"],
    min: [0, "Amount must be positive"],
  },
  date: {
    type: String,
    required: [true, "Please provide a date"],
  },
  s3Key: {
    type: String,
    required: [true, "S3 key is required"],
  },
  s3Url: {
    type: String,
    required: [true, "S3 URL is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema)
