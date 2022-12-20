import Info from "../model/Info.js";

export const infoService = {
  async createInfoForProduct(productId, info) {
    try {
      const infoInst = new Info({
        productId,
        info
      })
      const obj = await infoInst.save()
      console.log(obj)
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  async findInfoByProductId(productId) {
    try {
      const info = await Info.find({productId: productId}, {_id: 0, __v: 0, productId: 0})
      if(info === {}) return null
      return info[0]
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async deleteInfoByProductId(productId) {
    try {
      await Info.findOneAndDelete({productId})
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}