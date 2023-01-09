import express from 'express'
import {addCategory, getAllCategories} from "../controllers/category.js";

export const categoryRouter = express.Router()

categoryRouter.get('/', getAllCategories)
categoryRouter.post('/', addCategory)

