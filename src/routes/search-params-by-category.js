import express from 'express'
import {getSearchParamsByCategory} from "../controllers/search-params-by-category.js";

export const searchParamsRouter = express.Router()

searchParamsRouter.get('/:id', getSearchParamsByCategory)

