import express from 'express'
import {
  addCategory,
  getAllCategories
} from "../controllers/products.js";

export const categoryRouter = express.Router()

categoryRouter.get('/', getAllCategories)
categoryRouter.post('/', addCategory)

