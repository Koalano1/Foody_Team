import { auth, isAdmin } from '../middlewares/auth.js';
import {
  cancelOrder,
  createOrder,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from '../controllers/OrderController/index.js';

import express from 'express';
import { isObjectId } from '../middlewares/validate.js';

const router = express.Router();
// Client
router.get('/orders/my-orders', auth, getMyOrders);
router.post('/orders/create-order', auth, createOrder);
router.put('/order/cancel/:id', isObjectId, auth, cancelOrder);

// Admin

router.get('/admin/all-orders', auth, getOrders);
router.put('/admin/order/cancel/:id', isObjectId, auth, isAdmin, cancelOrder);
router.put(
  '/admin/order/update-status/:id',
  isObjectId,
  auth,
  // isAdmin,
  updateOrderStatus,
);

export default router;
