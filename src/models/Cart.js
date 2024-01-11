import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';

const CartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        count: Number,
        price: Number,
        priceDiscount: Number,
      },
    ],
    totalPrice: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, versionKey: false },
);


CartSchema.plugin(mongoosePaginate);

const Cart = mongoose.model('Cart', CartSchema)

export default Cart
