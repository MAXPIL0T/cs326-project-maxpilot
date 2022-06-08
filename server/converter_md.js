const fs = require('fs');

fs.readFile("./test.md", 'utf8', (error, data) => {
    if (error) {
        console.log(error);
    }
    let html = convert(data);
    console.log(html);
});

