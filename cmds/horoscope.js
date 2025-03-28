
const axios = require('axios');

async function handleMessage(message) {
    if (!message) {
        return "Veuillez entrer votre signe astrologique (exemple: belier, taureau, etc)";
    }

    try {
        const signe = encodeURIComponent(message.trim().toLowerCase());
        const response = await axios.get(
            `https://test-api-milay-vercel.vercel.app/horoscope/rechercher?signe=${signe}`
        );

        const data = response.data;
        return [
            `🗓️ Date: ${data.date}`,
            `❤️ Amour:\nFR: ${data.amour.fr}\n\nMG: ${data.amour.mg}`,
            `💰 Argent:\nFR: ${data.argent.fr}\n\nMG: ${data.argent.mg}`,
            `🏥 Santé:\nFR: ${data.sante.fr}\n\nMG: ${data.sante.mg}`,
            `💼 Travail:\nFR: ${data.travail.fr}\n\nMG: ${data.travail.mg}`,
            `👨‍👩‍👧‍👦 Famille:\nFR: ${data.famille.fr}\n\nMG: ${data.famille.mg}`,
            `🤝 Vie sociale:\nFR: ${data.vie_sociale.fr}\n\nMG: ${data.vie_sociale.mg}`,
            `📝 Citation du jour:\nFR: ${data.citation_du_jour.fr}\nMG: ${data.citation_du_jour.mg}\n\n🍀 Nombre de chance: ${data.nombre_de_chance.fr}\n\n💡 Conseil:\nFR: ${data.clin_doeil.fr}\nMG: ${data.clin_doeil.mg}`
        ];

    } catch (error) {
        console.error('Error in horoscope:', error);
        return "Désolé, une erreur s'est produite lors de la récupération de votre horoscope.";
    }
}

module.exports = { handleMessage };
