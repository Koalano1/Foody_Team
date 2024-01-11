import Cart from '../../models/Cart.js'
import Product from '../../models/Product.js'

export const addToCart = async (req, res) => {
  const loggedInUser = req.user;
  const body = req.body;

  if (!body.products) {
    return res.status(422).json({
      message: 'Missing data!',
    });
  }

  try {
    let totalPrice;
    let totalPriceDiscount;

    let products = [];

    const foundCart = await Cart.findOne({
      user: loggedInUser._id,
    });

    //TODO: handle add to cart when cart of user is already exist
    if (foundCart) {
      products = products.concat(foundCart.products);

      for (let i = 0; i < body.products.length; i++) {
        const product = body.products[i];

        if (!product.id || !product.count) {
          return res.status(400).json({
            message: 'Invalid data',
          });
        }

        const productData = await Product.findById(product.id);

        if (!productData) {
          return res.status(422).json({
            message: 'The productId is invalid.',
          });
        }

        const findProductIndex = products.findIndex((item) => item.product.toString() === product.id);

        if (findProductIndex === -1) {
          products.push({
            product: productData.id,
            count: product.count,
            price: productData.price,
            priceDiscount: productData?.priceDiscount,
          });
        } else {
          products[findProductIndex] = {
            product: productData.id,
            count: product.count + products[findProductIndex].count,
            price: productData.price,
            priceDiscount: productData?.priceDiscount,
          };
        }
      }

      totalPrice = products.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.count * currentValue.price;
      }, 0);
      totalPriceDiscount = products.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.count * (currentValue.priceDiscount || currentValue.price);
      }, 0);

      const updatedCart = await Cart.findByIdAndUpdate(
        foundCart.id,
        {
          products,
          totalPrice: totalPrice,
        },
        { new: true },
      );

      return res.status(200).json({
        message: 'Add to cart successfully.',
        data: updatedCart,
      });
    }

    // TODO: handle create new cart when cart of user is not exist
    for (let i = 0; i < body.products.length; i++) {
      const product = body.products[i];

      if (!product.id || !product.count) {
        return res.status(400).json({
          message: 'Invalid data',
        });
      }

      const productData = await Product.findById(product.id).populate('category');

      if (!productData) {
        return res.status(422).json({
          message: 'The productId is invalid.',
        });
      }

      products.push({
        product: productData.id,
        count: product.count,
        price: productData.price,
      });
    }

    totalPrice = products.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.count * currentValue.price;
    }, 0);

    const newCart = await Cart.create({
      products,
      totalPrice,
      user: loggedInUser._id,
    });

    return res.status(200).json({
      message: 'Add to new cart successfully.',
      data: newCart,
    });
  } catch (error) {
    return res.status(500).json({
      error: `${error.message || 'Something went wrong!'}`,
    });
  }
};

export const getCart = async (req, res) => {
  const loggedInUser = req.user;

  try {
    const foundCart = await Cart.findOne({ user: loggedInUser._id }).populate('products.product').exec();

    if (!foundCart) {
      return res.status(200).json({
        message: 'Cart empty.',
        data: {},
      });
    }

    return res.status(200).json({
      message: 'Get cart successfully.',
      data: foundCart,
    });
  } catch (error) {
    return res.status(500).json({
      error: `${error.message || 'Something went wrong!'}`,
    });
  }
};


/* update Cart */
export const updateCart = async (req, res) => {
  try {
    // lay id header, id product, quantity,   total
    const { _id } = req.user;
    const { quantity: newQuantity, id: idProduct } = req.body;

    const getCart = await Cart.findOne({
      user: _id,

    });

    if (getCart) {

      const cartItem = getCart.products.find((item) => item?._id == idProduct);

      if (cartItem) {
       
        if (newQuantity == 0) {
          getCart.products = getCart.products.filter((item) => item._id != idProduct);
         
        } else {
          cartItem.count = newQuantity;
          cartItem.totalPrice = cartItem.price * cartItem.count;
        }
        await getCart.save();

        // console.log('Cart item updated successfully');
      } else {
        // console.log("k tìm thấy id_cart ietm")
        return res.status(400).json({
          message: 'fail',
          err: 'Cart item not found',
        });
      }
    } else {
      return res.status(400).json({
        message: 'fail',
        err: 'Cart not found',
      });
    }

    // Check if all items are removed from the cart
    const hasItems = getCart.products.length > 0;

    if (!hasItems) {
      await Cart.findByIdAndRemove(getCart._id);
      console.log('Cart deleted successfully');
    }
    return res.status(200).json({
      message: 'success',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
/* delete Cart */
export const deleteCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const { cartItemId } = req.params;
    const getCart = await Cart.findOne({
      user: _id,

    });
    if (getCart) {
      const data = getCart.products.filter(items => items._id != cartItemId)
      getCart.products = [...data];
      await getCart.save();
      return res.json({
        message: 'delete success',
        data: getCart,
      });
    }

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
