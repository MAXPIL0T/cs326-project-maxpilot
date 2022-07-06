let user_name = 'Gordon Ramsay';

// This will be used later to add
async function isAuthenticated() {
    let res = await fetch('/isAuthenticated', {
        method: 'GET',
    });
    return res.status === 200;
}

function getAuthElement() {
     return isAuthenticated() ? `<p id="userName">Signed in as: ${user_name}</p><button id="settings-btn" class="orange-btn button">Settings</button>` : '';
}

function getPreviousFileElements() {
    return `<p>NOT YET IMPLEMENTED</p>`;
}

export default {isAuthenticated, getAuthElement, getPreviousFileElements};