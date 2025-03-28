
const axios = require('axios');

async function handleMessage(message) {
    try {
        const question = encodeURIComponent(message);
        const uid = '123'; // Vous pouvez modifier l'uid selon vos besoins
        const response = await axios.get(
            `https://llama-api-nine.vercel.app/llama?question=${question}&uid=${uid}`
        );
        return response.data.response;
    } catch (error) {
        console.error('Error in Llama response:', error);
        return "Désolé, je ne peux pas répondre pour le moment.";
    }
}

module.exports = { handleMessage };
