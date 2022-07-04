class Editor {
    constructor() {
        let file_name = null;

        this.validFileName = (name) => {
            const valid_chars = "abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVW1234567890_-".split('');
            return name.split('').length > 0 && name.split('').reduce((acc, e) => valid_chars.some(x => x === e) ? acc : false, true);
        };

        this.setFileName = (name) => {
            file_name = name + '.md';
        };

        this.getFileName = () => {
            return file_name;
        };

        this.getRendered = () => {
            return (`
                <img src="https://cdn.pixabay.com/photo/2014/12/28/13/20/wordpress-581849_960_720.jpg">
                <h2>this is a h2 that is very long.</h2>
                <h2>this is a h2 that is very long.</h2>
                <h2>this is a h2 that is very long.</h2>
                <h2>this is a h2 that is very long.</h2>
                <h2>this is a h2 that is very long.</h2>

                <h2>this is a h2 that is very long.</h2>
                <h2>this is a h2 that is very long.</h2>
                <h2>this is a h2 that is very long.</h2>

                <h2>this is a h2 that is very long.</h2>
                <h2>this is a h2 that is very long.</h2>
            `);
        }
    }
}

export default Editor;