import {productsService} from "../services/products.service.js";
import {categoryService} from "../services/category.service.js";
import {searchParamsService} from "../services/search-params-by-category.service.js";

export const getProducts = async (req, res) => {
  console.log('get product')
  const products = await productsService.findAllProducts(req.query)
  if (!products || products.length === 0) return res.status(400).json({message: 'products not found'})
  return res.status(200).json(products)
}
export const getProductById = async (req, res) => {
  console.log('get product by id')
  const product = await productsService.findProductById(req.params.id)
  if (!product) return res.status(400).json({message: 'product not found'})
  return res.status(200).json(product)
}
export const addProduct = async (req, res) => {
  // if (!req.body.category
  //   || !req.body.label
  //   || !req.body.model
  //   || !req.body.price
  //   || req.body.rate === undefined || req.body.rate === null
  // ) {
  //   res.status(400).json({error: 'error'})
  //   return
  // }
  const {category, manufacturer, model, price, rate, info} = req.body
  const isProductCreated = await productsService.createNewProduct(category, manufacturer, model, price, rate, info)
  if (!isProductCreated) return res.status(500).send({error: "Error, product not added. Contact support or try again later"})
  return res.status(200).send({message: 'Product added'})
}
export const deleteProduct = async (req, res) => {
  const isProductDeleted = await productsService.deleteProductById(req.params.id)
  if (!isProductDeleted) return res.status(500).json({message: 'Failed'})
  return res.status(200).json({message: 'Success'})
}
export const addCategory = async (req, res) => {
  console.log('add category')
  const {title} = req.body
  const category = await categoryService.createCategory(title)
  console.log(category)
  if (!category) return res.status(500).json({message: 'Failed'})
  const isSearchParamsCreated = await searchParamsService.createSearchParam(title)
  console.log(isSearchParamsCreated)
  if (!isSearchParamsCreated) return res.status(500).json({message: 'Failed'})
  return res.status(200).json({message: 'success'})
}
export const getAllCategories = async (req, res) => {
  console.log('get categories')
  const categories = await categoryService.findAllCategories()
  if (!categories) return res.status(500).json({message: 'Failed'})
  return res.status(200).json(categories)
}
export const addSearchParam = async (req, res) => {
  const isSearchParamCreated = await searchParamsService.updateSearchParams(req.body.categoryTitle, req.body.params)
  if (!isSearchParamCreated) return res.status(500).json({message: 'Failed'})
  return res.status(200).json({message: 'success'})
}
export const getSearchParamsByCategory = async (req, res) => {
  const params = await searchParamsService.findSearchParamsByCategory(req.query.categoryTitle)
  console.log(params)
  if (!params) return res.status(500).json({message: 'Failed'})
  return res.status(200).json(params)
}
