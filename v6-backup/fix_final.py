path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix line 741 (0-indexed: 740)
# The issue is the onclick="buyRecipe('" + item.id + "')"> which has conflicting quotes
# Just replace it with onclick=buyRecipe(item.id)
for i, line in enumerate(lines):
    if 'buyRecipe(' in line and 'Unlock' in line:
        lines[i] = line.replace(
            'onclick="buyRecipe(\'" + item.id + "\')">',
            'onclick=buyRecipe(item.id)>'
        )
        print('Fixed line ' + str(i+1))
        break

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Done!")
