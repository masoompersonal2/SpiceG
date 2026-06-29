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

    // Case sensitive replacements first
    content = content.replace(/Spice Garden/g, 'Crave');
    content = content.replace(/SPICE GARDEN/g, 'CRAVE');
    content = content.replace(/SpiceGarden/g, 'Crave');
    content = content.replace(/spicegardengokak/g, 'crave');
    content = content.replace(/spicegarden/gi, 'crave');
    content = content.replace(/SpiceG/g, 'Crave');
    content = content.replace(/SPICE/g, 'CRAVE');

    // Footer path replacement
    if (filePath.endsWith('Footer.tsx')) {
        content = content.replace(
            /d="M 20,80 Q 500,-20 980,80 L 920,400 L 80,400 Z"/g,
            'd="M 20,80 Q 500,-20 980,80 L 980,400 Q 500,300 20,400 Z"'
        );
    }

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
