import express from 'express';
import {
    getAllLinks,
    getLinkById,
    createLink,
    updateLinkById,
    deleteLinkById
} from '../controllers/linkController.js';
import { authenticate } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/', authenticate, getAllLinks);
router.post('/', authenticate, createLink);
router.get('/:id', authenticate, getLinkById);
router.put('/:id', authenticate, updateLinkById);
router.delete('/:id', authenticate, deleteLinkById);

export default router;
