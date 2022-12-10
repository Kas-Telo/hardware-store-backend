import {Schema, model} from "mongoose";

const specificationSchema = new Schema({
  productId: Schema.Types.ObjectId,
  weight: {
    type: Number
  },
  diagonal: {
    type: Number
  },
})

export default model('Specification', specificationSchema)