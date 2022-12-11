import {productsService} from "../services/products.service.js";

export const getProducts = async (req, res) => {
  const products = await productsService.findAllProducts(req.query)
  if ( !products || products.length === 0) return res.status(400).json({message: 'products not found'})
  return res.status(200).json(products)
}
export const getProductById = async (req, res) => {
  const product = await productsService.findProductById(req.params.id)
  if(!product) return res.status(400).json({message: 'product not found'})
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
  const {category, manufacturer, model, price, rate, specification} = req.body
  const isProductCreated = await productsService.createNewProduct(category, manufacturer, model, price, rate, specification)
  if (!isProductCreated) return res.status(500).send({error: "Error, product not added. Contact support or try again later"})
  return res.status(200).send({message: 'Product added'})
}
export const deleteProduct = async (req, res) => {
  console.log(req.params)
  const isProductDeleted = await productsService.deleteProductById(req.params.id)
  if(!isProductDeleted) return res.status(500).json({message: 'Failed'})
  return res.status(200).json({message: 'Success'})
}