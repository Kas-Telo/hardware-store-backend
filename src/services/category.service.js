import Category from "../model/Category.js";

export const categoryService = {
  async createCategory(title){
    try{
      const category = new Category({
        title
      })
      await category.save()
      return category
    }catch (e){
      return null
    }
  },
  async findAllCategories(){
    try{
      const category = await Category.find()
      console.log('find category')
      return category
    }catch (e){
      console.log(e)
      return undefined
    }
  },
}