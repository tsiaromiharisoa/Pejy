
// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});

function saveTokens() {
    const pageAccessToken = document.getElementById('pageAccessToken').value;
    const verifyToken = document.getElementById('verifyToken').value;

    fetch('/save-tokens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pageAccessToken, verifyToken })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('messages').innerHTML = 
            `<p style="color: green">Configuration saved successfully!</p>`;
        // Clear input fields
        document.getElementById('pageAccessToken').value = '';
        document.getElementById('verifyToken').value = '';
    })
    .catch(error => {
        document.getElementById('messages').innerHTML = 
            `<p style="color: red">Error saving configuration: ${error}</p>`;
    });
}
