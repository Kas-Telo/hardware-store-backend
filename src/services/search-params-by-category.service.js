import SearchParamsByCategory from "../model/SearchParamsByCategory.js";
import {ApiError} from "../error/ApiError.js";

export const searchParamsService = {
  async createSearchParam(categoryId) {
    try {
      const newDoc = new SearchParamsByCategory({categoryId, params: []})
      await newDoc.save()
      return true
    } catch (e) {
      throw e
    }
  },
  async updateSearchParams(categoryId, params) {
    try {
      await SearchParamsByCategory.findOneAndUpdate({categoryId}, {$addToSet: {params}})
      return true
    } catch (e) {
      throw e
    }
  },
  async findSearchParamsByCategory(categoryId) {
    try {
      const paramsDoc = await SearchParamsByCategory.find({categoryId})
      if (paramsDoc.length === 0) throw ApiError.notFound("Параметры поиска по данной категории не найдены")
      return paramsDoc[0].params
    } catch (e) {
      throw e
    }
  }
}