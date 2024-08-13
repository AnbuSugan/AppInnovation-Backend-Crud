import { InferSchemaType, model, Schema } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true},
    category: { type: String },
    price: {type: Number},
    quantity: {type: Number},
    images: [
        {
            image: { type: String, required: true },
        },
    ],
    
},{ timestamps: true});

type Product = InferSchemaType<typeof productSchema>;

export default model<Product>("Product",productSchema);