import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const connectDB = async () => {
  const mongoseDb = `mongodb+srv://hungdang02042003:${process.env.PASSWORD}@db-food.j1tbkng.mongodb.net/?retryWrites=true&w=majority`;

  try {
    // Connect the client to the server	(optional starting in v4.7)
    mongoose
      .connect(mongoseDb)
      .then(() => console.log('Database connected!'))
      .catch((err) => console.log(err));
  } catch (err) {
    return console.log(err);
  }
};

export default connectDB;
