let user_name = 'NOT YET AUTHENTICATED';

// This will be used later to add
async function isAuthenticated() {
    let res = await fetch('/isAuthenticated', {
        method: 'GET',
    });
    let name = await fetch('/username', {
        method: 'GET',
    });
    name = await name.json();
    user_name = name.username;
    return res.status === 200;
}

async function handleLogin(username, password, init) {
    if (password === null || username === null) {
        alert("Bad password or username, try again.");
    } else {
        let res = await fetch(`/login?username=${username}&password=${password}`, {
            method: 'POST',
        });
        if (res.status === 200 && !res.redirected) {
            await init();
        } else {
            alert('There was an error logging you in, please try again.\nIf you just created an account, your credentials were registered successfully, so try to login.');
        }
    }
}

async function handleSignup(username, password, init) {
    if (password === null || username === null) {
        alert("Bad password or username, try again.");
    } else {
        let res = await fetch(`/register?username=${username}&password=${password}`, {
            method: 'POST',
        });
        if (res.status === 201) {
            await handleLogin(username, password, init);
        } else {
            alert("Account could not be created, try again.");
        }
    }
}

async function getAuthElement() {
     return `<p id="userName">Signed in as: ${user_name}</p><button id="settings-btn" class="orange-btn button">Settings</button>`;
}

function getPreviousFileElements() {
    return `<p>NOT YET IMPLEMENTED</p>`;
}

export default {isAuthenticated, getAuthElement, getPreviousFileElements, handleLogin, handleSignup};