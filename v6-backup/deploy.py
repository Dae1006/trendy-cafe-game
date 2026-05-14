#!/usr/bin/env python3
"""Push trendy-cafe-game to GitHub Pages via API"""
import os, sys, json, time

try:
    import requests
except ImportError:
    print("Installing requests...")
    os.system("pip install requests")
    import requests

# === CONFIG ===
TOKEN = os.getenv("GITHUB_TOKEN") or os.getenv("GH_TOKEN") or ""
REPO = "Dae1006/trendy-cafe-game"

def gh(path, method="GET", data=None, raw=None):
    if not TOKEN:
        print("ERROR: Set GITHUB_TOKEN or GH_TOKEN environment variable")
        print("Get one at: https://github.com/settings/tokens (repo scope)")
        sys.exit(1)
    url = f"https://api.github.com/repos/{REPO}{path}"
    headers = {
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if data is not None:
        body = json.dumps(data).encode()
        headers["Content-Type"] = "application/json"
    elif raw is not None:
        body = raw
    else:
        body = None
    r = requests.request(method, url, headers=headers, data=body)
    if r.status_code == 403 and "abuse" in r.text.lower():
        print("Rate limited! Waiting 65s...")
        time.sleep(65)
        return gh(path, method, data, raw)
    if r.status_code == 401:
        print("ERROR: Invalid token!")
        sys.exit(1)
    r.raise_for_status()
    return r.json() if r.text else None

def main():
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "index.html")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"📄 File: {file_path}")
    print(f"📏 Size: {len(content)} bytes")
    print(f"🌟 Title: {content.split('<title>')[1].split('</title>')[0] if '<title>' in content else 'N/A'}")
    
    # Check for login screen
    has_login = 'login-screen' in content
    has_50m = '50000000' in content
    print(f"✅ Has login screen: {has_login}")
    print(f"✅ Has 50m start: {has_50m}")

    # Get current branch ref
    ref = gh("/git/refs/heads/main")
    sha = ref["object"]["sha"]
    print(f"📍 Current HEAD: {sha[:8]}")

    # Get current tree
    tree = gh("/git/trees/" + sha)
    new_tree = []
    for item in tree["tree"]:
        if item["path"] == "index.html":
            new_tree.append({
                "path": "index.html",
                "mode": "100644",
                "type": "blob",
                "content": content
            })
        else:
            new_tree.append(item)

    # Create new tree
    tree_resp = gh("/git/trees", "POST", {"tree": new_tree})
    new_tree_sha = tree_resp["sha"]
    print(f"🌳 New tree: {new_tree_sha[:8]}")

    # Create commit
    commit = gh("/git/commits", "POST", {
        "message": "feat: v4.3 - login screen, 50m start, all critical bug fixes",
        "tree": new_tree_sha,
        "parents": [sha]
    })
    print(f"📝 New commit: {commit['sha'][:8]}")

    # Update branch ref
    gh("/git/refs/heads/main", "PATCH", {"sha": commit["sha"], "force": True})
    print("✅ Branch updated!")
    
    print("\n🚀 Pushed to GitHub!")
    print("🌐 https://dae1006.github.io/trendy-cafe-game/")
    print("⏱️ May take 1-2 minutes to deploy")
    print("\n💡 If blank screen persists:")
    print("   1. Clear browser cache (Ctrl+Shift+Del)")
    print("   2. Force reload (Ctrl+F5)")
    print("   3. View Page Source (Ctrl+U) to verify content")

if __name__ == "__main__":
    main()
