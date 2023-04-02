import {searchParamsService} from "../services/search-params-by-category.service.js";
import {ApiError} from "../error/ApiError.js";
import {ObjectId} from "mongodb";


export const getSearchParamsByCategory = async (req, res, next) => {
  try {
    const {categoryId} = req.params
    if(!ObjectId.isValid(categoryId)){
      throw ApiError.badRequest("categoryId должен быть типа ObjectId")
    }
    const params = await searchParamsService.findSearchParamsByCategory(categoryId)
    return res.status(200).json(params)
  } catch (e) {
    next(e)
  }
}