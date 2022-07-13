class Editor {
    constructor(filename) {
        let file_name = filename;

        this.validFileName = (name) => {
            const valid_chars = "abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVW1234567890_-".split('');
            return name.split('').length > 0 && name.split('').reduce((acc, e) => valid_chars.some(x => x === e) ? acc : false, true);
        };

        this.getFileName = () => {
            return file_name;
        };
    }

    async getInitialFile() {
        const res_files = await fetch('/userFiles', {
            method: 'GET'
        });

        const files = await res_files.json();
        console.log(files);
        if (files.includes(this.getFileName())) {
            return await this.fetchFiles();
        } else {
            await fetch('/updateMdFile', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({filename: this.getFileName(), text: ``})
            });

            return {md: '', html: ''};
        }
    }

    async updateFile(text) {
        await fetch('/updateMdFile', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({filename: this.getFileName(), text: text})
        });
    }

    async fetchFiles() {
        const md_file = await fetch(`/downloadFile?file=${this.getFileName()}`, {
            method: 'GET'
        });
        const html_file = await fetch(`/loadHTML?file=${this.getFileName()}`, {
            method: 'GET'
        });

        const md = await md_file.text();
        const html = await html_file.text();

        return {md: md, html: html};
    }
}

export default Editor;