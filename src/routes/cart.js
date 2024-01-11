import { addToCart, deleteCart, getCart, updateCart } from '../controllers/CartController/index.js';
import { auth } from '../middlewares/auth.js';
import express from 'express';
const router = express.Router();

router.get('/cart', auth, getCart);
router.post('/cart/add', auth, addToCart);
router.post('/cart/update', auth, updateCart);
router.delete('/cart/delete/:cartItemId', auth, deleteCart);


export default router


