# Projects / Projets

**English** — Web apps by Ricardo Tessy (Full Stack Developer, Benin): a PWA navigation map (ORI Maps), a 3D browser game (Cauri Rush), a student timetable app (ESGIS Connect), and two accounting/CRM apps for West African businesses (SuiviPro, SuiviPro Expert). Each folder has its own README with features, stack and how to run it.

| Folder | Project |
|---|---|
| [`ori-maps/`](ori-maps/) | Geodesic navigation map (PWA) |
| [`cauri-rush-pwa/`](cauri-rush-pwa/) | 3D browser game with multiplayer |
| [`esgis-connect-site/`](esgis-connect-site/) | Student timetable PWA |
| [`suivipro/`](suivipro/) | CRM and OHADA accounting |
| [`suivipro-expert/`](suivipro-expert/) | Multi-client accounting-firm edition |
| [`moncodebenin/`](moncodebenin/) | Professional logistics app |

---

**Français**

Ce dépôt regroupe plusieurs applications web (HTML/JS, la plupart installables en PWA).

| Dossier | Projet | Description |
|---|---|---|
| [`ori-maps/`](ori-maps/) | ORI Maps Global | Cartographie et précision géodésique (source dans `src/`, version compilée dans `dist/`) |
| [`moncodebenin/`](moncodebenin/) | MonCode Bénin | Application de logistique professionnelle (source dans `src/`, version compilée dans `dist/`) |
| [`esgis-connect-site/`](esgis-connect-site/) | ESGIS Connect | Site installable en PWA (manifest, service worker et icônes inclus) |
| [`suivipro-expert/`](suivipro-expert/) | SuiviPro Expert | Suivi de dossiers pour cabinet comptable multi-dossiers, fonctionne hors ligne |
| [`cauri-rush-pwa/`](cauri-rush-pwa/) | Cauri Rush | Jeu PWA avec 3 niveaux de difficulté et sons en fon (voir `LISEZMOI.txt`) |

## Utilisation

Chaque projet est autonome : ouvrez son `index.html` dans un navigateur, ou servez le dossier avec un serveur statique pour tester la PWA (par exemple `python3 -m http.server`).
