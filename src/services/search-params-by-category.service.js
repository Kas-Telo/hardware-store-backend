import SearchParamsByCategory from "../model/SearchParamsByCategory.js";

export const searchParamsService = {
  async createSearchParam(categoryTitle) {
    try {
      const newDoc = new SearchParamsByCategory({categoryTitle, params: []})
      await newDoc.save()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  async updateSearchParams(categoryTitle, params) {
    try {
      await SearchParamsByCategory.findOneAndUpdate({categoryTitle}, {$addToSet: {params}})
      return true
    } catch (e) {
      console.log(e)
      return false
    }

  },
  async findSearchParamsByCategory(categoryTitle) {
    try {
      const paramsDoc = await SearchParamsByCategory.find({categoryTitle})
      console.log(paramsDoc)
      return paramsDoc[0].params
    } catch (e) {
      console.log(e)
      return null
    }
  }
}