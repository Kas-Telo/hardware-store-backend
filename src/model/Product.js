import {Schema, model} from "mongoose";

const productSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  manufacturer: {
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
})

export default model('product', productSchema)