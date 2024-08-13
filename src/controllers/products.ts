import { RequestHandler } from "express";
import ProductModel from "../models/product";
import createHttpError from "http-errors";
import mongoose from "mongoose";

class ProductController {

    getProducts: RequestHandler = async (req, res, next) => {
        try {
            const { name, quantity, createdAt } = req.query as { name?: string, quantity?: string, createdAt?: string };
            const query: any = {};

            if (name) {
                query.name = { $regex: new RegExp(name, "i") };
            }

            if (quantity) {
                const parsedQuantity = parseInt(quantity, 10);
                if (isNaN(parsedQuantity)) {
                    throw createHttpError(400, "Invalid quantity format");
                }
                query.quantity = parsedQuantity;  
            }

            if (createdAt) {
                const date = new Date(createdAt);
                if (isNaN(date.getTime())) {
                    throw createHttpError(400, "Invalid date format");
                }
                const startOfDay = new Date(date.setHours(0, 0, 0, 0));
                const endOfDay = new Date(date.setHours(23, 59, 59, 999));
                
                query.createdAt = { $gte: startOfDay, $lte: endOfDay };
            }

            const products = await ProductModel.find(query).exec();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    getProduct: RequestHandler = async (req, res, next) => {
        const productId = req.params.productId;
        try {
            if (!mongoose.isValidObjectId(productId)) {
                throw createHttpError(400, "Invalid product id");
            }

            const product = await ProductModel.findById(productId).exec();
            if (!product) {
                throw createHttpError(404, "Product not found");
            }

            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }
    createProduct: RequestHandler = async (req, res, next) => {
        const { name, category, price, quantity} = req.body || {};
        const files = req.files as Express.Multer.File[] || [];
        console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);

        try {
            if (!name) {
                throw createHttpError(400, "Product must have a name");
            }
            const images = files.map(file => ({ image: file.filename }));

            const newProduct = await ProductModel.create({
                name,
                category,
                price,
                quantity,
                images,
            });

            res.status(201).json(newProduct);
        } catch (error) {
            next(error);
        }
    }

    

    updateProduct: RequestHandler = async (req, res, next) => {
        const productId = req.params.productId;
        const { name, category, price, quantity } = req.body;
        const files = req.files as Express.Multer.File[];

        try {
            if (!mongoose.isValidObjectId(productId)) {
                throw createHttpError(400, "Invalid product id");
            }

            const product = await ProductModel.findById(productId).exec();
            if (!product) {
                throw createHttpError(404, "Product not found");
            }

            if (name) product.name = name;
            if (category) product.category = category;
            if (price) product.price = price;
            if (quantity) product.quantity = quantity;

            if (files && files.length > 0) {
                const images = files.map(file => ({ image: file.filename }));
                product.images = images as any;
            }

            const updatedProduct = await product.save();

            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }


    deleteProduct: RequestHandler = async (req, res, next) => {
        const productId = req.params.productId;

        try {
            if (!mongoose.isValidObjectId(productId)) {
                throw createHttpError(400, "Invalid product id");
            }

            const product = await ProductModel.findById(productId).exec();
            if (!product) {
                throw createHttpError(404, "Product not found");
            }

            await product.deleteOne();
            res.status(200).json({ message: "Product successfully deleted" });
        } catch (error) {
            next(error);
        }
    }

       
}

export default new ProductController();





















   




   

