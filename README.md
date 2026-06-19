# Budget

App de gestion de budget personnel. Import des relevés bancaires CSV de la Société Générale, catégorisation automatique par règles, dashboard mensuel et suivi par budget de catégorie. Tout est stocké en local (`localStorage`), sans backend.

## Stack

- React 18 + Vite
- Tailwind CSS v4
- Recharts
- react-router-dom
- uuid

## Démarrer

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Déployable sur Vercel sans configuration additionnelle.

## Fonctionnalités

- Import CSV Société Générale (drag & drop, dédoublonnage, parsing montants français)
- Catégorisation automatique par mots-clés, recatégorisation manuelle, proposition de nouvelle règle
- Dashboard mensuel : récap, donut par catégorie, cards de budget par catégorie
- Vue Transactions : filtres combinables (catégorie, montant, période), tri, total agrégé
- Paramètres : budgets par catégorie, gestion des règles, profil

Le champ `event_id` de chaque transaction est prévu pour une V2 (rattachement à un événement/voyage) et reste `null` pour l'instant.
