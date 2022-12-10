import express from 'express'
import {addProduct, deleteProduct, getProductById, getProducts} from "../controllers/products.js";

export const productsRouter = express.Router()

productsRouter.get('/', getProducts)
productsRouter.get('/:id', getProductById)
productsRouter.post('/', addProduct)
productsRouter.delete('/:id', deleteProduct)

