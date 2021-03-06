import user from "./user.js";
import Editor from "./editor.js";
import UploadRenderer from "./uploadRenderer.js";

const app = document.getElementById('app');

async function initialRender() {
    if (await user.isAuthenticated()) {
        await renderHeader();
        let upload_btn = document.getElementById('upload');
        let editor_btn = document.getElementById('open-editor')

        editor_btn.addEventListener('click', async () => {
            const filename = prompt('Enter a new file name without extension.');
            const valid_chars = "abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVW1234567890_-".split('');
            if (filename && filename.split('').length > 0 && filename.split('').reduce((acc, e) => valid_chars.some(x => x === e) ? acc : false, true)) {
                await renderFileEditor(`${filename}.md`);
            } else {
                alert('Invalid file name.')
            }
        });
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
    if (await user.isAuthenticated()) {
        let settings_btn = document.getElementById('settings-btn');
        settings_btn.addEventListener('click', () => renderSettings());
    }
    document.getElementById('logo-btn').addEventListener('click', () => initialRender());

    if (await user.isAuthenticated()) {
        let files = await user.getFileNames();
        files.forEach((file, i) => {
            let ext = file.split('.');
            ext = ext[ext.length - 1];
            if (ext === 'md') {
                document.getElementById(`sel-btn-${i}`).addEventListener('click', () => {
                    renderFileUpload(file);
                });
            } else {
                document.getElementById(`sel-btn-${i}`).addEventListener('click', () => {
                    renderFileUpload(file);
                });
            }
        });

        document.getElementById('delete-file').addEventListener('click', async () => {
            let file = prompt('Enter the full name of the file you wish to delete, including the extension.');
            if (file) {
                await fetch(`/deleteFile?file=${file}`, {
                    method: 'POST'
                });
                initialRender();
            }
        })
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
                <div style="display: flex; flex-direction: row; align-items: center;">
                    <h3 class="h3">Previous Files:</h3>
                    <button id="delete-file" class="orange-btn button">DELETE A FILE</button>
                </div>
                <div class="selectors" style="margin-bottom: 10vh;">
                    ${await user.getPreviousFileElements()}
                </div>
            </div>
        `);
    } else {
        return (`
            <div id="content">
                <h2 class="h2" style="display: flex; padding-top: 15vh; justify-content: center;">Please login or signup.</h2>
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
        <h3 class="h3">Please select a file for upload.<br>Acceptable files are .docx, .md, .html, .odt, .png, .jpg, and .jpeg.<br>Large Images and files will not be opened in the editor, their HTML will be downloaded directly.<br>Do not upload a file with a name that you have uploaded before.<br>Files will appear under Previous Files after you upload</h3>
        <form ref='uploadForm' 
            id='uploadForm' 
            action='/uploadFile'
            method='post' 
            encType="multipart/form-data">
            <input type="file" name="upload" id="file_path_input" class="blue-btn button" accept=".odt, .docx, .md, .png, .jpeg, .jpg, .html"/>
            <input type='submit' value='Upload!' class="orange-btn button"/>
        </form>
    `;
}

async function renderFileUpload(file_name) {
    let content = document.getElementById('content');
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
                        ${uploadRenderer.getFileName().split('.')[uploadRenderer.getFileName().split('.').length - 1] === 'md' ? `<button id="toggle-md" class="blue-btn button">MARKDOWN EDITOR</button>` : ''}
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
        document.getElementById('md-rendered-content').src += 'about:blank';
        document.getElementById(`md-rendered-content`).contentWindow.document.write(`<html><body>${document.getElementById('md-editor-entry').value}</body></html>`);
    });

    document.getElementById('download-html').addEventListener('click', () => {
        uploadRenderer.downloadFile(document.getElementById('md-editor-entry').value);
    });

    document.getElementById('download-og').addEventListener('click', async () => {
        await uploadRenderer.downloadOriginalFile();
    });

    if (uploadRenderer.getFileName().split('.')[uploadRenderer.getFileName().split('.').length - 1] === 'md') {
        document.getElementById('toggle-md').addEventListener('click', async () => {
            await renderFileEditor(uploadRenderer.getFileName());
        });
    }

    const text = await uploadRenderer.getHtml();

    if (text.length < 175000) {
        document.getElementById('md-editor-entry').innerText = text;
        document.getElementById(`md-rendered-content`).contentWindow.document.write(`<html><body>${document.getElementById('md-editor-entry').value}</body></html>`);
    } else {
        uploadRenderer.downloadFile(text);
        initialRender();
    }
}

async function renderFileEditor(filename) {
    const editor = new Editor(filename);
    let content = document.getElementById('content');
    content.innerHTML = `
        <div id="editor-settings">
            <h3 class="h3">${editor.getFileName()}</h3>
            <button id="render" class="orange-btn button">Render and Save</button>
        </div>
        <div id="editor">
            <div id="md-editor">
                <div id="md-editor-settings">
                    <button id="download-og" class="blue-btn button">DOWNLOAD MARKDOWN FILE</button>
                    <button id="toggle-html" class="blue-btn button">HTML EDITOR</button>
                </div>
                <textarea name="md-editor-entry" id="md-editor-entry" wrap="soft"></textarea>
            </div>
            <div id="md-rendered">
                <div id="md-editor-settings">
                    <button id="download-html" class="blue-btn button">DOWNLOAD HTML FILE</button>
                    <button id="full-screen" class="blue-btn button">FULL SCREEN</button>
                </div>
                <iframe id="md-rendered-content">
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
        document.getElementById('full-screen-preview').contentWindow.document.write(`<html><body>${init.html}</body></html>`);
        document.getElementById('close-settings').addEventListener('click', () => app.removeChild(viewer));
    });

    document.getElementById('render').addEventListener('click', async () => {
        document.getElementById('md-rendered-content').src += 'about:blank';
        await editor.updateFile(document.getElementById('md-editor-entry').value);
        init = await editor.fetchFiles();
        document.getElementById('md-editor-entry').innerText = init.md;
        document.getElementById('md-rendered-content').contentWindow.document.write(`<html><body>${init.html}</body></html>`);
    });

    document.getElementById('download-og').addEventListener('click', async () => {
        await editor.downloadOriginalFile();
    });

    document.getElementById('download-html').addEventListener('click', () => {
        editor.downloadFile(init.html);
    });

    document.getElementById('toggle-html').addEventListener('click', async () => {
            await renderFileUpload(editor.getFileName());
        
    });

    let init = await editor.getInitialFile();
    document.getElementById('md-editor-entry').innerText = init.md;
    document.getElementById('md-rendered-content').contentWindow.document.write(`<html><body>${init.html}</body></html>`);
}

function renderSettings() {
    let settings = document.createElement('div');
    settings.id = 'settings';
    app.appendChild(settings);
    settings.innerHTML = `
    <div id="settings-child">
        <button class="blue-btn button" id="close-settings">Close</button>
        <button class="orange-btn button" id="logout">Logout</button>
        <h3 class="h3">Thank you for using the site.</h3><br>
        <p>This project was created as part of UMASS CS326 - Web Development by Maximilian Kuechen.</p><br>
        <p>The following NPM extensions were used among others:</p>
        <ul>
            <li>express</li>
            <li>express-fileuplaod</li>
            <li>passport</li>
            <li><a href="https://www.npmjs.com/package/showdown">showdown</a></li>
            <li><a href="https://www.npmjs.com/package/pammoth">pammoth</a></li>
            <li><a href="https://www.npmjs.com/package/odt2html">odt2html</a></li>
            <li><a href="https://www.npmjs.com/package/image-data-uri">image-data-uri</a></li>
        </ul><br>
        <p>For a full list see the github repo:</p>
        <a href="https://github.com/MAXPIL0T/cs326-project-maxpilot" target="_blank">Github</a><br>
        <a href="https://www.maxkuechen.com/" target="_blank">www.maxkuechen.com</a>
        <p>Copyright &copy; 2022 Maximilian Kuechen</p>
    </div>`;

    document.getElementById('close-settings').addEventListener('click', () => app.removeChild(settings));

    document.getElementById('logout').addEventListener('click', async () => {
        await fetch('/logout', {
            method: 'GET',
        });
        await initialRender();
    })
}

await initialRender();