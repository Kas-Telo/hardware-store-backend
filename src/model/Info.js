import {Schema, model} from "mongoose";

export const infoTypeSchema = new Schema({
  title: {type: String, require: true},
  description: {type: String, require: true}
}, {_id: false})
const infoSchema = new Schema({
  productId: Schema.Types.ObjectId,
  info: [infoTypeSchema]
})

export default model('info', infoSchema)