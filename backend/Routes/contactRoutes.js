import express from 'express';
import * as contactController from '../Controllers/contactController.js';
import { admin, protect } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post("/", contactController.submitContactMessage);

router.get('/', protect, admin, 
    
    contactController.getAllContactMessages
);

router.delete('/:id', protect, admin, 
   
    contactController.deleteMessage
);



export default router;