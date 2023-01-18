import {searchParamsService} from "../services/search-params-by-category.service.js";


export const getSearchParamsByCategory = async (req, res, next) => {
  try {
    const params = await searchParamsService.findSearchParamsByCategory(req.params.id)
    return res.status(200).json(params)
  } catch (e) {
    next(e)
  }
}