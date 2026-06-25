path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the orphaned block - it's between the NEW renderMenu and renderStats
# Pattern: the NEW renderMenu ends with }\n\n then orphaned content then }\nfunction renderStats

import re

# Find the first renderMenu function (the NEW one we wrote)
first_render_menu_start = content.find('function renderMenu()')
if first_render_menu_start < 0:
    print("ERROR: No renderMenu found")
    exit()

# Find where renderMenu function ends (next function definition or closing brace)
# Look for the closing brace that ends renderMenu, then orphaned content, then renderStats
first_render_menu_end = content.find('function renderStats()', first_render_menu_start)
if first_render_menu_end < 0:
    print("ERROR: No renderStats found after renderMenu")
    exit()

print("renderMenu at:", first_render_menu_start)
print("renderStats at:", first_render_menu_end)

# Extract what's between them
between = content[first_render_menu_end-len("function renderStats()"):first_render_menu_end]
print("Between renderMenu and renderStats:")
print(repr(between))

# Find the actual end of renderMenu function - it should end with }\n before any orphaned content
# Look for "}\\n\\nfunction renderStats" pattern
pattern = r'}\\n\\n(.*?)function renderStats\(\)'
match = re.search(pattern, content[first_render_menu_start:])
if match:
    orphaned = match.group(1)
    print("Found orphaned content:")
    print(repr(orphaned[:200]))
    
    # Remove the orphaned content
    orphaned_start = first_render_menu_start + match.start()
    orphaned_end = first_render_menu_start + match.end()
    
    new_content = content[:orphaned_start+1] + content[orphaned_end:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Orphaned content removed!")
else:
    print("Pattern not found")
    # Let's try another approach - find the second occurrence of function definitions
    funcs = []
    search_start = first_render_menu_start
    while True:
        pos = content.find('function ', search_start + 10)
        if pos < 0 or pos > first_render_menu_end + 100:
            break
        funcs.append(pos)
        search_start = pos
    
    print("Functions between renderMenu and renderStats:", funcs)
    for f_pos in funcs:
        func_name = content[f_pos:f_pos+50]
        print("  Found:", func_name)
