const fs = require('fs');
const { arrayBuffer } = require('stream/consumers');

fs.readFile("./test.md", 'utf8', (error, data) => {
    if (error) {
        console.log(error);
    }
    let html = convert(data);
    console.log(html);
});

// convert(data: String) => html: String
function convert(data) {
    let data_arr = data.split('\n');
    let ret_html = '';
    let indent = 0;
    let code_block = false;
    let list_type = [];

    data_arr.forEach((line, i) => {
        
    });
}