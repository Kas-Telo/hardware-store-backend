import {Schema, model} from "mongoose";
import {infoTypeSchema} from "./Info.js";

const searchParamsByCategorySchema = new Schema({
  categoryTitle: {
    type: String,
    require: true
  },
  params: [infoTypeSchema]
})

export default model('SearchParamsByCategory', searchParamsByCategorySchema)