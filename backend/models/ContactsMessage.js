
import mongoose from 'mongoose';

const ContactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'] 
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Archived'], 
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ContactMessage', ContactMessageSchema);