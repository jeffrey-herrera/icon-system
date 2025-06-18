import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { IconData, IconStyle } from './iconLoader';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ICONS_DIR = path.join(__dirname, '../../public/icons');

// Comprehensive icon tagging system
function generateIconTags(baseName: string, category: string, style: string): string[] {
  const tags = new Set<string>();
  
  // Add base name components
  const nameWords = baseName.toLowerCase().split('-');
  nameWords.forEach(word => tags.add(word));
  
  // Add category
  tags.add(category.toLowerCase());
  tags.add(style);
  
  // Icon-specific synonyms and related terms
  const iconSynonyms: Record<string, string[]> = {
    // General/UI
    'activity': ['action', 'movement', 'exercise', 'fitness', 'workout', 'health'],
    'add': ['plus', 'create', 'new', 'insert', 'append'],
    'alert': ['warning', 'notification', 'danger', 'caution', 'notice'],
    'archive': ['storage', 'backup', 'save', 'store', 'folder'],
    'arrow': ['direction', 'pointer', 'navigation', 'move'],
    'attach': ['clip', 'paperclip', 'attachment', 'file'],
    'bell': ['notification', 'alert', 'reminder', 'sound'],
    'bookmark': ['save', 'favorite', 'mark', 'remember'],
    'calendar': ['date', 'schedule', 'time', 'event', 'appointment'],
    'camera': ['photo', 'picture', 'image', 'capture', 'snapshot'],
    'chart': ['graph', 'analytics', 'data', 'statistics', 'report'],
    'check': ['checkmark', 'tick', 'approve', 'confirm', 'done', 'complete'],
    'clock': ['time', 'schedule', 'timer', 'hour', 'minute'],
    'close': ['x', 'cancel', 'exit', 'dismiss', 'remove'],
         'cloud': ['storage', 'sync', 'backup', 'online', 'remote', 'weather', 'sky', 'overcast'],
     'copy': ['duplicate', 'clone', 'replicate'],
     'delete': ['remove', 'trash', 'bin', 'erase', 'destroy'],
     'download': ['save', 'export', 'get', 'retrieve'],
     'edit': ['modify', 'change', 'update', 'pencil', 'write'],
     'email': ['mail', 'message', 'envelope', 'send', 'inbox'],
     'eye': ['view', 'see', 'look', 'visible', 'show'],
     'file': ['document', 'paper', 'page', 'text'],
     'filter': ['sort', 'search', 'refine', 'organize'],
     'folder': ['directory', 'collection', 'group', 'organize'],
     'heart': ['love', 'like', 'favorite', 'health', 'medical'],
     'home': ['house', 'main', 'dashboard', 'start'],
     'info': ['information', 'help', 'about', 'details'],
     'link': ['url', 'connection', 'chain', 'reference'],
     'lock': ['secure', 'private', 'protected', 'password'],
     'menu': ['hamburger', 'navigation', 'options', 'list'],
     'message': ['chat', 'talk', 'communication', 'text'],
     'mic': ['microphone', 'audio', 'voice', 'record', 'sound'],
     'minus': ['subtract', 'remove', 'decrease', 'less'],
     'more': ['additional', 'extra', 'dots', 'options'],
     'music': ['audio', 'sound', 'song', 'play', 'media'],
     'pause': ['stop', 'break', 'halt', 'wait'],
     'phone': ['call', 'telephone', 'mobile', 'contact'],
     'play': ['start', 'begin', 'run', 'media', 'video'],
     'plus': ['add', 'create', 'new', 'increase', 'more'],
     'print': ['printer', 'paper', 'output', 'document'],
     'refresh': ['reload', 'update', 'sync', 'renew'],
     'save': ['disk', 'store', 'keep', 'preserve'],
     'search': ['find', 'look', 'magnify', 'glass', 'seek'],
     'settings': ['config', 'preferences', 'options', 'gear'],
     'share': ['send', 'distribute', 'export', 'social'],
     'star': ['favorite', 'rating', 'bookmark', 'important'],
     'stop': ['halt', 'end', 'pause', 'cease'],
     'tag': ['label', 'category', 'mark', 'organize'],
     'trash': ['delete', 'bin', 'remove', 'garbage'],
     'unlock': ['open', 'access', 'available', 'unsecured'],
     'upload': ['send', 'import', 'add', 'transfer'],
     'user': ['person', 'profile', 'account', 'people'],
     'video': ['movie', 'film', 'media', 'play', 'camera'],
     'volume': ['sound', 'audio', 'speaker', 'noise'],
     'warning': ['alert', 'caution', 'danger', 'error'],
     'wifi': ['wireless', 'internet', 'connection', 'network'],
     'zoom': ['magnify', 'scale', 'resize', 'enlarge'],

     // Arrows
     'up': ['north', 'top', 'above', 'increase'],
     'down': ['south', 'bottom', 'below', 'decrease'],
     'left': ['west', 'back', 'previous'],
     'right': ['east', 'forward', 'next'],

     // Social/Communication
     'facebook': ['social', 'meta', 'fb'],
     'twitter': ['social', 'x', 'tweet'],
     'instagram': ['social', 'ig', 'photo'],
     'linkedin': ['social', 'professional', 'work'],
     'youtube': ['video', 'social', 'media'],
     'whatsapp': ['messaging', 'chat', 'wa'],
     'telegram': ['messaging', 'chat'],
     'discord': ['gaming', 'chat', 'voice'],

     // Business/Finance
     'dollar': ['money', 'currency', 'price', 'cost', 'payment'],
     'euro': ['money', 'currency', 'price', 'cost', 'payment'],
     'credit': ['card', 'payment', 'money', 'finance'],
     'bank': ['finance', 'money', 'account', 'savings'],
     'charts': ['analytics', 'graph', 'data', 'business', 'growth'],

    // Technology
    'code': ['programming', 'development', 'script', 'tech'],
    'database': ['data', 'storage', 'server', 'sql'],
    'server': ['hosting', 'cloud', 'backend', 'infrastructure'],
    'api': ['integration', 'development', 'programming'],
    'bug': ['error', 'issue', 'problem', 'debug'],

    // Medical/Health
    'medical': ['health', 'doctor', 'hospital', 'care'],
    'pill': ['medicine', 'drug', 'medication', 'health'],
    'hospital': ['medical', 'health', 'care', 'emergency'],

    // Transportation
    'car': ['vehicle', 'auto', 'transport', 'drive'],
    'plane': ['airplane', 'flight', 'travel', 'aviation'],
    'train': ['railway', 'transport', 'travel'],
    'bike': ['bicycle', 'cycle', 'transport', 'exercise'],

    // Weather
    'sun': ['sunny', 'weather', 'bright', 'day'],
    'moon': ['night', 'dark', 'lunar'],
    'rain': ['weather', 'water', 'storm'],
    'snow': ['weather', 'winter', 'cold'],

    // Food
    'coffee': ['drink', 'beverage', 'cafe', 'morning'],
    'pizza': ['food', 'italian', 'meal'],
    'burger': ['food', 'fast food', 'meal'],

    // Shopping/E-commerce
    'cart': ['shopping', 'basket', 'buy', 'purchase', 'ecommerce'],
    'bag': ['shopping', 'purchase', 'carry', 'store'],
    'gift': ['present', 'surprise', 'celebration', 'box'],
    'price': ['cost', 'money', 'tag', 'value'],

    // Gaming
    'game': ['play', 'entertainment', 'fun', 'controller'],
    'trophy': ['award', 'win', 'achievement', 'success'],
    'target': ['aim', 'goal', 'objective', 'bullseye'],

    // Education
    'book': ['read', 'education', 'learn', 'study'],
    'graduation': ['education', 'school', 'degree', 'cap'],
    'pencil': ['write', 'draw', 'edit', 'school'],

    // Security
    'shield': ['protection', 'security', 'safe', 'guard'],
    'key': ['access', 'unlock', 'security', 'password'],
    'fingerprint': ['biometric', 'security', 'identity', 'auth'],
  };

  // Add synonyms for the base name
  nameWords.forEach(word => {
    if (iconSynonyms[word]) {
      iconSynonyms[word].forEach(synonym => tags.add(synonym));
    }
  });

  // Category-specific tags
  const categoryTags: Record<string, string[]> = {
    'general': ['ui', 'interface', 'common', 'basic'],
    'arrows': ['direction', 'navigation', 'pointer', 'movement'],
    'social': ['media', 'network', 'sharing', 'communication'],
    'business': ['corporate', 'finance', 'work', 'professional'],
    'technology': ['tech', 'digital', 'computer', 'software'],
    'medical': ['health', 'healthcare', 'hospital', 'doctor'],
    'transportation': ['travel', 'vehicle', 'movement', 'logistics'],
    'weather': ['climate', 'forecast', 'nature', 'outdoor'],
    'food': ['restaurant', 'cooking', 'meal', 'kitchen'],
    'shopping': ['ecommerce', 'retail', 'store', 'purchase'],
    'gaming': ['entertainment', 'play', 'fun', 'competition'],
    'education': ['school', 'learning', 'academic', 'study'],
    'security': ['safety', 'protection', 'privacy', 'auth'],
    'channels': ['communication', 'messaging', 'platform', 'brand'],
    'editor': ['text', 'formatting', 'writing', 'document'],
  };

  if (categoryTags[category]) {
    categoryTags[category].forEach(tag => tags.add(tag));
  }

  // Style-specific tags
  if (style === 'solid') {
    tags.add('filled');
    tags.add('bold');
  } else if (style === 'stroke') {
    tags.add('outline');
    tags.add('line');
  } else if (style === 'duocolor') {
    tags.add('two-tone');
    tags.add('dual');
  }

  return Array.from(tags).filter(tag => tag.length > 1); // Remove single character tags
}

export async function loadIcons(): Promise<IconData[]> {
  const iconsMap = new Map<string, IconData>();

  try {
    const categories = fs.readdirSync(ICONS_DIR);

    for (const category of categories) {
      const categoryPath = path.join(ICONS_DIR, category);
      if (fs.statSync(categoryPath).isDirectory()) {
        const files = fs.readdirSync(categoryPath);

        for (const file of files) {
          if (file.endsWith('.svg')) {
            const filePath = path.join(categoryPath, file);
            const stats = fs.statSync(filePath);
            const svgContent = fs.readFileSync(filePath, 'utf-8');

            // Extract base name and style from filename
            // e.g., activity-stroke.svg, activity-duocolor.svg, activity-solid.svg
            const match = file.match(/^(.*?)-(stroke|duocolor|solid)\.svg$/);
            if (!match) continue;
            const [_, baseName, style] = match;
            const name = baseName
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            const id = `${category}/${baseName}`;

            // Generate comprehensive tags
            const tags = generateIconTags(baseName, category, style);

            if (!iconsMap.has(id)) {
              iconsMap.set(id, {
                id,
                name,
                category,
                styles: [],
                tags,
                lastModified: stats.mtimeMs
              });
            }
            iconsMap.get(id)!.styles.push({
              style: style as 'stroke' | 'duocolor' | 'solid',
              svg: svgContent,
              file
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading icons:', error);
  }

  return Array.from(iconsMap.values());
} 