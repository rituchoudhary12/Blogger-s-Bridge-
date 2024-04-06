import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const mongoConnect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then(() =>
        console.log(
          `Connected To mongodb atlas`
        )
      );
  } catch (error) {
    console.log(error)
  }
}