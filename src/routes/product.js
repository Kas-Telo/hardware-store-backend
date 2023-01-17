import express from 'express'
import {create, removeOne, getOne, getAll} from "../controllers/product.js";

export const productsRouter = express.Router()

productsRouter.get('/', getAll)
productsRouter.get('/:id', getOne)
productsRouter.post('/', create)
productsRouter.delete('/:id', removeOne)


