class UploadRenderer {
    constructor() {
        let file_name = "test.somefile";

        this.setFileName = (name) => {
            file_name = "test.somefile";
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

export default UploadRenderer;