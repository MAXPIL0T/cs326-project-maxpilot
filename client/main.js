import user from "./user.js";
import Editor from "./editor.js";
import UploadRenderer from "./uploadRenderer.js";

const app = document.getElementById('app');

async function initialRender() {
    if (await user.isAuthenticated()) {
        await renderHeader();
        let upload_btn = document.getElementById('upload');
        let editor_btn = document.getElementById('open-editor')

        upload_btn.addEventListener('click', () => renderFileUpload());
        editor_btn.addEventListener('click', () => renderFileEditor());
    } else {
        await renderHeader();
        let login_btn = document.getElementById('login');
        login_btn.addEventListener('click', async () => {
            let username = prompt("Enter your username");
            let password = prompt("Enter your password");
            if (password === null || username === null) {
                alert("Bad password or username, try again.");
            } else {
                let res = await fetch(`/login?username=${username}&password=${password}`, {
                    method: 'POST',
                });
            }
        })
    }
}

async function renderHeader() {
    app.innerHTML = `
        <div id="header">
            <button id="logo-btn">EZHtml.</Button>
            <div id="authentication">
                ${user.getAuthElement()}
            </div>
        </div>
        ${await getInitialLandingPage()}
    `;
    let settings_btn = document.getElementById('settings-btn');
    settings_btn.addEventListener('click', () => renderSettings());
    document.getElementById('logo-btn').addEventListener('click', () => initialRender());
}

async function getInitialLandingPage() {
    if (await user.isAuthenticated()) {
        return (`
            <div id="content">
                <h2 class="h2">Upload a File or Enter Text</h2>
                <div class="selectors">
                    <button class="blue-btn big-btn button" id="upload">Upload File</button>
                    <button class="blue-btn big-btn button" id="open-editor">Open Editor</button>
                </div>
                <h3 class="h3">Previous Files:</h3>
                <div class="selectors" style="margin-bottom: 10vh;">
                    ${user.getPreviousFileElements()}
                </div>
            </div>
        `);
    } else {
        return (`
            <div id="content">
                <h2 class="h2" style="padding-top: 15vh;">Please login or signup.</h2>
                <div class="selectors" style="padding-bottom: 30vh;">
                    <button class="orange-btn big-btn button" id="signup">Signup</button>
                    <button class="orange-btn big-btn button" id="login">Login</button>
                </div>
            </div>
        `);
    }
}

function renderFileUpload() {
    updateSessionPage('upload');
    let content = document.getElementById('content');
    const uploadRenderer = new UploadRenderer();
    
    content.innerHTML = `
        <div id="editor-settings">
            <h3 class="h3">${uploadRenderer.getFileName()}</h3>
            <button id="render" class="orange-btn button">Render</button>
        </div>
        <div id="editor">
            <div id="md-editor">
                <div id="md-editor-settings">
                    <button id="download-og" class="blue-btn button">DOWNLOAD ORIGINAL FILE</button>
                </div>
                <textarea name="md-editor-entry" id="md-editor" wrap="soft"></textarea>
            </div>
            <div id="md-rendered">
                <div id="md-editor-settings">
                    <button id="download-html" class="blue-btn button">DOWNLOAD HTML FILE</button>
                    <button id="full-screen" class="blue-btn button">FULL SCREEN</button>
                </div>
                <div id="md-rendered-content">
                    ${uploadRenderer.getRendered()}
                </div>
            </div>
        </div>
    `;

    document.getElementById('full-screen').addEventListener('click', () => {
        let viewer = document.createElement('div');
        viewer.id = 'settings';
        app.appendChild(viewer);
        viewer.innerHTML = `
        <div id="settings-child">
            <button class="blue-btn button" id="close-settings">Close</button>
            <div id="full-screen-preview">
                ${uploadRenderer.getRendered()}
            </div>
        </div>`;
        document.getElementById('close-settings').addEventListener('click', () => app.removeChild(viewer));

    });
}

function renderFileEditor() {
    updateSessionPage('editor');
    const editor = new Editor();
    let content = document.getElementById('content');

    content.innerHTML = `
        <form>
            <label for="file-name">Set a file name:</label>
            <input type="text" id="file-name">
            <input type="button" id="submit-file-name" class="blue-btn button" value="Continue">
        </form>
    `;

    document.getElementById("submit-file-name").addEventListener('click', () => {
        let file_entry = document.getElementById('file-name').value;
        if (editor.validFileName(file_entry)) {
            editor.setFileName(file_entry);
            enterEditor()
        } else {
            alert(`${file_entry} is not a valid fine name.\nFile names can only include letters, numbers, -, and _.`)
        }
    });

    function enterEditor() {
        content.innerHTML = `
            <div id="editor-settings">
                <h3 class="h3">${editor.getFileName()}</h3>
                <button id="render" class="orange-btn button">Render</button>
            </div>
            <div id="editor">
                <div id="md-editor">
                    <div id="md-editor-settings">
                        <button id="toggle-md" class="blue-btn button">MARKDOWN EDITOR</button>
                        <button id="toggle-html" class="blue-btn button">HTML EDITOR</button>
                    </div>
                    <textarea name="md-editor-entry" id="md-editor" wrap="soft"></textarea>
                </div>
                <div id="md-rendered">
                    <div id="md-editor-settings">
                        <button id="download" class="blue-btn button">DOWNLOAD HTML FILE</button>
                        <button id="full-screen" class="blue-btn button">FULL SCREEN</button>
                    </div>
                    <div id="md-rendered-content">
                        ${editor.getRendered()}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('full-screen').addEventListener('click', () => {
            let viewer = document.createElement('div');
            viewer.id = 'settings';
            app.appendChild(viewer);
            viewer.innerHTML = `
            <div id="settings-child">
                <button class="blue-btn button" id="close-settings">Close</button>
                <div id="full-screen-preview">
                    ${editor.getRendered()}
                </div>
            </div>`;
            document.getElementById('close-settings').addEventListener('click', () => app.removeChild(viewer));

        });
    }
}

function renderSettings() {
    let settings = document.createElement('div');
    settings.id = 'settings';
    app.appendChild(settings);
    settings.innerHTML = `
    <div id="settings-child">
        <button class="blue-btn button" id="close-settings">Close</button>
        <button class="orange-btn button" id="clear-browser-storage">Clear all browser storage</button>
    </div>`;
    document.getElementById('close-settings').addEventListener('click', () => app.removeChild(settings));
    document.getElementById('clear-browser-storage').addEventListener('click', () => {
        window.localStorage.clear();
        initialRender();
    });
}

function renderPage(page) {
    switch (page) {
        case 'editor': { renderFileEditor(); break; }
        case 'settings': {renderSettings(); break;}
        case 'upload': {
            renderFileUpload();
            break;
        }
    }
}

function updateSessionPage(cur_page) {
    if (window.localStorage.getItem('session') !== null) {
        let session = JSON.parse(window.localStorage.getItem('session'));
        session.page = cur_page;
        window.localStorage.setItem('session', JSON.stringify(session));
    } else {
        window.localStorage.setItem('session', JSON.stringify({page: cur_page}));
    }
}


await initialRender();

if (await user.isAuthenticated() && window.localStorage.getItem('session') !== null) {
    let last_session_page = JSON.parse(window.localStorage.getItem('session')).page;
    if (last_session_page !== undefined && confirm(`Do you want to return to the last session:\n${last_session_page}?`)) {
        renderPage(last_session_page);
    } else {
        console.log('nok');
    }
} else {
    window.localStorage.setItem('session', JSON.stringify({}));
}

