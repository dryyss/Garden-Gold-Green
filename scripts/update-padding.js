const fs = require('fs');
const path = require('path');

function updatePaddingInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updated = content.replace(/pt-24/g, 'pt-36');
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf-8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walkDir(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Parcourir src/app
const appDir = path.join(__dirname, '../src/app');
const files = walkDir(appDir);

console.log(`🔍 Found ${files.length} TypeScript files`);

let updatedCount = 0;
for (const file of files) {
  if (updatePaddingInFile(file)) {
    updatedCount++;
  }
}

console.log(`\n✨ Updated ${updatedCount} files (pt-24 → pt-36)`);

const path = require('path');

function updatePaddingInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updated = content.replace(/pt-24/g, 'pt-36');
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf-8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walkDir(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Parcourir src/app
const appDir = path.join(__dirname, '../src/app');
const files = walkDir(appDir);

console.log(`🔍 Found ${files.length} TypeScript files`);

let updatedCount = 0;
for (const file of files) {
  if (updatePaddingInFile(file)) {
    updatedCount++;
  }
}

console.log(`\n✨ Updated ${updatedCount} files (pt-24 → pt-36)`);

