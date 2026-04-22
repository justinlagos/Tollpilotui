import fs from 'fs';
import path from 'path';

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let changedFiles = 0;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      changedFiles += processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Replace: border: `1px solid ${t.border}`
      // with: borderWidth: 1, borderStyle: 'solid', borderColor: t.border
      
      // Let's handle different border variations in inline styles:
      // border: 'none' -> borderWidth: 0
      content = content.replace(/border:\s*['"]none['"]/g, "borderWidth: 0");
      
      // border: `1px solid ${something}`
      content = content.replace(/border:\s*`(\d+)px\s+(solid|dashed|dotted)\s+\$\{([^}]+)\}`/g, "borderWidth: $1, borderStyle: '$2', borderColor: $3");
      
      // border: `2px solid ${something}`
      content = content.replace(/border:\s*`(\d+)px\s+(solid|dashed|dotted)\s+\$\{([^}]+)\}22`/g, "borderWidth: $1, borderStyle: '$2', borderColor: `${$3}22`");
      
      // border: `1px solid ${t.success}44`
      content = content.replace(/border:\s*`(\d+)px\s+(solid|dashed|dotted)\s+\$\{([^}]+)\}([a-fA-F0-9]{2})`/g, "borderWidth: $1, borderStyle: '$2', borderColor: `${$3}$4`");
      
      // border: '1px solid rgba(...)'
      content = content.replace(/border:\s*['"](\d+)px\s+(solid|dashed|dotted)\s+([^'"]+)['"]/g, "borderWidth: $1, borderStyle: '$2', borderColor: '$3'");

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        changedFiles++;
        console.log('Fixed', fullPath);
      }
    }
  }
  return changedFiles;
}

const targetDir = path.resolve('../src/app/components/screens');
const count = processDirectory(targetDir);
console.log(`Changed ${count} files.`);
