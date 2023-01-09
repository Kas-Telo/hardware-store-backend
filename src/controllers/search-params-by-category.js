import {searchParamsService} from "../services/search-params-by-category.service.js";


export const getSearchParamsByCategory = async (req, res) => {
  const params = await searchParamsService.findSearchParamsByCategory(req.query.categoryId)
  if (!params) return res.status(500).json({message: 'Failed'})
  return res.status(200).json(params)
}