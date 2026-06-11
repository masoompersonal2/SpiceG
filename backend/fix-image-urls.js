const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const frontendDir = path.join(__dirname, '..', 'frontend', 'src');
const files = walkSync(frontendDir);

let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Regex to match the bad pattern:
  // src={someVar.startsWith('/') && !someVar.startsWith('/uploads') ? someVar : `http://localhost:3000${someVar}`}
  // We want to replace it with:
  // src={someVar?.startsWith('http') ? someVar : (someVar?.startsWith('/') && !someVar?.startsWith('/uploads') ? someVar : `http://localhost:3000${someVar || ''}`)}

  content = content.replace(/([a-zA-Z0-9_?.]+)\.startsWith\('\/'\)\s*&&\s*!\1\.startsWith\('\/uploads'\)\s*\?\s*\1\s*:\s*`http:\/\/localhost:3000\$\{\1(\s*\|\|[^}]*)?\}`/g, 
    (match, p1, p2) => {
      // p1 is the variable name like siteData.about.aboutImage or item.image
      // We strip out trailing optional chaining for the check if present
      return `${p1}?.startsWith('http') ? ${p1} : (${p1}?.startsWith('/') && !${p1}?.startsWith('/uploads') ? ${p1} : \`http://localhost:3000\$\{${p1}${p2 || ''}\}\`)`;
    });

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    changedFiles++;
  }
});

console.log(`Done. Changed ${changedFiles} files.`);
