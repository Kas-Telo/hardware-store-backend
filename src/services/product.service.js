import {infoService} from "./info.serviece.js";
import Product from "../model/Product.js";
import {categoryService} from "./category.service.js";
import {searchParamsService} from "./search-params-by-category.service.js";
import {Info} from "../model/Info.js";

export const productService = {
  async create(categoryId, brand, model, price, rate, info) {
    try {
      const category = await categoryService.findById(categoryId, {})
      if (!category) return null

      const newProduct = new Product({
        categoryId: categoryId,
        brand,
        model,
        price,
        rate
      })
      const productDoc = await newProduct.save()

      const productId = productDoc._id
      const infoDoc = await infoService.createInfoForProduct(productId, info)
      if (!infoDoc) {
        await Product.deleteOne({_id: productId})
        return null
      }

      const isSearchParamsUpdated = await searchParamsService.updateSearchParams(categoryId, info)
      if (!isSearchParamsUpdated) {
        await Info.deleteOne({_id: infoDoc._id})
        await Product.deleteOne({_id: productId})
        return null
      }

      const productF = {
        ...productDoc._doc,
        info: infoDoc.info
      }
      return productF
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findAll(filter) {
    try {
      const categoriesFilter = filter.categoryId ? {_id: filter.categoryId} : {}
      const categoryIdArray = await categoryService.findAll(categoriesFilter, {_id: 1})
      const categoryIdFilter = categoryIdArray.length > 0 ? {categoryId: categoryIdArray} : {}

      let productIdByInfoFilter = {}
      if (typeof filter.categoryId === 'string' && filter.info) {
        const productIdArray = await infoService.findAllProductId(filter.info)
        if (productIdArray.length > 0) {
          productIdByInfoFilter = {_id: productIdArray}
        } else {
          return null
        }
      }

      const products = await Product.find({
        ...categoryIdFilter,
        ...productIdByInfoFilter,
        $or: [
          {brand: {$regex: filter.title ?? '', $options: 'i'}},
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
  async findById(productId) {
    try {
      const info = await infoService.findById(productId, {_id: 0, productId: 0})
      if (!info) return null
      const product = await Product.findById(productId)
      if (product === {}) return null
      console.log(...info._doc)
      return {
        ...product._doc,
        info: {...info._doc}
      }
    } catch (e) {
      return null
    }
  },
  async deleteById(productId) {
    try {
      const res1 = await Product.deleteOne({_id: productId})
      const res2 = await infoService.deleteByProductId(productId);
      if (res1?.deletedCount === 0) {
        if (res2?.deletedCount === 0) {
          throw new Error('Not found product or info by productId')
        }
      }
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}