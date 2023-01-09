import Category from "../model/Category.js";

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
      return await Category.find(filter).select(responseFilter)
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findById(categoryId, responseFilter) {
    try {
      return await Category.findOne({_id: categoryId}).select(responseFilter)
    } catch (e) {
      console.log(e)
      return null
    }
  }
}