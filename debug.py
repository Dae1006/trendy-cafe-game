path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines):
    if 'onclick=' in line and 'buyRecipe' in line:
        print('Line ' + str(i+1) + ': ' + repr(line))
