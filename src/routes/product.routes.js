import express from 'express';
import { productController } from '../controllers/ProductController/product.controller.js';

const router = express.Router();

router.post('/product', productController.create);
router.get('/products', productController.getAll);
router.get('/product/:id', productController.getOne);
router.put('/product/:id', productController.update);
router.delete('/product/:id', productController.delete);

export default router;
