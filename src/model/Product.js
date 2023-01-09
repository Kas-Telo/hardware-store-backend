import {Schema, model} from "mongoose";

const productSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
}, {versionKey: false})

export default model('product', productSchema)