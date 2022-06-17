const fs = require('fs');

fs.readFile("./test.md", 'utf8', (error, data) => {
    if (error) {
        console.log(error);
    }
    let html = convert(data);
    console.log(html);
});

function convert(data) {
    // Code Blocks first

    // Take care of h1 tags
    let to_process = data.split('\r\n').map(i => i.split('#'));
    let processed = to_process.map(i => i.split('#'));
    
}