import {ApiError} from "../error/ApiError.js";

export const errorHandlingMiddleware = (err, req, res, next) => {
  if(err instanceof ApiError){
    console.log(err.message)
    return res.status(err.status).json({message: err.message})
  }
  console.log(err)
  return res.status(500).json({message: "Непредвиденная ошибка, обратитесь в поддержку!"})
}