const fs = require('fs');
const path = require('path');

const dirs = [
    path.join(__dirname, 'frontend'),
    path.join(__dirname, 'backend'),
    path.join(__dirname, 'Static')
];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/Spice Garrden/gi, 'Crave');
    content = content.replace(/spice garden/gi, 'Crave');
    content = content.replace(/Spice Garden/gi, 'Crave');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fullPath.includes('node_modules') || fullPath.includes('.git') || fullPath.includes('dist')) continue;
        
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(fullPath);
            if (['.tsx', '.ts', '.html', '.js', '.css', '.env', '.json', '.prisma'].includes(ext)) {
                replaceInFile(fullPath);
            }
        }
    }
}

dirs.forEach(walkDir);
console.log('Done');
