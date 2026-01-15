# How to Change Your Git Account

This guide will help you change your Git account credentials (username and email) and update GitHub authentication.

## Option 1: Change Git User Name and Email (For Commits)

### Change Globally (All Repositories)

```bash
# Set your new username
git config --global user.name "Your New Name"

# Set your new email
git config --global user.email "your.new.email@example.com"

# Verify the changes
git config --global user.name
git config --global user.email
```

### Change for This Repository Only

```bash
# Remove --global flag to change only for current repo
git config user.name "Your New Name"
git config user.email "your.new.email@example.com"
```

## Option 2: Change GitHub Authentication

If you want to use a different GitHub account, you need to update your credentials:

### Method A: Update Credentials in Keychain (macOS)

1. **Remove old credentials:**
   ```bash
   git credential-osxkeychain erase
   host=github.com
   protocol=https
   ```
   (Press Enter twice after typing the above)

2. **Or use Keychain Access app:**
   - Open **Keychain Access** (Applications → Utilities)
   - Search for "github.com"
   - Delete the old GitHub credentials
   - Next time you push/pull, Git will ask for new credentials

### Method B: Use Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` permissions
3. When Git asks for password, use the token instead

### Method C: Use SSH Keys (Recommended)

1. **Generate a new SSH key:**
   ```bash
   ssh-keygen -t ed25519 -C "your.new.email@example.com"
   ```
   (Save it with a different name if you have existing keys)

2. **Add SSH key to ssh-agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

3. **Copy public key:**
   ```bash
   pbcopy < ~/.ssh/id_ed25519.pub
   ```

4. **Add to GitHub:**
   - Go to GitHub → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your key and save

5. **Update remote URL to use SSH:**
   ```bash
   git remote set-url origin git@github.com:USERNAME/REPO.git
   ```

## Option 3: Switch Between Multiple GitHub Accounts

If you need to use multiple GitHub accounts:

### Using SSH Config

1. **Edit SSH config:**
   ```bash
   nano ~/.ssh/config
   ```

2. **Add configuration:**
   ```
   # Personal GitHub account
   Host github.com-personal
       HostName github.com
       User git
       IdentityFile ~/.ssh/id_ed25519_personal

   # Work GitHub account
   Host github.com-work
       HostName github.com
       User git
       IdentityFile ~/.ssh/id_ed25519_work
   ```

3. **Update remote URLs:**
   ```bash
   git remote set-url origin git@github.com-personal:USERNAME/REPO.git
   # or
   git remote set-url origin git@github.com-work:USERNAME/REPO.git
   ```

## Quick Commands Reference

```bash
# Check current Git config
git config --list

# Check current user
git config user.name
git config user.email

# Change globally
git config --global user.name "New Name"
git config --global user.email "new@email.com"

# Change for this repo only
git config user.name "New Name"
git config user.email "new@email.com"

# View all remotes
git remote -v

# Change remote URL
git remote set-url origin https://github.com/USERNAME/REPO.git
# or for SSH
git remote set-url origin git@github.com:USERNAME/REPO.git
```

## Verify Your Changes

After making changes:

```bash
# Check Git config
git config --list | grep user

# Test GitHub connection
ssh -T git@github.com
# Should show: "Hi USERNAME! You've successfully authenticated..."

# Or test HTTPS
git ls-remote https://github.com/USERNAME/REPO.git
```

## Common Issues

### "Permission denied" errors
- Make sure your SSH key is added to GitHub
- Check SSH key is loaded: `ssh-add -l`
- Test connection: `ssh -T git@github.com`

### Wrong account showing in commits
- Check: `git config user.name` and `git config user.email`
- Update if needed (see commands above)
- Note: This only affects NEW commits, not existing ones

### Credentials still cached
- Clear macOS keychain: Delete GitHub entries in Keychain Access
- Or use: `git credential-osxkeychain erase` (see Method A above)

---

**Need help?** Let me know which method you'd like to use!
