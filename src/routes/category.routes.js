import { categoryController } from '../controllers/category/category.controller.js'
import express from 'express'

const router = express.Router()

router.post('/category', categoryController.createCategory)
router.get('/categories', categoryController.getAllCategory)
router.get('/category/:id', categoryController.getOneCategory)
router.put('/category/:id', categoryController.updateCategory)
router.delete('/category/:id', categoryController.deleteCategory)

export default router
