import Bluebird from 'bluebird';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    mongoose.Promise = Bluebird;
    mongoose.set('strictQuery', true);
    await mongoose
        .connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('Connected to database'))
        .catch((err) => console.log(err));
};
export default connectDB;
