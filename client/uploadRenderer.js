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
        const text = await html.text();
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
}

export default UploadRenderer;