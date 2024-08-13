import app from "./app"
import env from "./util/validateEnv";
import mongoose from "mongoose";  
import {cronJob} from "./queue/nodemail";



class server {
  constructor() {
    this.connectToMongo()
    this.setupCronJob()
    
}
setupCronJob(){
  cronJob();
}

connectToMongo(){
  const port = env.PORT;
  mongoose.connect(env.MONGO_CONNECTION_STRING!)
  .then(()=>{
      console.log("Mongoose connected");
      app.listen(port, () => {
          console.log("Server running on port: " + port);
      });
  })
   .catch((err) => console.error(err));
}
}

new server();



 



