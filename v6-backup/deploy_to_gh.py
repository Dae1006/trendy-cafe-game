import requests
import json
import os
import sys

# Config
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
if not GITHUB_TOKEN:
    print("Please set GITHUB_TOKEN environment variable")
    print("Create one at: https://github.com/settings/tokens (repo scope)")
    sys.exit(1)

GITHUB_USER = os.environ.get("GITHUB_USER", "")
REPO_NAME = "trendy-cafe-game"
BRANCH = "main"

def create_repo():
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "name": REPO_NAME,
        "description": "Quán Trendy Café - Web Game",
        "private": False,
        "auto_init": False
    }
    resp = requests.post(
        f"https://api.github.com/user/repos",
        headers=headers,
        json=data
    )
    if resp.status_code == 201:
        print(f"✅ Repo created: https://github.com/{GITHUB_USER}/{REPO_NAME}")
    elif resp.status_code == 422:
        print(f"⚠️  Repo already exists: https://github.com/{GITHUB_USER}/{REPO_NAME}")
    else:
        print(f"❌ Error: {resp.status_code} {resp.text}")
        sys.exit(1)

def upload_file(filepath, repo_path):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    data = {
        "message": f"Add {repo_path}",
        "content": content.encode('utf-8').hex(),
        "branch": BRANCH
    }
    
    url = f"https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/contents/{repo_path}"
    resp = requests.put(url, headers=headers, json=data)
    if resp.status_code == 201:
        print(f"✅ Uploaded: {repo_path}")
    elif resp.status_code == 200:
        print(f"✅ Updated: {repo_path}")
    else:
        print(f"❌ Error uploading {repo_path}: {resp.status_code} {resp.text}")

# Main
print("🚀 Deploying Quán Trendy Café to GitHub Pages...")
create_repo()

# Upload files
base_path = os.path.dirname(os.path.abspath(__file__))
for filename in ["index.html", "styles.css", "game.js", "README.md", "DEPLOY.md"]:
    filepath = os.path.join(base_path, filename)
    if os.path.exists(filepath):
        upload_file(filepath, filename)

print("\n🎉 Deployment complete!")
print(f"📝 Enable GitHub Pages:")
print(f"   1. Go to https://github.com/{GITHUB_USER}/{REPO_NAME}/settings/pages")
print(f"   2. Under 'Source', select 'GitHub Actions' or 'Deploy from a branch'")
print(f"   3. Select branch: {BRANCH}, folder: / (root)")
print(f"   4. Click Save")
print(f"\n🌐 Your game will be at: https://{GITHUB_USER}.github.io/{REPO_NAME}/")
