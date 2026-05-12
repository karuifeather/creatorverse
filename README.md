# Creatorverse

Creatorverse is a small React app for keeping track of content creators worth following. You can browse creators, view a creator’s details, add new creators, edit existing ones, and delete creators from the list.

The data is stored in Supabase, so the app does not rely on hardcoded creator rows.

## Built With

- React
- Vite
- React Router
- Supabase
- Custom CSS

## Features

### Required Features

- [x] Uses a logical React component structure
- [x] Shows at least five content creators on the homepage
- [x] Each creator card shows a name, link, and description
- [x] Uses async/await for API calls
- [x] Each creator has a detail page
- [x] Each creator has a unique URL
- [x] Users can add a creator
- [x] Users can edit a creator
- [x] Users can delete a creator
- [x] Newly added creators appear in the list

### Stretch Features

- [x] Creator cards instead of a plain list
- [x] Creator images on cards
- [ ] PicoCSS

## Pages

| Route          | What it does               |
| -------------- | -------------------------- |
| `/`            | Shows all creators         |
| `/creator/:id` | Shows one creator          |
| `/add`         | Adds a new creator         |
| `/edit/:id`    | Edits or deletes a creator |

## Getting Started

Install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from your Supabase project (use the publishable key, not the service role key).

```bash
npm run dev
```
