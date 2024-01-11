
import {
    activateUser,
    createUser,
    deactivateUser,
    deleteUser,
    getAllUsers,
    getMe,
    getUser,
    updateAddress,
    updateMe,
    updateUser
} from '../controllers/UserController/index.js'
import { auth, isAdmin } from '../middlewares/auth.js'
import express from 'express'
const router = express.Router()

router.get('/user', auth, getMe)
router.put('/user/update', auth, updateMe)

router.put('/user/address/update', auth, updateAddress)

// Admin router
router.get('/user/:id', auth, getUser)
router.get('/users', auth, getAllUsers)
router.put('/user/update/:id', auth, updateUser)
router.delete('/user/delete/:id', auth, deleteUser)
router.put('/user/activate/:id', auth, isAdmin, activateUser)
router.post('/user/create', auth, createUser)
router.put('/user/deactivate/:id', auth, isAdmin, deactivateUser)
export default router
