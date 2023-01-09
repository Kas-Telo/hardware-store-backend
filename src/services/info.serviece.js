import {Info} from "../model/Info.js";

export const infoService = {
  async createInfoForProduct(productId, info) {
    try {
      const infoInst = new Info({
        productId,
        info
      })
      const infoObj = await infoInst.save()
      console.log(infoObj._doc)
      console.log(infoObj.$getAllSubdocs())
      return infoObj
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findAllInfo(filter) {
    try {
      const resultArray = await Promise.all(filter.map(async (el) => {
        const productIdArray = await Info.find({info: {$elemMatch: {$and: [{title: el.title}, {description: el.description}]}}})
        return productIdArray.map(el => el.productId.toString())
      }))
      resultArray.sort((a, b) => a.length - b.length)
      if(resultArray.length[0] === 0) return []
      if(resultArray.length === 0) return []
      if(resultArray.length === 1) return resultArray
      const resultProductIdArray = resultArray[0].map(el => {
        for(let i = 1; i < resultArray.length; i++){
          const bePresent = resultArray[i].includes(el)
          if(!bePresent) return

        }
        return el
      })

      console.log('resultArray')
      console.log(resultArray)
      console.log('resultProductIdArray')
      console.log(resultProductIdArray)
      return resultProductIdArray
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async findInfoByProductId(productId) {
    try {
      const info = await Info.find({productId: productId}, {_id: 0, __v: 0, productId: 0})
      if (info === {}) return null
      return info[0]
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async deleteInfoByProductId(productId) {
    try {
      const res = await Info.findOneAndDelete({productId})
      return res
    } catch (e) {
      console.log(e)
      return null
    }
  }
}