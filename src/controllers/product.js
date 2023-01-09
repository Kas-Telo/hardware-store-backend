import {productService} from "../services/product.service.js";

export const getAll = async (req, res) => {
  const products = await productService.findAll(req.query)
  if (!products || products.length === 0) return res.status(400).json({message: 'products not found'})
  return res.status(200).json(products)
}
export const getOne = async (req, res) => {
  const product = await productService.findById(req.params.id)
  if (!product) return res.status(400).json({message: 'product not found'})
  return res.status(200).json(product)
}
export const create = async (req, res) => {
  const {categoryId, brand, model, price, rate, info} = req.body
  const product = await productService.create(categoryId, brand, model, price, rate, info)
  if (!product) return res.status(500).send({error: "Error, product not added. Contact support or try again later"})
  return res.status(200).send(product)
}
export const removeOne = async (req, res) => {
  const isProductDeleted = await productService.deleteById(req.params.id)
  if (!isProductDeleted) return res.status(500).json({message: 'Failed'})
  return res.status(200).json({message: 'Success'})
}

