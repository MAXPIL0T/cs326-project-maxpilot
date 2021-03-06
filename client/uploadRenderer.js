class UploadRenderer {
    constructor(filename) {
        let file_name = filename;

        this.setFileName = (name) => {
            file_name = name;
        };

        this.getFileName = () => {
            return file_name;
        };
    }

    async getHtml() {
        const html = await fetch(`/loadHTML?file=${this.getFileName()}`, {
            method: 'GET',
        });
        let text = await html.text();
        text = text.replace('\n', '<br>');
        return text;
    }

    downloadFile(text) {
        let filename = `${this.getFileName().split('.')[0]}.html`;
        const element = document.createElement('a');
        element.setAttribute('href', URL.createObjectURL(new Blob([text], { type: 'text/html' })));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    async downloadOriginalFile() {
        let filename = this.getFileName();
        const element = document.createElement('a');
        element.setAttribute('href', `./downloadFile?file=${filename}`);
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}

export default UploadRenderer;
