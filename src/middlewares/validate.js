import { isValidObjectId } from "../utils/helper.js"

 
export const isObjectId = async (req, res, next) => {
  const { id } = req.params

  if (isValidObjectId(id)) {
    return next()
  }

  return res.status(422).json({
    message: 'The ID is invalid or not found.',
  })
}
