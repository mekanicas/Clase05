import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        mongoose.connect(
          "mongodb+srv://admin:123@cluster0.e4lbb.mongodb.net/coderBank"
        ); 
          console.log("Mongo DB connected")
       


    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error connecting to mongo db`,
                detalle:`${error.message}`
            }
        )
        
    }
}