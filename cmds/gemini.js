
const axios = require('axios');

const onStart = true;

// Store active image conversations
const activeImageConversations = new Map();

async function handleMessage(message, attachments) {
    try {
        const uid = '123'; // You can modify this based on user ID

        // Check if there's an image attachment
        if (attachments && attachments.length > 0) {
            const imageUrl = attachments[0];
            activeImageConversations.set(uid, imageUrl);
            return "J'ai bien reçu votre image, quel est votre question concernant cette image?";
        }

        // Get stored image URL if exists
        const storedImageUrl = activeImageConversations.get(uid);

        // Prepare request body
        const requestBody = {
            prompt: message,
            customId: uid
        };

        // Add image URL if exists
        if (storedImageUrl) {
            requestBody.link = storedImageUrl;
            // Clear stored image after use
            activeImageConversations.delete(uid);
        }

        // Make API request
        const response = await axios.post(
            'https://gemini-sary-prompt-espa-vercel-api.vercel.app/api/gemini',
            requestBody
        );

        return response.data.message;
    } catch (error) {
        console.error('Error in Gemini response:', error);
        return "Désolé, je ne peux pas répondre pour le moment.";
    }
}

module.exports = { handleMessage, onStart };
