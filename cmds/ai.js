
const axios = require('axios');

const onStart = true;

async function handleMessage(message) {
    try {
        const question = encodeURIComponent(message);
        const uid = '123';
        const response = await axios.get(
            `https://api-hugging-face-mixtral-vercel.vercel.app/deepseek?question=${question}&uid=${uid}`
        );
        return response.data.response;
    } catch (error) {
        console.error('Error in AI response:', error);
        return "Désolé, je ne peux pas répondre pour le moment.";
    }
}

module.exports = { handleMessage, onStart };
