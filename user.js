let user_name = 'Gordon Ramsay';

// This will be used later to add
function isAuthenticated() {
    return true;
}

function getAuthElement() {
     return isAuthenticated() ? `<p id="userName">Signed in as: ${user_name}</p><button id="settings-btn" class="orange-btn">Settings</button>` : '';
}

function getPreviousFileElements() {
    return `<p>NOT YET IMPLEMENTED</p>`;
}

export default {isAuthenticated, getAuthElement, getPreviousFileElements};