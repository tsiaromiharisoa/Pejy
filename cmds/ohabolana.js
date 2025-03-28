
const axios = require('axios');

async function handleMessage(message) {
    if (!message) {
        return "Veuillez entrer un mot clé pour rechercher des ohabolana (exemple: omby, vary, etc)";
    }

    try {
        const keyword = encodeURIComponent(message.trim().toLowerCase());
        const response = await axios.get(
            `https://test-api-milay-vercel.vercel.app/api/ohab/recherche?ohabolana=${keyword}`
        );

        const data = response.data;
        
        // Diviser les résultats en groupes de 5 pour éviter les messages trop longs
        const chunks = [];
        let currentChunk = [];
        
        data.resultats.forEach((result, index) => {
            currentChunk.push(result);
            if ((index + 1) % 5 === 0 || index === data.resultats.length - 1) {
                chunks.push(currentChunk.join('\n\n'));
                currentChunk = [];
            }
        });

        // Préparer la réponse
        const messages = [
            `${data.titre}\n${data.Auteur}\n\n${data.timestamp}`,
            ...chunks
        ];

        return messages;

    } catch (error) {
        console.error('Error in ohabolana:', error);
        return "Désolé, une erreur s'est produite lors de la recherche des ohabolana.";
    }
}

module.exports = { handleMessage };
