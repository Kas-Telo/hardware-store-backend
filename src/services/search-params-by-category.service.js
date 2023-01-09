import SearchParamsByCategory from "../model/SearchParamsByCategory.js";

export const searchParamsService = {
  async createSearchParam(categoryId) {
    try {
      const newDoc = new SearchParamsByCategory({categoryId, params: []})
      await newDoc.save()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  async updateSearchParams(categoryId, params) {
    try {
      await SearchParamsByCategory.findOneAndUpdate({categoryId}, {$addToSet: {params}})
      return true
    } catch (e) {
      console.log(e)
      return false
    }

  },
  async findSearchParamsByCategory(categoryId) {
    try {
      const paramsDoc = await SearchParamsByCategory.find({categoryId})
      return paramsDoc[0].params
    } catch (e) {
      console.log(e)
      return null
    }
  }
}