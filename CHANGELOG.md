# Changelog — NEXIUM Storage Web

All notable changes to the frontend are documented here.
Format: `[version] — date — description`

---

## [0.6.0] — 2026-09 — Admin billing & canaux de paiement

### Added
- Page admin billing : gestion des plans (édition inline)
- Gestion des canaux de paiement : créer, modifier, activer/désactiver
- Upload de logo opérateur directement vers R2 depuis l'interface admin
- Mode édition par ligne avec Enregistrer / Annuler
- Formulaire d'ajout de nouveau canal avec prévisualisation logo

### Changed
- Table des canaux : colonnes Canal, Slug, Note, Statut, Actions (design épuré)
- Panel d'édition affiché sous la ligne sélectionnée (évite les problèmes de overflow)

---

## [0.5.0] — 2026-08 — Billing utilisateur

### Added
- Page `/dashboard/billing` : affichage du plan actif, quota utilisé, date d'expiration
- Liste des plans disponibles avec prix en FCFA
- Checkout mobile money : sélection canal (MTN, Orange, Wave, Moov) + numéro de téléphone
- Polling du statut de paiement côté client
- Affichage du redirect Wave (pay.jeko.africa)
- Section add-ons : achat de stockage supplémentaire par paliers (50/100/200/500 GB)
- Historique des paiements

---

## [0.4.0] — 2026-08 — Dashboard complet

### Added
- Page `/dashboard/usage` : quota utilisé, quota total, barre de progression
- Page `/dashboard/settings` : modification du nom, email, mot de passe
- Page `/dashboard/api-keys` : création, liste, révocation des clés API
- Page webhooks par projet : création, liste, suppression, test de livraison
- Affichage des fichiers publics/privés dans les buckets

---

## [0.3.0] — 2026-08 — Admin panel

### Added
- Layout admin avec sidebar (`/admin/*`)
- Page `/admin/users` : liste, recherche, édition quota, promotion admin/super-admin, suppression
- Page `/admin/logs` : logs d'activité paginés avec filtres
- Middleware de redirection si non admin

---

## [0.2.0] — 2026-08 — Gestion fichiers & buckets

### Added
- Page `/dashboard/projects/[id]/buckets` : liste des buckets d'un projet
- Page `/dashboard/projects/[id]/buckets/[bucketId]` : liste des fichiers, upload drag-and-drop, recherche
- Upload multipart avec barre de progression
- Téléchargement, renommage, suppression de fichiers
- Indicateur visuel public/privé sur les buckets
- Copy URL de fichier en un clic

---

## [0.1.0] — 2026-08 — Fondations

### Added
- Layout avec navigation, auth guards
- Pages auth : login, register, forgot-password, reset-password, verify-email
- Dashboard principal avec résumé (projets, stockage, activité récente)
- Page `/dashboard/projects` : liste et création de projets
- Page `/docs` : guide d'intégration développeur avec exemples multi-langages (cURL, JS, Python, Go, PHP), syntax highlighting, sidebar de navigation
- TanStack Query pour la gestion du cache API
- Tailwind CSS + shadcn/ui comme système de design

---

## État actuel — v0.6.0

### Fonctionnel
- Auth complète (login, register, verify email, reset password)
- Dashboard : projects, buckets, files, api-keys, usage, settings
- Billing : plans, checkout mobile money, add-ons, historique
- Admin : users, logs, billing (plans + canaux)
- Docs : guide d'intégration complet

### Connu / À faire
- `.env.local` à créer manuellement en local (`NEXT_PUBLIC_API_URL=http://localhost:8080`)
- Aucun test automatisé (unit / e2e)
- Pas de CI/CD configuré
- Renouvellement automatique non implémenté (dépend du backend)
- Page de statut des webhooks non implémentée (historique des livraisons)
- **Sécurité (plus tard)** — `access_token` et `refresh_token` stockés dans `localStorage` : lisibles par tout script JS en cas de XSS. Migration vers `HttpOnly` cookies à prévoir (refactoring coordonné avec le backend)
