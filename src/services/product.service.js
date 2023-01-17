import {infoService} from "./info.serviece.js";
import Product from "../model/Product.js";
import {categoryService} from "./category.service.js";
import {searchParamsService} from "./search-params-by-category.service.js";
import {Info} from "../model/Info.js";
import {ApiError} from "../error/ApiError.js";

export const productService = {
  async create(next, categoryId, brand, model, price, rate, info) {
    try {
      try {
        const category = await categoryService.findById(next, categoryId, {})
      } catch {
        return Promise.reject()
      }

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
    const categoriesFilter = filter.categoryId ? {_id: filter.categoryId} : {}
    let categoryIdFilter = {}
    try {
      const categoryIdArray = await categoryService.findAll(categoriesFilter, {_id: 1})
      categoryIdFilter = {categoryId: categoryIdArray}
    } catch (e) {
      throw e
    }

    let productIdByInfoFilter = {}
    if (typeof filter.categoryId === 'string' && filter.info) {
      try {
        const productIdArray = await infoService.findAllProductId(filter.info)
        productIdByInfoFilter = {_id: productIdArray}
      } catch (e) {
        throw e
      }
    }

    try {
      const products = await Product.find({
        ...categoryIdFilter,
        ...productIdByInfoFilter,
        $or: [
          {brand: {$regex: filter.title ?? '', $options: 'i'}},
          {model: {$regex: filter.title ?? '', $options: 'i'}}
        ]
      })
      if (products.length === 0) throw ApiError.notFound("Продукты не найдены")
      return products
    } catch (e) {
      throw e
    }
  },
  async findById(productId) {
    try {
      let info = await infoService.findByProductId(productId, {_id: 0, productId: 0})

      const product = await Product.findById(productId)
      if (!product) throw ApiError.notFound("Продукт не найден")
      if(product && !info ) throw ApiError.internal("При создании продукта, не произошло создаие info")

      return {
        ...product._doc,
        info: info._doc.info
      }
    } catch (e) {
      throw e
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