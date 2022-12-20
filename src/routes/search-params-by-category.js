import express from 'express'
import {addSearchParam, getSearchParamsByCategory} from "../controllers/products.js";

export const searchParamsRouter = express.Router()

searchParamsRouter.get('/', getSearchParamsByCategory)
searchParamsRouter.put('/', addSearchParam)

