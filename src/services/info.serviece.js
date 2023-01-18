import {Info} from "../model/Info.js";
import {ApiError} from "../error/ApiError.js";

export const infoService = {
  async createInfoForProduct(productId, info) {
    try {
      const newInfo = new Info({
        productId, info
      })
      return await newInfo.save()
    } catch (e) {
      throw e
    }
  },
  async findAllProductId(filter) {
    try {
      const productIdArrayOfArraysByDifferentFilters = await Promise.all(filter.map(async (el1) => {
        let infoArrayByOneFilter = []

        if (typeof el1.description === 'string') {
          const infoArrayByOneFilterDescription = await Info.find({
            info: {$elemMatch: {$and: [{title: el1.title}, {description: el1.description}]}}
          })

          return infoArrayByOneFilterDescription.map(el => el.productId.toString())
        } else {
          infoArrayByOneFilter = await Promise.all(el1.description.map(async (el) => {
            const infoArrayByOneFilterDescription = await Info.find({
              info: {$elemMatch: {$and: [{title: el1.title}, {description: el}]}}
            })

            return infoArrayByOneFilterDescription.map(el => el.productId.toString())
          }))
        }

        return infoArrayByOneFilter.flat()
      }))

      productIdArrayOfArraysByDifferentFilters.sort((a, b) => a.length - b.length)

      if (productIdArrayOfArraysByDifferentFilters[0].length === 0) {
        throw ApiError.notFound("Продукты не найдены")
      }
      if (productIdArrayOfArraysByDifferentFilters.length === 1 && productIdArrayOfArraysByDifferentFilters[0] !== 0) {
        return productIdArrayOfArraysByDifferentFilters[0]
      }

      const resultProductIdArray = productIdArrayOfArraysByDifferentFilters[0].map(el => {
        for (let i = 1; i < productIdArrayOfArraysByDifferentFilters.length; i++) {
          const bePresent = productIdArrayOfArraysByDifferentFilters[i].includes(el)
          if (!bePresent) return
        }
        return el
      })
      return resultProductIdArray
    } catch (e) {
      throw e
    }
  },
  async findByProductId(productId, responseFilter) {
    try {
      const info = await Info.find({productId: productId}).select(responseFilter)
      return info[0]
    } catch (e) {
      throw e
    }
  },
  async deleteByProductId(productId) {
    try {
      return await Info.findOneAndDelete({productId})
    } catch (e) {
      throw e
    }
  }
}