import Category from "../model/Category.js";
import {ApiError} from "../error/ApiError.js";
import {searchParamsService} from "./search-params-by-category.service.js";
import Product from "../model/Product.js";

export const categoryService = {
  async createCategory(title) {
    try {
      const category = new Category({
        title
      })
      const categoryF = await category.save()
      const isSearchParamsCreated = await searchParamsService.createSearchParam(category._id)
      if (!isSearchParamsCreated) {
        await Category.deleteOne({_id: categoryF._id})
        throw ApiError.internal("Ошибка при создании параметров поиска")
      }
      return category
    } catch (e) {
      throw e
    }
  },
  async findAll(filter, responseFilter) {
    try {
      const categories = await Category.find(filter).select(responseFilter)
      return categories
    } catch (e) {
      throw e
    }
  },
  async findById(categoryId, responseFilter) {
    try {
      const category = await Category.findOne({_id: categoryId}).select(responseFilter)
      return category
    } catch (e) {
      throw e
    }
  }
}