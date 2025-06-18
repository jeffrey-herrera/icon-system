import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, '../public/icons');

// Colors that should be replaced with currentColor
const HARDCODED_COLORS = [
  '#801ED7', // Braze purple
  '#5710E5', // Braze action purple
  '#000000', // Black
  '#000',    // Black (short form)
];

function fixIconFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace hardcoded colors with currentColor for both stroke and fill
    HARDCODED_COLORS.forEach(color => {
      // Fix stroke attributes
      const strokeRegex = new RegExp(`stroke="${color}"`, 'g');
      if (content.includes(`stroke="${color}"`)) {
        content = content.replace(strokeRegex, 'stroke="currentColor"');
        modified = true;
      }
      
      // Fix fill attributes
      const fillRegex = new RegExp(`fill="${color}"`, 'g');
      if (content.includes(`fill="${color}"`)) {
        content = content.replace(fillRegex, 'fill="currentColor"');
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath, relativePath = '') {
  const items = fs.readdirSync(dirPath);
  let results = { fixed: 0, total: 0, files: [] };
  
  items.forEach(item => {
    if (item.startsWith('.')) return; // Skip hidden files
    
    const itemPath = path.join(dirPath, item);
    const relativeItemPath = path.join(relativePath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subResults = processDirectory(itemPath, relativeItemPath);
      results.fixed += subResults.fixed;
      results.total += subResults.total;
      results.files.push(...subResults.files);
    } else if (item.endsWith('.svg')) {
      results.total++;
      if (fixIconFile(itemPath)) {
        results.fixed++;
        results.files.push(relativeItemPath);
        console.log(`✅ Fixed: ${relativeItemPath}`);
      }
    }
  });
  
  return results;
}

function fixAllIcons() {
  console.log('🔧 Fixing hardcoded colors in all icon files...\n');
  console.log(`📁 Scanning directory: ${ICONS_DIR}\n`);
  
  if (!fs.existsSync(ICONS_DIR)) {
    console.error(`❌ Icons directory not found: ${ICONS_DIR}`);
    process.exit(1);
  }
  
  const results = processDirectory(ICONS_DIR);
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total SVG files processed: ${results.total}`);
  console.log(`   Files fixed: ${results.fixed}`);
  console.log(`   Files already correct: ${results.total - results.fixed}`);
  
  if (results.fixed > 0) {
    console.log(`\n📝 Fixed files:`);
    results.files.forEach(file => console.log(`   • ${file}`));
    
    console.log('\n✨ Icons have been fixed! Container colors should now work properly.');
    console.log('💡 Restart your development server to see the changes.');
    console.log('\n🎯 Next time you add icons from Figma, just run: npm run fix-icons');
  } else {
    console.log('\n🎉 All icons are already using currentColor - no fixes needed!');
  }
  
  console.log(`\n💡 Pro tip: When exporting from Figma, try to use "Current Color" or remove`);
  console.log(`   fill/stroke colors to avoid hardcoded colors in the first place.`);
}

// Run the fix
fixAllIcons(); 