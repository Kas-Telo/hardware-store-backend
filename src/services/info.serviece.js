import {Info} from "../model/Info.js";

export const infoService = {
  async createInfoForProduct(productId, info) {
    try {
      const newInfo = new Info({
        productId,
        info
      })
      return await newInfo.save()
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findAllProductId(filter) {
    try {
      const resultArray = await Promise.all(filter.map(async (el) => {
        const productIdArray = await Info.find({info: {$elemMatch: {$and: [{title: el.title}, {description: el.description}]}}})
        return productIdArray.map(el => el.productId.toString())
      }))
      resultArray.sort((a, b) => a.length - b.length)

      if (resultArray.length[0] === 0) return []
      if (resultArray.length === 0) return []
      if (resultArray.length === 1) return resultArray[0]

      const resultProductIdArray = resultArray[0].map(el => {
        for (let i = 1; i < resultArray.length; i++) {
          const bePresent = resultArray[i].includes(el)
          if (!bePresent) return
        }
        return el
      })

      return resultProductIdArray
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findById(productId, responseFilter) {
    try {
      const info = await Info.find({productId: productId}).select(responseFilter)
      if (info === {}) return null
      return info[0]
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async deleteByProductId(productId) {
    try {
      return await Info.findOneAndDelete({productId})
    } catch (e) {
      console.log(e)
      return null
    }
  }
}