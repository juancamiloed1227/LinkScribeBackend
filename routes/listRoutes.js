import express from 'express';
import { authenticate } from '../middlewares/middleware.js'
import { getAllLists, createList, getListById, updateListById, deleteListById, addLinkToList, getLinksInList } from '../controllers/listController.js'

const router = express.Router();

router.get('/', authenticate, getAllLists);
router.post('/', authenticate, createList);
router.get('/:id', authenticate, getListById);
router.put('/:id', authenticate, updateListById);
router.delete('/:id', authenticate, deleteListById);
router.post('/addLink', authenticate, addLinkToList);
router.get('/getLinks/:id', authenticate, getLinksInList);

export default router;