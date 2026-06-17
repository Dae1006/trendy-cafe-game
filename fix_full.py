path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

# Read raw bytes
with open(path, 'rb') as f:
    raw = f.read()

# The file has UTF-8 bytes that were incorrectly decoded as Latin-1
# We need to re-encode as Latin-1 then decode as UTF-8
try:
    content = raw.decode('utf-8')
    print('File is valid UTF-8')
except UnicodeDecodeError:
    print('File has encoding issues, fixing...')
    content = raw.decode('latin-1')

# Save the fixed encoding version first
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Encoding fixed!')

# Now translate Vietnamese text to English
viet_to_eng = {
    'NgÃ': 'Day',
    'NgA': 'Day',
    'QuA': 'Cafe',
    'Ch': 'Play',
    'Cáº§n': 'Need',
    'KhÃ': 'Not',
    'Ä': 'A',
    'áº¡i': 'ai',
    'Má»Ÿ': 'Open',
    'khÃ³a': 'unlock',
    'thiáº¿t bá»‹': 'equipment',
    'má»›i': 'new',
    'háº¿t': 'all',
    'nÃ¢ng cáº¥p': 'upgrade',
    'á»£i táº¡i': 'CURRENT',
    'KHÃ': 'LOCKED',
    'Má»Ÿ Rá»™ng': 'Expand',
    'QuÃ¡n': 'Cafe',
    'á»£i': 'open',
    'ngÃ': 'day',
    'nhÃ¢n viÃªn': 'staff',
    'á»•i': 'each',
    'táº§n suáº¥t': 'frequency',
    'Ãt': 'less',
    'Cáº£nh': 'Warn',
    'áº£m': 'negative',
    'thá»•i gian': 'time',
    'xoay': 'recover',
    'á»•ng': 'work',
    'lá»£i nhuáº­n': 'profit',
    'dá»': 'easy',
    'khÃ³ hÆ¡n': 'harder',
    'Ã¡p lá»±c': 'pressure',
    'tá»u á»•u': 'optimize',
    'cháº£i': 'run',
    'lá»›n': 'big',
    'tá»í¡i': 'top',
    'nguyÃªn liá»‡u': 'ingredients',
    'tÄƒng': 'increase',
    'giÃ¡': 'price',
    'giáº£m': 'reduce',
    'thuÃª': 'rent',
    'máº« báº±ng': 'space',
    'Äiá»‡n': 'Electric',
    'NÆ°á»›c': 'Water',
    'áº£o hiá»ƒm': 'insurance',
    'áº£o tráº¬': 'maintenance',
    'á»•n': 'own',
    'á»•i': 'each',
    'Cáº§n': 'Need',
    'á»£i': 'open',
    'khÃ³a': 'unlock',
    'thiáº¿t bá»‹': 'equipment',
    'má»›i': 'new',
    'háº¿t': 'all',
    'nÃ¢ng cáº¥p': 'upgrade',
    'á»£i táº¡i': 'CURRENT',
    'KHÃ': 'LOCKED',
    'Má»Ÿ Rá»™ng': 'Expand',
    'QuÃ¡n': 'Cafe',
    'á»£i': 'open',
    'khÃ³a': 'unlock',
    'thiáº¿t bá»‹': 'equipment',
    'ngÃ': 'day',
    'nhÃ¢n viÃªn': 'staff',
    'á»•i': 'each',
    'táº§n suáº¥t': 'frequency',
    'Ãt': 'less',
    'Cáº£nh': 'Warn',
    'áº£m': 'negative',
    'thá»•i gian': 'time',
    'xoay': 'recover',
    'á»•ng': 'work',
    'lá»£i nhuáº­n': 'profit',
    'dá»': 'easy',
    'khÃ³ hÆ¡n': 'harder',
    'Ã¡p lá»±c': 'pressure',
    'tá»u á»•u': 'optimize',
    'cháº£i': 'run',
    'lá»›n': 'big',
    'tá»í¡i': 'top',
    'nguyÃªn liá»‡u': 'ingredients',
    'tÄƒng': 'increase',
    'giÃ¡': 'price',
    'giáº£m': 'reduce',
    'thuÃª': 'rent',
    'máº« báº±ng': 'space',
    'Äiá»‡n': 'Electric',
    'NÆ°á»›c': 'Water',
    'áº£o hiá»ƒm': 'insurance',
    'áº£o tráº¬': 'maintenance',
}

# Apply fixes - order matters, longer strings first
for viet, eng in sorted(viet_to_eng.items(), key=lambda x: len(x[0]), reverse=True):
    content = content.replace(viet, eng)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Translation done!')
