import user from "./user.js";
import Editor from "./editor.js";
import UploadRenderer from "./uploadRenderer.js";

const app = document.getElementById('app');

const openFile = file => {
    console.log(file)
}

async function initialRender() {
    if (await user.isAuthenticated()) {
        await renderHeader();
        let upload_btn = document.getElementById('upload');
        let editor_btn = document.getElementById('open-editor')

        editor_btn.addEventListener('click', async () => await renderFileEditor());
        upload_btn.addEventListener('click', () => uploadFile());
    } else {
        await renderHeader();
        let login_btn = document.getElementById('login');
        let signup_btn = document.getElementById('signup');

        login_btn.addEventListener('click', async () => {
            let username = prompt("Enter your username");
            let password = prompt("Enter your password");
            await user.handleLogin(username, password, initialRender);
        });
        signup_btn.addEventListener('click', async () => {
            let username = prompt("Enter the username you want");
            let password = prompt("Enter the password you want");
            await user.handleSignup(username, password, initialRender);
        });
    }
}

async function renderHeader() {
    app.innerHTML = `
        <div id="header">
            <button id="logo-btn">EZHtml.</Button>
            <div id="authentication">
                ${await user.getAuthElement()}
            </div>
        </div>
        ${await getInitialLandingPage()}
    `;
    let settings_btn = document.getElementById('settings-btn');
    settings_btn.addEventListener('click', () => renderSettings());
    document.getElementById('logo-btn').addEventListener('click', () => initialRender());

    if (await user.isAuthenticated()) {
        let files = await user.getFileNames();
        files.forEach((file, i) => {
            document.getElementById(`sel-btn-${i}`).addEventListener('click', () => {
                renderFileUpload(file);
            });
        });
    } 
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
                    ${await user.getPreviousFileElements()}
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

async function uploadFile() {
    let content = document.getElementById('content');

    content.innerHTML = `
        <form ref='uploadForm' 
            id='uploadForm' 
            action='/uploadFile' 
            method='post' 
            encType="multipart/form-data">
            <input type="file" name="upload" id="file_path_input" />
            <input type='submit' value='Upload!' />
        </form>
    `;

    // document.getElementById('uploadForm').addEventListener('submit', async event => {
    //     event.preventDefault();
    //     let file_name = document.getElementById('file_path_input').value;
    //     await renderFileUpload(file_name);
    // });
}

async function renderFileUpload(file_name) {
    let content = document.getElementById('content');
    updateSessionPage('upload'); 
    const uploadRenderer = new UploadRenderer;
    uploadRenderer.setFileName(file_name);

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
                <textarea name="md-editor-entry" id="md-editor-entry" wrap="soft"></textarea>
            </div>
            <div id="md-rendered">
                <div id="md-editor-settings">
                    <button id="download-html" class="blue-btn button">DOWNLOAD HTML FILE</button>
                    <button id="full-screen" class="blue-btn button">FULL SCREEN</button>
                </div>
                <iframe id="md-rendered-content" >
                </iframe>
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
            <iframe id="full-screen-preview">
            </iframe>
        </div>`;
        document.getElementById('full-screen-preview').contentWindow.document.write(`<html><body>${document.getElementById('md-editor-entry').value}</body></html>`);
        document.getElementById('close-settings').addEventListener('click', () => app.removeChild(viewer));
    });

    document.getElementById('render').addEventListener('click', () => {
        document.getElementById(`md-rendered-content`).contentWindow.document.write(`<html><body>${document.getElementById('md-editor-entry').value}</body></html>`);
    });

    document.getElementById('md-editor-entry').innerText = await uploadRenderer.getHtml();
    document.getElementById(`md-rendered-content`).contentWindow.document.write(`<html><body>${document.getElementById('md-editor-entry').value}</body></html>`);
}

function renderFileEditor() {
    updateSessionPage('editor');
    const editor = new Editor();
    let content = document.getElementById('content');

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
        <button class="orange-btn button" id="logout">Logout</button>
    </div>`;
    document.getElementById('close-settings').addEventListener('click', () => app.removeChild(settings));
    document.getElementById('clear-browser-storage').addEventListener('click', () => {
        window.localStorage.clear();
        initialRender();
    });
    document.getElementById('logout').addEventListener('click', async () => {
        await fetch('/logout', {
            method: 'GET',
        });
        await initialRender();
    })
}

async function renderPage(page) {
    switch (page) {
        case 'editor': { renderFileEditor(); break; }
        case 'settings': {renderSettings(); break;}
        case 'upload': {
            await uploadFile();
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
        await renderPage(last_session_page);
    } else {
        console.log('nok');
    }
} else {
    window.localStorage.setItem('session', JSON.stringify({}));
}

