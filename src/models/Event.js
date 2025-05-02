import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    image: { type: String, default: "" }, // Event image URL
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin user who created it
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
