import {productService} from "../services/product.service.js";
import {ApiError} from "../error/ApiError.js";
import {ObjectId} from "bson";

export const getAll = async (req, res, next) => {
  try {
    const {categoryId, info} = req.query
    if (categoryId && Array.isArray(categoryId)) {
      categoryId.map(el => {
        if (!ObjectId.isValid(el)) {
          throw ApiError.badRequest("categoryId должен быть типа ObjectId")
        }
      })
    } else if (categoryId && !ObjectId.isValid(categoryId)) {
      throw ApiError.badRequest("categoryId должен быть типа ObjectId")
    }

    if(categoryId){
      if(info){
        if(Array.isArray(info)){
          if(!info.every((element, index, array) => {
            element.key
          })){
            throw ApiError.badRequest("info не соотвтетствует типу [ { title: string, description: string | [string] } ]")
          }
        }
      }
    }

    const products = await productService.findAll(req.query)
    return res.status(200).json(products)
  } catch (e) {
    next(e)
  }
}
export const getOne = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id)
    return res.status(200).json(product)
  } catch (e) {
    next(e)
  }
}
export const create = async (req, res, next) => {
  const {categoryId, brand, model, price, rate, info} = req.body
  try {
    const product = await productService.create(categoryId, brand, model, price, rate, info)
    return res.status(200).send(product)
  } catch (e) {
    next(e)
  }
}
export const removeOne = async (req, res, next) => {
  try {
    await productService.deleteById(req.params.id);
    return res.status(200).json({message: 'Успешно'})
  } catch (e) {
    next(e)
  }
}

