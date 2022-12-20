import {infoService} from "./info.serviece.js";
import Product from "../model/Product.js";
import {categoryService} from "./category.service.js";

export const productsService = {
  async createNewProduct(category, manufacturer, model, price, rate, info) {
    try {
      const categoryObj = await categoryService.findAllCategories(category)
      console.log(categoryObj)

      const newProduct = new Product({
        categoryId: categoryObj._id,
        manufacturer,
        model,
        price,
        rate
      })
      const resp = await newProduct.save()
      const productId = resp._id
      const isInfoCreate = await infoService.createInfoForProduct(productId, info)
      if (!isInfoCreate) {
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
      const category = await categoryService.findAllCategories(filter.category)
      const categoryF = filter.category ? {category: category._doc._id} : {}
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
      const info = await infoService.findInfoByProductId(productId)
      if (!info) return null
      const product = await Product.findById(productId, {__v: 0})
      if (product === {}) return null
      return {
        ...product._doc,
        ...info._doc
      }
    } catch (e) {
      return null
    }
  },
  async deleteProductById(productId) {
    try {
      await Product.deleteOne({_id: productId})
      return await infoService.deleteInfoByProductId(productId);
    } catch (e) {
      console.log(e)
      return false
    }
  }
}