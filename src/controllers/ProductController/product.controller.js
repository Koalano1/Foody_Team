import Category from '../../models/category.model.js';
import Product from '../../models/Product.js';
import { productValidate } from '../../validates/product.validate.js';

export const productController = {
  /* create product */
  create: async (req, res) => {
    try {
      const body = req.body;
      const { error } = productValidate.validate(body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ msg: error.details.map((err) => err.message) });
      }

      /* add category */
      const category = await Category.findById(body.category);
      if (!category) {
        return res.status(400).json({ msg: 'Category does not exist' });
      }
      /* add database */
      const product = await Product.create(body);
      if (!product) {
        return res.status(400).json({ msg: 'Create product fail' });
      }

      await Category.findByIdAndUpdate(product.category, {
        $addToSet: { products: product._id },
      });
      return res.status(200).json({ msg: 'Create product successfully', data: product });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  /* get all */
  getAll: async (req, res) => {
    try {
      /* get query */
      const query = req.query.name || '';
      const products = await Product.find({ title: { $regex: query, $options: 'i' } }).populate({
        path: 'category',
        select: 'name',
      });
      return res.status(200).json({ message: 'get all product success', data: products });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  /* get one */
  getOne: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('category');
      if (!product) {
        return res.status(400).json({ msg: 'Product does not exist' });
      }
      return res.status(200).json({ data: product });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  /* update */
  update: async (req, res) => {
    try {
      const body = req.body;
      const { error } = productValidate.validate(body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ msg: error.details.map((err) => err.message) });
      }

      /* update database */
      const product = await Product.findByIdAndUpdate({ _id: req.params.id }, body);
      if (!product) {
        return res.status(400).json({ msg: 'Product does not exist' });
      }

      /* loại id product ra khỏi danh sách category */
      await Category.findByIdAndUpdate(product.category, {
        $pull: { products: product._id },
      });

      /* add category */
      await Category.findByIdAndUpdate(body.category, {
        $addToSet: { products: product._id },
      });

      return res.status(200).json({ msg: 'Update product successfully' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  /* delete */
  delete: async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete({ _id: req.params.id });
      if (!product) {
        return res.status(400).json({ msg: 'Product does not exist' });
      }

      /* delete id product in categoryId */
      await Category.findByIdAndUpdate(product.category, {
        $pull: { products: product._id },
      });

      return res.status(200).json({ msg: 'Xóa sản phẩm thành công!' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
