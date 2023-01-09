import {Schema, model} from "mongoose";

const categorySchema = new Schema({
  title: {type: String, require: true},
}, {versionKey: false})

export default model('Category', categorySchema)