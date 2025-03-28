
const axios = require('axios');

async function handleMessage(message) {
    try {
        if (!message || message.trim() === '') {
            return 'Commandes disponibles:\n- create: Générer un email temporaire\n- inbox [email]: Vérifier la boîte de réception';
        }

        const [cmd, ...params] = message.trim().split(' ');

        if (cmd === 'create') {
            const response = await axios.get('https://test-api-milay-vercel.vercel.app/api/gen/generer?mail=create');
            const data = response.data;
            return `${data.titre}\n\n📧 Email: ${data.email}\n🔑 Token: ${data.token}\n${data.timestamp}\n\nPour vérifier votre boîte de réception, tapez:\ntempmail inbox ${data.email}`;
        }

        if (cmd === 'inbox') {
            const email = params.join(' ');
            if (!email) {
                return 'Veuillez spécifier une adresse email.\nExemple: tempmail inbox example@domain.com';
            }

            const response = await axios.get(`https://test-api-milay-vercel.vercel.app/api/inbox/message?mail=${encodeURIComponent(email)}`);
            const data = response.data;
            
            const messages = [];
            messages.push(`${data.titre}\n`);

            // Diviser les messages en parties plus petites
            for (const msg of data.messages) {
                messages.push(`De: ${msg.from}\nObjet: ${msg.subject}\nDate: ${new Date(msg.date).toLocaleString()}\n\n${msg.body}\n\n-------------------\n`);
            }

            return messages;
        }

        return 'Commande invalide. Utilisez:\n- create: Générer un email\n- inbox [email]: Vérifier la boîte';
    } catch (error) {
        console.error('Erreur TempMail:', error);
        return 'Une erreur est survenue. Veuillez réessayer.';
    }
}

module.exports = { handleMessage };
