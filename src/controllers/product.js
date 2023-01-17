import {productService} from "../services/product.service.js";

export const getAll = async (req, res, next) => {
  try {
    const products = await productService.findAll(req.query)
    return res.status(200).json(products)
  } catch (e) {
    next(e)
  }
}
export const getOne = async (req, res, next) => {
  try{
    const product = await productService.findById(req.params.id)
    return res.status(200).json(product)
  }catch (e) {
    next(e)
  }
}
export const create = async (req, res, next) => {
  const {categoryId, brand, model, price, rate, info} = req.body
  try {
    const product = await productService.create(next, categoryId, brand, model, price, rate, info)
    return res.status(200).send(product)
  } catch {

  }
}
export const removeOne = async (req, res) => {
  const isProductDeleted = await productService.deleteById(req.params.id)
  return res.status(200).json({message: 'Success'})
}

