path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

with open(path, 'rb') as f:
    raw = f.read()

# Remove BOM
if raw.startswith(b'\xef\xbb\xbf'):
    raw = raw[3:]

# Fix double \r\n to \n
raw = raw.replace(b'\r\r\n', b'\n')

# Decode as UTF-8
text = raw.decode('utf-8')

# Now fix corrupted emojis - these are UTF-8 bytes interpreted as Windows-1252
# The pattern is: ð followed by various characters = corrupted emoji
# We need to replace these with proper emojis

# Common corrupted emoji patterns
emoji_replacements = [
    ('ðŸ'¡', '💰'),  # money bag
    ('ðŸ'Ž‰', '🎉'),  # party popper
    ('ðŸ"„', '🔄'),  # refresh
    ('ðŸ"…', '📅'),  # calendar
    ('ðŸ"§', '🔧'),  # wrench
    ('ðŸ"‹', '📋'),  # clipboard
    ('ðŸ"½ï¸', '🍽️'),  # fork and knife
    ('ðŸ"Š', '📊'),  # bar chart
    ('ðŸ"¥', '👥'),  # people
    ('ðŸ"§', '🔧'),  # wrench
    ('ðŸ"'£', '🛒'),  # shopping cart
    ('ðŸ"ª', '🏪'),  # shop
    ('ðŸ"¡', '💰'),  # money bag
    ('âŽ', '★'),  # star
    ('â˜†', '☆'),  # empty star
    ('âš"ï¸', '⚠️'),  # warning
    ('ðŸ"¸', '💸'),  # money with wings
    ('ðŸ"¦', '🏦'),  # bank
    ('ðŸ"•', '🐕'),  # dog
    ('ðŸ"±', '🐱'),  # cat
    ('ðŸ"³', '🌳'),  # tree
    ('ðŸ"Ž', '💎'),  # gem
    ('ðŸ"²', '🌲'),  # evergreen tree
    ('ðŸ"¿', '🌿'),  # herb
    ('ðŸ"º', '🌺'),  # flower
    ('ðŸ"°', '🍰'),  # pot of food
    ('ðŸ"«', '🍋'),  # lemon
    ('ðŸ"»', '🍋'),  # lemon
    ('ðŸ"¥', '💴'),  # yen banknote
    ('ðŸ"¨', '🎈'),  # balloon
    ('ðŸ"©', '🎩'),  # top hat
    ('ðŸ"ª', '🪪'),  # ID card
    ('ðŸ"«', '🌋'),  # volcano
    ('ðŸ"¬', '🌌'),  # milky way
    ('ðŸ"­', '🍭'),  # lollipop
    ('ðŸ"®', '🍮'),  # custard
    ('ðŸ"¯', '🍯'),  # honey pot
    ('ðŸ"°', '🍰'),  # pot of food
    ('ðŸ"±', '🐱'),  # cat
    ('ðŸ"²', '🌲'),  # evergreen tree
    ('ðŸ"³', '🌳'),  # tree
    ('ðŸ"´', '🌴'),  # palm tree
    ('ðŸ"µ', '🍵'),  # tea cup
    ('ðŸ"¶', '📶'),  # signal
    ('ðŸ"·', '🎷'),  # saxophone
    ('ðŸ"¸', '💸'),  # money with wings
    ('ðŸ"¹', '🎹'),  # keyboard
    ('ðŸ"º', '🌺'),  # flower
    ('ðŸ"»', '🌋'),  # volcano
    ('ðŸ"¼', '🌌'),  # milky way
    ('ðŸ"½', '🍽️'),  # fork and knife
    ('ðŸ"¾', '🐾'),  # paw prints
    ('ðŸ"¿', '🌿'),  # herb
    ('ðŸ" ', '🌠'),  # shooting star
    ('ðŸ#', '🎯'),  # direct hit
    ('ðŸ$', '💤'),  # zzz
    ('ðŸ%', '💥'),  # collision
    ('ðŸ&', '💦'),  # sweat droplets
    ('ðŸ\'', '💧'),  # droplet
    ('ðŸ(', '💨'),  # dash
    ('ðŸ)', '💩'),  # pile of poo
    ('ðŸ*', '💫'),  # dizzy
    ('ðŸ+', '💬'),  # speech balloon
    ('ðŸ,', '💭'),  # thought balloon
    ('ðŸ-', '💮'),  # white flower
    ('ðŸ.', '🏮'),  # red paper lantern
    ('ðŸ/', '🎍'),  # pine decoration
    ('ðŸ0', '🎎'),  # Japanese dolls
    ('ðŸ1', '🎏'),  # carp streamer
    ('ðŸ2', '🎐'),  # wind chime
    ('ðŸ3', '🎑'),  # moon viewing ceremony
    ('ðŸ4', '🏧'),  # ATM sign
    ('ðŸ5', '🏪'),  # convenience store
    ('ðŸ6', '🏫'),  # school
    ('ðŸ7', '🏬'),  # department store
    ('ðŸ8', '🏭'),  # factory
    ('ðŸ9', '🏯'),  # Japanese castle
    ('ðŸ:', '🏰'),  # castle
    ('ðŸ;', '🏥'),  # hospital
    ('ðŸ<', '🏠'),  # house
    ('ðŸ=', '🏡'),  # house with garden
    ('ðŸ>', '🏢'),  # office building
    ('ðŸ?', '🏤'),  # post office
    ('ðŸ@', '🏦'),  # bank
    ('ðŸA', '🏨'),  # hotel
    ('ðŸB', '🏩'),  # love hotel
    ('ðŸC', '🏪'),  # convenience store
    ('ðŸD', '🏫'),  # school
    ('ðŸE', '🏬'),  # department store
    ('ðŸF', '🏭'),  # factory
    ('ðŸG', '🏮'),  # red paper lantern
    ('ðŸH', '🏯'),  # Japanese castle
    ('ðŸI', '🏰'),  # castle
    ('ðŸJ', '🏥'),  # hospital
    ('ðŸK', '🏠'),  # house
    ('ðŸL', '🏡'),  # house with garden
    ('ðŸM', '🏢'),  # office building
    ('ðŸN', '🏤'),  # post office
]

for old, new in emoji_replacements:
    text = text.replace(old, new)

# Write back
with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Emojis fixed!')
