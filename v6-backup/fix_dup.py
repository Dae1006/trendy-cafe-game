path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the SECOND occurrence of "function renderMenu" and remove it until "function renderStats"
# The new renderMenu is at line ~722. Remove the old one (lines 763-784 approximately).
second_start = content.find('\nfunction renderMenu()', content.find('\nfunction renderMenu()') + 1)
second_end = content.find('function renderStats()', second_start)

print(f"Second renderMenu at: {second_start}")
print(f"renderStats at: {second_end}")

if second_start > 0 and second_end > second_start:
    # Remove from second_start to second_end+18 (function renderStats() includes the function keyword)
    # Actually keep renderStats but remove renderMenu before it
    before = content[:second_start]
    after = content[second_end:]
    # Insert a newline between them
    result = before + '\n' + after
    with open(path, 'w', encoding='utf-8') as f:
        f.write(result)
    print("Duplicate renderMenu REMOVED!")
else:
    print("Could not find duplicate to remove")
