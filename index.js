
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

let pageAccessToken = '';
let verifyToken = '';

// Map pour stocker les conversations actives
const activeConversations = new Map();

// Charger dynamiquement les commandes
const commands = {};
const onStartCommands = new Set();
fs.readdirSync(path.join(__dirname, 'cmds')).forEach(file => {
    const commandName = path.basename(file, '.js');
    const command = require(`./cmds/${commandName}`);
    commands[commandName] = command;
    if (command.onStart) {
        onStartCommands.add(commandName);
    }
});

app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === verifyToken) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.post('/webhook', async (req, res) => {
    const body = req.body;
    if (body.object === 'page') {
        for (const entry of body.entry) {
            const webhook_event = entry.messaging[0];
            const sender_psid = webhook_event.sender.id;
            
            if (webhook_event.message) {
                const userMessage = webhook_event.message.text || '';
                const attachments = webhook_event.message.attachments?.map(att => att.payload.url) || [];
                
                let response;
                const words = userMessage.split(' ');
                const commandName = words[0].toLowerCase();

                if (userMessage.toLowerCase() === 'stop') {
                    if (activeConversations.has(sender_psid)) {
                        const currentCmd = activeConversations.get(sender_psid);
                        activeConversations.delete(sender_psid);
                        response = `La commande ${currentCmd} a été désactivée`;
                    } else {
                        response = "Aucune commande active à arrêter";
                    }
                } else if (commands[commandName]) {
                    // Si c'est une nouvelle commande valide, on écrase l'ancienne conversation
                    const params = words.slice(1).join(' ');
                    activeConversations.set(sender_psid, commandName);
                    response = await commands[commandName].handleMessage(params);
                } else if (activeConversations.has(sender_psid)) {
                    // Continuer la conversation active
                    const currentCmd = activeConversations.get(sender_psid);
                    response = await commands[currentCmd].handleMessage(userMessage, attachments);
                } else if (commands[commandName] && !onStartCommands.has(commandName)) {
                    // Activer une nouvelle commande non-onStart
                    const params = words.slice(1).join(' ');
                    activeConversations.set(sender_psid, commandName);
                    response = await commands[commandName].handleMessage(params);
                } else {
                    // Si le message est "ai" ou "gemini", définir la commande active
                    if (userMessage.toLowerCase() === "ai" || webhook_event.message.quick_reply?.payload === "AI_SELECTED") {
                        activeConversations.set(sender_psid, "ai");
                        response = "🎯 La commande AI est activée avec succès! ✨\n\n🚀 Vous pouvez maintenant m'envoyer vos messages, je suis prêt à vous répondre! 💬";
                    } else if (userMessage.toLowerCase() === "gemini" || webhook_event.message.quick_reply?.payload === "GEMINI_SELECTED") {
                        activeConversations.set(sender_psid, "gemini");
                        response = "🎯 La commande Gemini est activée avec succès! ✨\n\n🌟 Vous pouvez:\n📝 M'envoyer un simple message\n🖼️ Ou m'envoyer une image et me poser ensuite votre question à son sujet!";
                    } else if (activeConversations.has(sender_psid)) {
                        // Utiliser la commande active précédemment sélectionnée
                        const activeCmd = activeConversations.get(sender_psid);
                        response = await commands[activeCmd].handleMessage(userMessage, attachments);
                    } else {
                        // Afficher les boutons pour choisir entre AI et Gemini
                        response = {
                            text: "Veuillez choisir le mode de conversation :",
                            quick_replies: [
                                {
                                    content_type: "text",
                                    title: "AI",
                                    payload: "AI_SELECTED"
                                },
                                {
                                    content_type: "text",
                                    title: "Gemini",
                                    payload: "GEMINI_SELECTED"
                                }
                            ]
                        };
                    }
                }
                
                if (Array.isArray(response)) {
                    for (const message of response) {
                        await sendMessage(sender_psid, message);
                    }
                } else {
                    await sendMessage(sender_psid, response);
                }
            }
        }
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

app.post('/save-tokens', (req, res) => {
    const { pageAccessToken: newPageToken, verifyToken: newVerifyToken } = req.body;
    pageAccessToken = newPageToken;
    verifyToken = newVerifyToken;
    res.json({ success: true });
});

async function sendMessage(sender_psid, response) {
    try {
        const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${pageAccessToken}`;
        const message = typeof response === 'string' ? { text: response } : response;
        await axios.post(url, {
            recipient: { id: sender_psid },
            message: message
        });
        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error.response?.data || error.message);
    }
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
