
const fs = require('fs');
const path = require('path');

const COMMANDS_PER_PAGE = 10;

class HelpManager {
    constructor() {
        this.commands = [];
        this.currentPage = 1;
        this.loadCommands();
    }

    loadCommands() {
        const cmdsDir = path.join(__dirname);
        this.commands = fs.readdirSync(cmdsDir)
            .filter(file => file.endsWith('.js'))
            .map(file => path.basename(file, '.js'));
        this.totalPages = Math.ceil(this.commands.length / COMMANDS_PER_PAGE);
    }

    getPageCommands(page) {
        const start = (page - 1) * COMMANDS_PER_PAGE;
        return this.commands.slice(start, start + COMMANDS_PER_PAGE);
    }

    formatResponse(page) {
        const pageCommands = this.getPageCommands(page);
        let response = `📌 Liste des commandes (${page}/${this.totalPages}):\n\n`;
        
        pageCommands.forEach((cmd, index) => {
            response += `${(page-1)*COMMANDS_PER_PAGE + index + 1}- ${cmd}\n\n`;
        });

        response += `\n📑 Navigation:
- Tapez help + un numéro pour aller à cette page
- Tapez 'next' ou '>' pour la page suivante
- Tapez 'prev' ou '<' pour la page précédente
- Tapez 'exit' ou 'q' pour quitter l'aide`;

        return response;
    }

    handleNavigation(input) {
        input = input.toLowerCase().trim();
        
        if (input === 'next' || input === '>') {
            this.currentPage = Math.min(this.currentPage + 1, this.totalPages);
        } else if (input === 'prev' || input === '<') {
            this.currentPage = Math.max(this.currentPage - 1, 1);
        } else if (input === 'exit' || input === 'q') {
            return 'Au revoir! Tapez "help" pour revoir la liste des commandes.';
        } else {
            const pageNum = parseInt(input);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= this.totalPages) {
                this.currentPage = pageNum;
            }
        }
        
        return this.formatResponse(this.currentPage);
    }
}

const helpManager = new HelpManager();

async function handleMessage(message) {
    if (!message) {
        return helpManager.formatResponse(1);
    }
    return helpManager.handleNavigation(message);
}

module.exports = { handleMessage };
