import {specificationService} from "./specification.serviece.js";
import Product from "../model/Product.js";

export const productsService = {
  async createNewProduct(category, manufacturer, model, price, rate, spec) {
    try {
      const newProduct = new Product({
        category,
        manufacturer,
        model,
        price,
        rate
      })
      const resp = await newProduct.save()
      const productId = resp._id
      const isSpecCreate = await specificationService.createSpecForProduct(productId, spec)
      if (!isSpecCreate) {
        await Product.deleteOne({_id: productId})
        return false
      }
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  async findAllProducts(filter) {
    console.log(filter)
    try {
      const categoryF = filter.category ? {category: filter.category} : {}
      const products = await Product.find({
        ...categoryF,
        $or: [
          {manufacturer: {$regex: filter.title ?? '', $options: 'i'}},
          {model: {$regex: filter.title ?? '', $options: 'i'}}
        ]
      })
      if (!products) {
        return null
      }
      return products
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findProductById(productId) {
    try {
      const spec = await specificationService.findSpecByProductId(productId)
      if (!spec) return null
      const product = await Product.findById(productId, {__v: 0})
      if (product === {}) return null
      return {
        ...product._doc,
        specification: {
          ...spec._doc
        }
      }
    } catch (e) {
      return null
    }
  },
  async deleteProductById(productId) {
    try {
      await Product.deleteOne({_id: productId})
      return await specificationService.deleteSpecByProductId(productId);
    } catch (e) {
      console.log(e)
      return false
    }
  }

}