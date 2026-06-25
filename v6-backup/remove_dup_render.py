path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Count renderMenu occurrences
count = content.count('function renderMenu()')
print("renderMenu count:", count)

if count > 1:
    # Find both occurrences
    first = content.find('function renderMenu()')
    second = content.find('function renderMenu()', first + 1)
    
    print("First at:", first)
    print("Second at:", second)
    
    # Find where the second renderMenu function ends (next function definition)
    third_func = content.find('function renderStats()', second + 1)
    print("renderStats after second renderMenu:", third_func)
    
    if third_func > second:
        # Find the end of second renderMenu by finding its closing brace
        # The second renderMenu should end just before renderStats
        # Let's find the pattern: the second renderMenu function's closing }
        # followed by renderStats
        
        # Look for: }function renderStats
        close_pattern = content.rfind('}\nfunction renderStats', first, third_func)
        if close_pattern < 0:
            close_pattern = content.rfind('}function renderStats', first, third_func)
        
        print("Close of second renderMenu:", close_pattern)
        
        # The second renderMenu starts at 'second' and ends at close_pattern + 1
        # We want to remove from 'second' to close_pattern + 1 (inclusive of the })
        # Keep everything before 'second' and everything after close_pattern
        before = content[:second]
        after = content[close_pattern:]
        
        new_content = before + '\n\n' + after
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("Removed second renderMenu!")
        print("New line count:", new_content.count('\n'))
else:
    print("Only one renderMenu found. Checking for other issues...")
    # Check for duplicate closing braces or other issues
    lines = content.split('\n')
    brace_stack = []
    for i, line in enumerate(lines):
        for ch in line:
            if ch == '{':
                brace_stack.append(('open', i+1))
            elif ch == '}':
                if brace_stack:
                    brace_stack.pop()
