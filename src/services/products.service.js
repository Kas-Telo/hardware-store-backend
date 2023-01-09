import {infoService} from "./info.serviece.js";
import Product from "../model/Product.js";
import {categoryService} from "./category.service.js";
import {searchParamsService} from "./search-params-by-category.service.js";
import {Info} from "../model/Info.js";

export const productsService = {
  async createNewProduct(category, manufacturer, model, price, rate, info) {
    try {
      const categoryIdArray = await categoryService.findAllCategoriesId({title: category})
      console.log('cat: ' + categoryIdArray)

      const newProduct = new Product({
        categoryId: categoryIdArray[0]._id,
        manufacturer,
        model,
        price,
        rate
      })
      const productObj = await newProduct.save()
      const productId = productObj._id
      const infoObj = await infoService.createInfoForProduct(productId, info)
      if (!infoObj) {
        await Product.deleteOne({_id: productId})
        return null
      }
      const isSearchParamsUpdated = await searchParamsService.updateSearchParams(category, info)
      if (!isSearchParamsUpdated) {
        await Info.deleteOne({_id: infoObj._id})
        return false
      }
      const productF = {
        ...productObj._doc,
        info: {...infoObj._doc}
      }
      return productF
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findAllProducts(filter) {
    try {
      console.log('info')
      console.log(filter.info)
      const categoriesFilter = filter.category ? {title: filter.category} : {}
      const categoryIdArray = await categoryService.findAllCategoriesId(categoriesFilter)
      const categoryIdFilter = categoryIdArray ? {categoryId: categoryIdArray} : {}
      let productIdByInfoFilter = {}
      if (typeof filter.category === 'string' && filter.info) {
        const productIdArray = await infoService.findAllInfo(filter.info)
        if(productIdArray.length > 0 ) {
          productIdByInfoFilter = {_id: productIdArray}
        }else {
          return null
        }
      }
      const products = await Product.find({
        ...categoryIdFilter,
        ...productIdByInfoFilter,
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
      console.log(...info._doc)
      return {
        ...product._doc,
        info: {...info._doc}
      }
    } catch (e) {
      return null
    }
  },
  async deleteProductById(productId) {
    try {
      const res1 = await Product.deleteOne({_id: productId})
      const res2 = await infoService.deleteInfoByProductId(productId);
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