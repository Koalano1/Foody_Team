import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';



const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: { type: String },
  },

  { timestamps: true, versionKey: false }

)

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema)

export default User
