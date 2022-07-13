import showdown from 'showdown'; // https://www.npmjs.com/package/showdown
import docx_converter from 'mammoth'; // https://www.npmjs.com/package/pammoth
import odt_converter from 'odt2html'; // https://www.npmjs.com/package/odt2html
import img_converter from 'image-data-uri'; // https://www.npmjs.com/package/image-data-uri
import fs from 'fs';

const md_converter = new showdown.Converter();
md_converter.setOption('noHeaderId', true);

async function convert(path, type) {
    switch (type) {
        case '.md': 
            return markdown(path);
        case '.docx':
            return await docx(path);
        case '.odt':
            return await odt(path);
        case '.PNG':
        case '.png':
        case '.jpg':
        case '.jpeg':
             return await img(path);
        case '.html':
            return fs.readFileSync(path, {encoding: 'utf-8'});
        default: return -1;
    }
}

function markdown(path) {
    const data = fs.readFileSync(path, {encoding: 'utf-8'});
    try {
        let html = md_converter.makeHtml(data);
        return html;
    } catch (err) {
        console.log("Error: ", error);
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
        return html;
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

export default convert;