const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    content = content.replace(/"http:\/\/localhost:3000\/api([^"]*)"/g, '`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}$1`');
    content = content.replace(/'http:\/\/localhost:3000\/api([^']*)'/g, '`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}$1`');
    content = content.replace(/`http:\/\/localhost:3000\/api([^`]*)`/g, '`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}$1`');

    // specifically target image string interpolations
    content = content.split('http://localhost:3000${').join('${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(\'/api\', \'\')}${');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Updated: ' + file);
    }
});
