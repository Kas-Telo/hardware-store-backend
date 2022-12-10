import Specification from "../model/Specification.js";

export const specificationService = {
  async createSpecForProduct(productId, spec) {
    try {
      const specification = new Specification({
        productId,
        ...spec
      })
      await specification.save()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  },
  async findSpecByProductId(productId) {
    try {
      const spec = await Specification.find({productId: productId}, {_id: 0, __v: 0, productId: 0})
      if(spec === {}) return null
      return spec[0]
    } catch (e) {
      console.log(e)
      return null
    }
  },
  async deleteSpecByProductId(productId) {
    try {
      await Specification.findOneAndDelete({productId})
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }
}