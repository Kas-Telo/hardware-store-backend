import {categoryService} from "../services/category.service.js";
import {ApiError} from "../error/ApiError.js";

export const addCategory = async (req, res, next) => {
  try {
    const {title} = req.body
    if (!title) {
      throw ApiError.badRequest("title обязателен")
    }
    if (typeof title !== 'string') {
      throw ApiError.badRequest("title должен быть типа string")
    }
    if (title.length < 3 || title.length > 40){
      throw ApiError.badRequest("title должен быть длинной от 3 до 40 символов")
    }
    await categoryService.createCategory(title);
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