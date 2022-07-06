import showdown from 'showdown'; // https://www.npmjs.com/package/showdown
import docx_converter from 'mammoth'; // https://www.npmjs.com/package/pammoth
import odt_converter from 'odt2html'; // https://www.npmjs.com/package/odt2html
import img_converter from 'image-data-uri'; // https://www.npmjs.com/package/image-data-uri

const md_converter = new showdown.Converter();
md_converter.setOption('noHeaderId', true);

export async function convert(path, type) {
    switch (type) {
        case 'md': 
            return markdown(path);
        case 'docx':
            return await docx(path);
        case 'odt':
            return await odt(path);
        case 'img':
             return await img(path);
        default: return -1;
    }
}

function markdown(file) {
    try {
        let html =  md_converter.makeHtml(file);
        return html;
    } catch (err) {
        console.log(error);
        return -1;
    }
}

async function docx(path) {
    try {
        let html = await docx_converter.convertToHtml({path: path});
        return html.value;
    } catch (err) {
        console.log(err);
        return -1;
    }
}

async function odt(path) {
    try {
        let html = await odt_converter.toHTML({path: path});
        console.log(html);
    } catch (err) {
        console.log(err);
        return -1;
    }
}

async function img(path) {
    try {
        let encoded = await img_converter.encodeFromFile(path);
        let html_str = `<img src="${encoded}" alt="ADD AN ALT">`;
        return html_str;
    } catch (err) {
        console.log(err);
        return -1;
    }
}