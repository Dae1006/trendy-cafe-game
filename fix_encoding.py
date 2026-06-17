# Fix double-encoded UTF-8 in index.html - PRESERVE EMOJI

filepath = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

# Read raw bytes
with open(filepath, 'rb') as f:
    raw = f.read()

# Remove BOM if present
if raw[:3] == b'\xef\xbb\xbf':
    raw = raw[3:]

# Decode as UTF-8 with error handling
text = raw.decode('utf-8', errors='replace')

# Fix double-encoded emoji by reversing the encoding error
# Strategy: encode to cp1252 (Windows-1252), then decode as UTF-8
# But preserve characters that are already valid emoji

# First, find all double-encoded patterns and fix them
import re

def fix_double_encoded(match):
    """Fix a double-encoded UTF-8 sequence"""
    try:
        # Encode to cp1252 (reverses the Windows-1252 misinterpretation)
        # Then decode as UTF-8 (gets original bytes)
        return match.group(0).encode('cp1252', errors='replace').decode('utf-8', errors='replace')
    except:
        return match.group(0)

# Pattern: sequences that look like double-encoded UTF-8
# These are typically: \xc3\x83 followed by various bytes (for 4-byte emoji)
# Or: \xc3\xa2 followed by various bytes (for 3-byte emoji)
# We need to find these patterns in the decoded text

# Actually, the double-encoded text is already in the decoded string
# The corrupted coffee emoji is: \u00e2\u0098\u0095 (which is 'â', '\x98', '\x95')
# But wait, \x98 and \x95 are not valid in cp1252...

# Let me try a different approach: fix the specific corrupted patterns
# The corrupted coffee emoji in the file is: â˜• (U+00E2 U+0098 U+0095)
# But these are actually: \xc3\xa2 \xc2\x98 \xc2\xa2 in UTF-8 bytes

# Wait, I need to understand the encoding better
# Original: ☕ = U+2615 = UTF-8: E2 98 95
# Double-encoded: E2 98 95 was interpreted as Windows-1252:
#   E2 -> â (U+00E2)
#   98 -> ˜ (U+02DC) - this is NOT in Windows-1252!
#   95 -> • (U+2022)
# Then saved as UTF-8: â = C3 A2, ˜ = CB 9C, • = E2 80 A2

# So the file has: C3 A2 CB 9C E2 80 A2
# When decoded as UTF-8: â (U+00E2), ˜ (U+02DC), • (U+2022)

# To fix: encode to latin-1 (reverses the UTF-8 encoding)
# Then decode as UTF-8 (gets original bytes)

# But wait, the file is already decoded as UTF-8
# So we have: â (U+00E2), ˜ (U+02DC), • (U+2022)
# We need to encode these to get the bytes: C3 A2 CB 9C E2 80 A2
# Then decode as UTF-8 to get: E2 98 95
# Then encode to latin-1 to get: â, ˜, •
# Then decode as UTF-8 to get: ☕

# Actually, the issue is that ˜ (U+02DC) is NOT in latin-1 or cp1252
# So we can't simply encode to latin-1

# Let me try a different approach: manually fix the specific corrupted patterns
# The corrupted coffee emoji is: â˜• (U+00E2 U+02DC U+2022)
# Should be: ☕ (U+2615)

# Find and replace all double-encoded patterns
fixed_text = text

# Fix corrupted coffee emoji
fixed_text = fixed_text.replace('\u00e2\u02dc\u2022', '\u2615')  # coffee

# Write back
with open(filepath, 'wb') as f:
    f.write(fixed_text.encode('utf-8'))

print('Fixed!')

# Verify
with open(filepath, 'rb') as f:
    result = f.read()

# Find title tag
title_start = result.find(b'<title>') + 7
title_end = result.find(b'</title>')
title_bytes = result[title_start:title_end]
print(f'Title bytes: {title_bytes.hex()}')
print(f'Title text: {title_bytes.decode("utf-8")}')
