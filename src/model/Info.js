import {Schema, model} from "mongoose";

const infoSchema = new Schema({
  productId: Schema.Types.ObjectId,
  info: {
    type: [{
      title: String,
      description: String,
    }], _id: false
  },
}, {versionKey: false})

export const Info = model('Info', infoSchema)