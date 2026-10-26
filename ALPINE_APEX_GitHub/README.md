# ALPINE APEX — GitHub Website + Game

This is the **GitHub-only package**: the public landing/download website, browser game, Supabase client configuration, and automatic Windows-installer workflow. No separate setup files are needed.

## What's inside

- `index.html` — redesigned ALPINE APEX website and download page.
- `game.html` — the playable game, with refreshed visual styling.
- `cloud-config.js` — public Supabase project URL and publishable key (safe for browser use; never put a service-role/secret key here).
- `.github/workflows/pages.yml` — automatically publishes the website with GitHub Pages.
- `.github/workflows/release.yml` + Electron files — builds a Windows installer when you create a version release.

## Publish the website (no command line)

1. Sign in to GitHub and create a **new public repository** named `alpine-apex`.
2. Download and extract this folder on your PC.
3. Open your new repository on GitHub, choose **Add file → Upload files**, and upload the *contents* of this folder (including the `.github` folder). Commit the files to the `main` branch.
4. Open the repository's **Settings → Pages**. Under **Build and deployment**, choose **GitHub Actions** as the source.
5. Open the **Actions** tab and wait for “Deploy ALPINE APEX website” to finish successfully.
6. Your website should appear at `https://YOUR-GITHUB-NAME.github.io/alpine-apex/`. Replace `YOUR-GITHUB-NAME` with your GitHub username.

The landing page's **Play now** button opens `game.html`. The Windows installer link will lead to the latest GitHub Release after you publish a release.

## Publish a Windows installer

After the website is published, open **Releases → Draft a new release** in your repository, create a new tag named `v1.0.0`, and publish the release. GitHub Actions will build and attach the `.exe` installer automatically. Wait for the “Build Windows installer” workflow to finish. The website's download link then points to the latest release.

## Supabase status and limits

`cloud-config.js` points to the existing Alpine Apex Supabase project and uses its public publishable key. This package does **not** include a secret key. The game currently uses Supabase Realtime Presence for public lobby discovery and PeerJS for peer-to-peer race packets. A dedicated authoritative racing server, anti-cheat, and complete Supabase Auth/cloud-save integration are **not** implemented by this package yet; do not advertise those as finished features. A real two-player test is still required.

## Security note

Only public client keys belong in browser code. Never upload Supabase secret or `service_role` keys. Do not send passwords, emails, or private data through the public Realtime lobby.

## Windows installer (automatic)

The `.github/workflows/windows-installer.yml` workflow builds a Windows installer from the included HTML game using Electron. After uploading these files to GitHub, open **Actions → Build Windows installer → Run workflow**. When it finishes successfully, open the run and download `ALPINE-APEX-Windows-Installer` under **Artifacts**. The artifact is a ZIP containing the `.exe` installer. It does not automatically attach the installer to an existing GitHub Release; download the artifact and add the `.exe` to the release's **Assets** if you want it on the public release page.

This creates a desktop wrapper for the current website/game files; it does not turn the game into a native 3D engine or verify multiplayer functionality. The workflow uses Electron Builder: https://www.electron.build/docs/github-actions/
