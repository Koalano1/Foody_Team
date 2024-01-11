import mongoose from 'mongoose'


const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema)

export default ProductCategory
