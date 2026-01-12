import mongoose from 'mongoose';

export const connection =()=>{
    mongoose.connect(process.env.MONGO_URI, {
     dbName: "Task_Management_Dashboard"
}).then(()=>{
    console.log("connected to database.")
}).catch(err=>{
    console.log(`Some error occured while connecting to database: ${err}`);
})
}

