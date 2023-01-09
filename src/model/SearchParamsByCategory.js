import {Schema, model} from "mongoose";

const searchParamsByCategorySchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    require: true
  },
  params: {
    type: [{
      title: String,
      description: String,
    }], _id: false
  },
}, {versionKey: false})

export default model('SearchParamsByCategory', searchParamsByCategorySchema)