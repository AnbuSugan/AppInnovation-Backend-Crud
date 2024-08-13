import "dotenv/config";
import express, {  Request, Response} from "express";
import productsRoutes from "./routes/products";
import userRoutes from "./routes/users";
import morgan from 'morgan';
import createHttpError, {isHttpError} from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import path from "path";


 
const app = express();

class server {
    constructor(){
    
        this.addRoutes();
        this.useMiddleware();
    }
   
    useMiddleware(){
        app.use(express.json());
        app.use(morgan('dev'));
        app.use(session({
            secret: env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 60 * 60 * 1000,
            },
            rolling: true,
            store: MongoStore.create({
                mongoUrl: env.MONGO_CONNECTION_STRING
            }),
        }))

        app.use(express.urlencoded({ extended: true })); 
        app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
        app.use((req,res,next)=>{
            next(createHttpError("Endpoint not Found"));   
         });
         
         app.use((error: unknown, req:Request, res: Response ) =>{
             console.error(error);
             let errorMessage = "An unknown error occured";
             let statusCode = 500;
             if(isHttpError(error)){
                 statusCode = error.status;
                 errorMessage = error.message;
             }
             
             res.status(statusCode).json({ error: errorMessage });
         })
    }
    addRoutes(){
        app.use("/api/users", userRoutes);
        app.use("/api/products", productsRoutes);
    }
}
    
new server()

export default app;