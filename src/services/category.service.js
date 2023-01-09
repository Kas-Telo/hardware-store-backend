import Category from "../model/Category.js";

export const categoryService = {
  async createCategory(title) {
    try {
      const category = new Category({
        title
      })
      await category.save()
      return category
    } catch (e) {
      return null
    }
  },
  async findAllCategoriesId(filter) {
    try {
      const categoryId = await Category.find(filter).select({_id: 1})
      return categoryId
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findAllCategories() {
    try {
      const categories = await Category.find().select({__v: 0})
      return categories
    } catch (e) {
      return null
    }
  }
}