path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find start of orphaned block: line 763 = index 762 (0-based)
# The orphaned block starts at "el.innerHTML = \"\";" and ends before "function renderStats"
# Find the orphaned block by looking for lines that are NOT function definitions
# but contain renderMenu-like code between the two renderMenu functions

start_line = None
end_line = None

for i in range(len(lines)):
    if i > 722 and 'el.innerHTML' in lines[i] and i < 800:
        # Check if this is the orphaned block (not part of renderStats)
        if 'renderStats' not in ''.join(lines[max(0,i-2):i+1]):
            start_line = i
    if start_line and i > start_line and 'function renderStats()' in lines[i]:
        end_line = i
        break

print(f"Orphaned block: lines {start_line+1}-{end_line} (indices {start_line}-{end_line-1})")
print(f"Total lines before: {len(lines)}")

if start_line and end_line:
    # Remove the orphaned lines (from start_line to end_line-1)
    new_lines = lines[:start_line] + lines[end_line:]
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Removed {end_line - start_line} orphaned lines!")
    print(f"Total lines after: {len(new_lines)}")
else:
    print("Could not find orphaned block")
