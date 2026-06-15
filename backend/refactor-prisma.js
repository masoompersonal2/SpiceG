const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

walkSync(dir, function(filePath) {
    if (filePath.endsWith('.ts') && !filePath.endsWith('prisma.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;
        
        if (content.includes('const prisma = new PrismaClient();')) {
            // Find depth to calculate relative path
            let relativePath = path.relative(path.dirname(filePath), path.join(dir, 'prisma'));
            relativePath = relativePath.replace(/\\/g, '/');
            if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
            }
            
            content = content.replace('const prisma = new PrismaClient();', `import { prisma } from '${relativePath}';`);
            changed = true;
        }
        
        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated', filePath);
        }
    }
});
