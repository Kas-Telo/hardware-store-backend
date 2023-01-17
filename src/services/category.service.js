import Category from "../model/Category.js";
import {ApiError} from "../error/ApiError.js";

export const categoryService = {
  async createCategory(title) {
    try {
      const category = new Category({
        title
      })
      const categoryF = await category.save()
      return category
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findAll(filter, responseFilter) {
    try {
      const categories = await Category.find(filter).select({_id: 1})
      if(categories.length === 0) throw ApiError.notFound("Категорий с такими id не найдено")
      return categories
    } catch (e) {
      throw e
    }
  },
  async findById(next, categoryId, responseFilter) {
    try {
      const category = await Category.findOne({_id: categoryId}).select(responseFilter)
      if (!category) {
        throw new Error().stack = 404
      }
      return category
    } catch (e) {
      next(e)
    }
    return Promise.reject()
  }
}