import express from 'express';
import {
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    createCategory,
    deleteCategoryById
} from '../controllers/categoryController.js';
import { authenticate } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/', authenticate, getAllCategories);
router.post('/', authenticate, createCategory);
router.get('/:id', authenticate, getCategoryById);
router.put('/:id', authenticate, updateCategoryById);
router.delete('/:id', authenticate, deleteCategoryById);

export default router;
