import Category from '../../models/category.model.js';
import Product from '../../models/Product.js';
import { categoryValidate } from '../../validates/category.validate.js';

export const categoryController = {
  /* crate */
  createCategory: async (req, res) => {
    try {
      const body = req.body;

      const { errors } = categoryValidate.validate(body, { abortEarly: false });
      if (errors) return res.status(400).json({ msg: errors.message });

      /* add database */
      const category = await Category.create(body);

      return res.status(200).json({ msg: 'Create category successfully', data: category });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  /* update */
  updateCategory: async (req, res) => {
    try {
      const body = req.body;

      const { errors } = categoryValidate.validate(body, { abortEarly: false });
      if (errors) return res.status(400).json({ msg: errors.message });

      /* update database */
      const category = await Category.findByIdAndUpdate({ _id: req.params.id }, body);
      if (!category) return res.status(400).json({ msg: 'Category does not exist' });

      return res.status(200).json({ msg: 'Update category successfully' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  /* get all */
  getAllCategory: async (_, res) => {
    try {
      const category = await Category.find();

      return res.status(200).json({ message: 'Get all categories success', data: category });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  /* get one */
  getOneCategory: async (req, res) => {
    try {
      const category = await Category.findById({ _id: req.params.id });

      return res.status(200).json({ data: category });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  /* delete */
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete({ _id: req.params.id });
      if (!category) return res.status(400).json({ msg: 'Category does not exist' });

      /* delete id product in productId */
      await Product.updateMany({ _id: { $in: category.productId } }, { $pull: { categoryId: category._id } });

      return res.status(200).json({ msg: 'Delete category successfully' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
