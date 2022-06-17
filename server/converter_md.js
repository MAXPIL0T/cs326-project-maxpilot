const fs = require('fs');

fs.readFile("./test.md", 'utf8', (error, data) => {
    if (error) {
        console.log(error);
    }
    let html = convert(data);
    console.log(html);
});

// convert(data: String) => html: String
function convert(data) {
    let data_arr = data.split('\r\n');
    console.log(data_arr)
    let ret_html = '';
    let indent = 0;
    let code_block = false;
    let list_type = [];
    let to_close = [];

    data_arr.forEach((line, i) => {
        let line_arr = line.split('');
        let to_close = [];
        switch (line_arr) {
            case line_arr[0] === '#': { 
                let count = 0;
                for (let i = 0; i < 5; ++i) { if (line_arr[i] !== '#') { count = i; break; }}
                ret_html += `<h${count}>`;
                to_close.push(`</h${count}>`);
                ret_html += parseLine(line_arr, count + 1);
                while (to_close.length !== 0) { ret_html += to_close.pop(); }
                break;
            }
            case line_arr.length >= 3 && line_arr[0] === '`' && line_arr[2] === '`' && line_arr[2] === '`': {
                if (to_close.includes('```')) { ret_html.push('</code>'); to_close.filter(i => i !== '```'); break; }
                let flag = false;
                for (let k = i + 1; k < data_arr.length; ++ k) {
                    let temp = data_arr[k].split('');
                    if (temp.length >= 3 && temp[0] === '`' && temp[2] === '`' && temp[2]) { flag = true; break; }
                }
                if (flag) {
                    
                }
            }
            default: { ret_html += parseLine(line_arr, 0); }
            ret_html += '\n';
        }
    });

    return ret_html;
}

function parseLine(line_arr, start) {
    console.log(line_arr)

    let to_close = [];
    let ret = '';
    let skip_iter = 0;

    for (let i = start; i < line_arr.length; ++i) {
        let cur_char = line_arr[i];
        if (i !== line_arr.length - 1 && cur_char === '*' && line_arr[i + 1] !== '*' && !to_close.includes('*')) {
            ret += '<i>';
            to_close.push('*');
        } else if ((i !== line_arr.length - 1 && cur_char === '*' && line_arr[i + 1] !== '*') || cur_char === '*') {
            to_close = to_close.filter(i => i !== '*');
            ret += '</i>';
        } else {
            ret += cur_char;
        }
    }
    
    return ret;
}