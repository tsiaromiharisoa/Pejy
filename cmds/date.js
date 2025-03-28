
const axios = require('axios');

async function handleMessage(message) {
    if (!message || message.trim() === '') {
        return "Veuillez spécifier une localisation (exemple: France, Madagascar, etc)";
    }

    try {
        const location = encodeURIComponent(message.trim());
        const response = await axios.get(
            `https://api-test-liart-alpha.vercel.app/date?heure=${location}`
        );
        
        if (!response.data || !response.data.localisation) {
            return `Désolé, la localisation "${message}" n'est pas supportée.`;
        }

        const data = response.data;
        return `${data.localisation}\nHeure: ${data.heure_actuelle}\nDate: ${data.date_actuelle}`;
    } catch (error) {
        console.error('Error getting date/time:', error);
        return `Désolé, la localisation "${message}" n'est pas supportée. Veuillez essayer avec une autre localisation comme France ou Madagascar.`;
    }
}

module.exports = { handleMessage };
