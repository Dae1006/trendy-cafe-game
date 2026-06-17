path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

with open(path, 'rb') as f:
    raw = f.read()

# Remove UTF-8 BOM if present
if raw.startswith(b'\xef\xbb\xbf'):
    raw = raw[3:]

# Fix corrupted UTF-8 sequences
# The file was saved with wrong encoding, so UTF-8 bytes were interpreted as Latin-1
# We need to reverse this: encode to latin-1, then decode as UTF-8
try:
    # Try to decode as latin-1 first (this preserves all byte values)
    text = raw.decode('latin-1')
    # Now the text contains mojibake - we need to fix it
    # But actually, the file might already be valid UTF-8 with some corrupted sequences
    # Let's check if it's valid UTF-8
    text.encode('utf-8')
    print('File is valid UTF-8, no encoding fix needed')
except UnicodeDecodeError:
    # File has encoding issues, try to fix
    print('File has encoding issues, fixing...')
    # Encode back to latin-1, then decode as UTF-8
    raw = raw.decode('latin-1').encode('latin-1')
    text = raw.decode('utf-8')

# Now translate Vietnamese text to English
viet_to_eng = [
    ('Ng\\xa0y', 'Day'),
    ('QuA\\u00e2n', 'Cafe'),
    ('Ch\\xc1\\u1eddi', 'Play'),
    ('C\\xc3\\xa1\\u1ea8n', 'Need'),
    ('Kh\\xc3\\xa1', 'Not'),
    ('\\u0110', 'D'),
    ('\\u00e1\\u1ea1i', 'ai'),
    ('M\\xc3\\xa1\\u1edf', 'Open'),
    ('kh\\xc3\\xb3a', 'unlock'),
    ('thi\\xc3\\aát b\\xc3\\xa1\\u1edbi', 'equipment'),
    ('m\\xc3\\xa1\\u1edbi', 'new'),
    ('h\\xc3\\xa1\\u1ebft', 'all'),
    ('n\\xc3\\xa2ng c\\xc3\\xa1\\u1eadp', 'upgrade'),
    ('\\xc3\\xa1\\u1edbi t\\xc3\\xa1\\u1ea1i', 'CURRENT'),
    ('KH\\xc3\\x81', 'LOCKED'),
    ('M\\xc3\\xa1\\u1edf R\\xc3\\xa1\\u1edfng', 'Expand'),
    ('Qu\\xc3\\xa1n', 'Cafe'),
    ('\\xc3\\xa1\\u1edbi', 'open'),
    ('kh\\xc3\\xb3a', 'unlock'),
    ('thi\\xc3\\xaát b\\xc3\\xa1\\u1edbi', 'equipment'),
    ('m\\xc3\\xa1\\u1edbi', 'new'),
    ('h\\xc3\\xa1\\u1ebft', 'all'),
    ('n\\xc3\\xa2ng c\\xc3\\xa1\\u1eadp', 'upgrade'),
    ('\\xc3\\xa1\\u1edbi t\\xc3\\xa1\\u1ea1i', 'CURRENT'),
    ('KH\\xc3\\x81', 'LOCKED'),
    ('M\\xc3\\xa1\\u1edf R\\xc3\\xa1\\u1edfng', 'Expand'),
    ('Qu\\xc3\\xa1n', 'Cafe'),
    ('\\xc3\\xa1\\u1edbi', 'open'),
    ('kh\\xc3\\xb3a', 'unlock'),
    ('thi\\xc3\\xaát b\\xc3\\xa1\\u1edbi', 'equipment'),
    ('m\\xc3\\xa1\\u1edbi', 'new'),
    ('h\\xc3\\xa1\\u1ebft', 'all'),
    ('n\\xc3\\xa2ng c\\xc3\\xa1\\u1eadp', 'upgrade'),
    ('\\xc3\\xa1\\u1edbi t\\xc3\\xa1\\u1ea1i', 'CURRENT'),
    ('KH\\xc3\\x81', 'LOCKED'),
    ('M\\xc3\\xa1\\u1edf R\\xc3\\xa1\\u1edfng', 'Expand'),
    ('Qu\\xc3\\xa1n', 'Cafe'),
    ('\\xc3\\xa1\\u1edbi', 'open'),
    ('kh\\xc3\\xb3a', 'unlock'),
    ('thi\\xc3\\xaát b\\xc3\\xa1\\u1edbi', 'equipment'),
    ('m\\xc3\\xa1\\u1edbi', 'new'),
    ('h\\xc3\\xa1\\u1ebft', 'all'),
    ('n\\xc3\\xa2ng c\\xc3\\xa1\\u1eadp', 'upgrade'),
    ('\\xc3\\xa1\\u1edbi t\\xc3\\xa1\\u1ea1i', 'CURRENT'),
    ('KH\\xc3\\x81', 'LOCKED'),
]

# Apply fixes
for viet, eng in viet_to_eng:
    text = text.replace(viet, eng)

# Write back
with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Done!')
