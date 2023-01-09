import {categoryService} from "../services/category.service.js";
import {searchParamsService} from "../services/search-params-by-category.service.js";

export const addCategory = async (req, res) => {
  const {title} = req.body
  const category = await categoryService.createCategory(title)
  if (!category) return res.status(500).json({message: 'Failed'})
  const isSearchParamsCreated = await searchParamsService.createSearchParam(category._id)
  if (!isSearchParamsCreated) return res.status(500).json({message: 'Failed'})
  return res.status(200).json({message: 'success'})
}

export const getAllCategories = async (req, res) => {
  console.log('get categories')
  const categories = await categoryService.findAll()
  if (!categories) return res.status(500).json({message: 'Failed'})
  return res.status(200).json(categories)
}