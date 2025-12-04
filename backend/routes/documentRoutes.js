import express from 'express';
import upload from '../config/multer.js';
import {
  deleteDocument,
  getDocument,
  getDocuments,
  uploadDocument,
} from '../controllers/documentController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Allroutes are protected
router.use(protect);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

export default router;
