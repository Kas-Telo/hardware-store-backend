import {categoryService} from "../services/category.service.js";
import {ApiError} from "../error/ApiError.js";

export const addCategory = async (req, res, next) => {
  try {
    const {title} = req.body
    const category = await categoryService.createCategory(title)
    return res.status(200).json({message: 'Успешно'})
  } catch (e) {
    next(e)
  }
}

export const getAllCategories = async (req, res, next) => {
  console.log('get categories')
  try {
    const categories = await categoryService.findAll({}, {})
    if (categories.length === 0) throw ApiError.notFound("Категории не найдены")
    return res.status(200).json(categories)
  } catch (e) {
    next(e)
  }
}