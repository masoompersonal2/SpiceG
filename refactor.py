import os, glob, re

path = 'd:/00 ProjectsOnline/SpiceGarden/frontend/src/pages/admin/*.tsx'
files = glob.glob(path)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove early return checks for adminToken
    content = re.sub(r'if\s*\(!localStorage\.getItem\([\'"]adminToken[\'"]\)\)\s*\{[^\}]+\}', '', content)
    
    # Remove: const token = localStorage.getItem('adminToken');
    content = re.sub(r'const\s+token\s*=\s*localStorage\.getItem\([\'"]adminToken[\'"]\);?\n?', '', content)
    
    # Remove Authorization header
    content = re.sub(r'[\'"`]Authorization[\'"`]\s*:\s*`Bearer \$\{token\}`\s*,?', '', content)
    content = re.sub(r'[\'"`]Authorization[\'"`]\s*:\s*`Bearer \$\{localStorage\.getItem\([\'"]adminToken[\'"]\)\}`\s*,?', '', content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed {file}")
