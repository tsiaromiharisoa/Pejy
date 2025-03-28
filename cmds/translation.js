
const axios = require('axios');

async function handleMessage(message) {
    if (!message) {
        return "Veuillez entrer un texte à traduire et la langue cible (exemple: 'Bonjour le monde en')";
    }

    try {
        const parts = message.split(' ');
        const langue = parts.pop(); // Prend le dernier mot comme langue cible
        const text = parts.join(' '); // Le reste est le texte à traduire

        const response = await axios.get(
            `https://api-test-liart-alpha.vercel.app/translation?text=${encodeURIComponent(text)}&langue=${langue}`
        );

        return response.data.response;
    } catch (error) {
        console.error('Error in translation:', error);
        return "Désolé, une erreur s'est produite lors de la traduction.";
    }
}

module.exports = { handleMessage };
