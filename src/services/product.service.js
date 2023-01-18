import {infoService} from "./info.serviece.js";
import Product from "../model/Product.js";
import {categoryService} from "./category.service.js";
import {searchParamsService} from "./search-params-by-category.service.js";
import {Info} from "../model/Info.js";
import {ApiError} from "../error/ApiError.js";

export const productService = {
  async create(categoryId, brand, model, price, rate, info) {
    try {
      const category = await categoryService.findById(categoryId, {})
      if (!category) {
        throw ApiError.notFound("Такой категории не существует, проверьте вводные данные")
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
        throw ApiError.internal("Ошибка при создании документа info")
      }

      const isSearchParamsUpdated = await searchParamsService.updateSearchParams(categoryId, info)
      if (!isSearchParamsUpdated) {
        await Info.deleteOne({_id: infoDoc._id})
        await Product.deleteOne({_id: productId})
        throw ApiError.internal("Ошибка при обновлении параметров поиска")
      }

      const productF = {
        ...productDoc._doc,
        info: infoDoc.info
      }
      return productF
    } catch (e) {
      throw e
    }
  },
  async findAll(filter) {
    try {
      const {page = 1, limit = 1} = filter
      const categoriesFilter = filter.categoryId ? {_id: filter.categoryId} : {}
      let categoryIdFilter = {}
      const categoryIdArray = await categoryService.findAll(categoriesFilter, {_id: 1})
      if (categoryIdArray.length === 0) {
        throw ApiError.notFound("Категорий с такими id не найдено")
      }
      categoryIdFilter = {categoryId: categoryIdArray}


      let productIdByInfoFilter = {}
      if (typeof filter.categoryId === 'string' && filter.info) {

        const productIdArray = await infoService.findAllProductId(filter.info)
        productIdByInfoFilter = {_id: productIdArray}
      }

      const totalCount = await Product.find({
        ...categoryIdFilter,
        ...productIdByInfoFilter,
        $or: [
          {brand: {$regex: filter.title ?? '', $options: 'i'}},
          {model: {$regex: filter.title ?? '', $options: 'i'}}
        ]
      }).count()

      const products = await Product.find({
        ...categoryIdFilter,
        ...productIdByInfoFilter,
        $or: [
          {brand: {$regex: filter.title ?? '', $options: 'i'}},
          {model: {$regex: filter.title ?? '', $options: 'i'}}
        ]
      }).limit(limit * 1).skip((page - 1) * limit)

      const productF = {
        products,
        totalCount,
      }

      return productF
    } catch (e) {
      throw e
    }
  },
  async findById(productId) {
    try {
      let info = await infoService.findByProductId(productId, {_id: 0, productId: 0})

      const product = await Product.findById(productId)
      if (!product) throw ApiError.notFound("Продукт не найден")
      if (product && !info) throw ApiError.internal("При создании продукта, не произошло создаие info")

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
      const resultByProductDeleted = await Product.deleteOne({_id: productId})
      if (resultByProductDeleted.deletedCount === 0) {
        throw ApiError.internal("Ошибка при удалении продукта")
      }
      const resultByInfoOfProductDeleted = await infoService.deleteByProductId(productId);
      if (resultByInfoOfProductDeleted.deletedCount === 0) {
        throw ApiError.internal("Ошибка при удалении info продукта")
      }
      return true
    } catch (e) {
      throw e
    }
  }
}