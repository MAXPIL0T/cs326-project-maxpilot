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
            method: 'POST',
        });
        return await html.json();
    };
}

export default UploadRenderer;