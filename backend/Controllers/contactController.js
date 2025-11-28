
import ContactMessage from '../models/ContactsMessage.js';
export const submitContactMessage = async (req, res) => {
    const { name, email, message } = req.body;

    // Simple validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    try {
        const newContact = new ContactMessage({
            name,
            email,
            message
        });

        await newContact.save();
        
        // Success response
        res.status(201).json({ 
            success: true, 
            message: 'Your message has been sent successfully. We will get back to you soon!'
        });

    } catch (error) {
        console.error('Error saving contact message:', error);
        res.status(500).json({ success: false, message: 'Server error. Could not send message.' });
    }
};


export const getAllContactMessages = async (req, res) => {
  
    
    try {
       
        const messages = await ContactMessage.find().sort({ date: -1 }); 
        res.json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({ success: false, message: 'Server error. Could not fetch messages.' });
    }
};

export const deleteMessage = async (req, res) => {
    const messageId = req.params.id;

    try {
        const deletedMessage = await ContactMessage.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: 'Message not found.' });
        }
        res.json({ success: true, message: 'Message deleted successfully.' });
    } catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({ success: false, message: 'Server error. Could not delete message.' });
    }
};  
