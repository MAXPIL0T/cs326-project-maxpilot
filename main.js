import user from "./user.js"

const app = document.getElementById('app');
let activeElements = [];

function initialRender() {
    if (user.isAuthenticated()) {
        getInitialLandingPage()
        renderHeader()
        let upload_btn = document.getElementById('upload');
        let editor_btn = document.getElementById('open-editor')

        activeElements.push(upload_btn);
        activeElements.push(editor_btn);

        upload_btn.addEventListener('click', () => renderFileUpload());
        editor_btn.addEventListener('click', () => renderFileEditor());
    } else {
        renderHeader()
    }
}

function renderHeader() {
    app.innerHTML = `
        <div id="header">
            <a href="./"><h1 id="title">EZHtml.</h1></a>
            <!-- <h1 id="title">EZHtml.</h1> -->
            <div id="authentication">
                ${user.getAuthElement()}
            </div>
        </div>
        ${getInitialLandingPage()}
    `;

    let settings_btn = document.getElementById('settings-btn');
    activeElements.push(settings_btn);
    settings_btn.addEventListener('click', () => renderSettings());
}

function getInitialLandingPage() {
    if (user.isAuthenticated()) {
        return (`
            <div id="content">
                <h2>Upload a File or Enter Text</h2>
                <div class="selectors">
                    <button class="blue-btn big-btn" id="upload">Upload File</button>
                    <button class="blue-btn big-btn" id="open-editor">Open Editor</button>
                </div>
                <h3>Previous Files:</h3>
                <div class="selectors" style="margin-bottom: 10vh;">
                    ${user.getPreviousFileElements()}
                </div>
            </div>
        `);
    } else {
        return (`
            <div id="content">
                <h2 style="padding-top: 15vh;">Please login or signup.</h2>
                <div class="selectors" style="padding-bottom: 30vh;">
                    <button class="orange-btn big-btn" id="signup">Signup</button><button class="orange-btn big-btn" id="login">Login</button>
                </div>
            </div>
        `);
    }
}

function renderFileUpload() {
    let content = document.getElementById('content');
    content.innerHTML = "<h2>NOT YET IMPLEMENTED</h2>"
}

function renderFileEditor() {
    let content = document.getElementById('content');
    content.innerHTML = "<h2>NOT YET IMPLEMENTED</h2>"
}

function renderSettings() {
    let settings = document.createElement('div');
    settings.id = 'settings';
    app.appendChild(settings);
    settings.innerHTML = `
    <div id="settings-child">
        <p>NOT YET IMPLEMENTED</p>
        <button class="blue-btn" id="close-settings">Close</button>
    </div>`
    ;
    document.getElementById('close-settings').addEventListener('click', () => app.removeChild(settings));
}

initialRender()
