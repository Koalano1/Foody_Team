import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';


export const orderStatus = {
  NOT_PROCESSED: 'Not processed',
  CASH_ON_DELIVERY: 'Cash on delivery',
  PROCESSING: 'Processing',
  DISPATCHED: 'Dispatched',
  CANCELLED: 'Cancelled',
  DELIVERED: 'Delivered',
  DONE:'Done',
}

const orderSchema = new mongoose.Schema(
  {
    orderByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderStatus: {
      type: String,
      default: orderStatus.PROCESSING
    },
    paymentIntent: {
      type: String,
      createdAt: Date,
      default: orderStatus.CASH_ON_DELIVERY,

    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        count: Number,
        price: Number,
        priceDiscount: Number,
      },
    ],
    totalPrice: {
      type: Number,
      require: true
    },
  },
  { timestamps: true, versionKey: false }
)

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model('Order', orderSchema)

export default Order
