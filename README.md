# kindheart

First app — kindheart 💚

A React + TypeScript web app built with Vite, powered by the Gemini API.

## Tech Stack

- **React** with **TypeScript**
- **Vite** — build tool and dev server
- **Gemini API** — AI capabilities
- Deployable to **Netlify** / **Vercel**

## Project Structure

```
kindheat-/
├── .github/         # GitHub configuration (workflows, CODEOWNERS, etc.)
├── components/       # React components
├── services/          # API calls and business logic
├── App.tsx            # Root application component
├── constants.tsx       # Shared constants
├── index.html          # HTML entry point
├── index.tsx           # App entry point
├── types.ts             # Shared TypeScript types
├── metadata.json         # App metadata
├── netlify.toml           # Netlify deployment config
├── vercel.json             # Vercel deployment config
└── vite.config.ts           # Vite configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akashp9686-star/kindheat-.git
   cd kindheat-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set your Gemini API key in `.env.local`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the app locally:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173` (default Vite port).

## Deployment

This project is preconfigured for both **Netlify** (`netlify.toml`) and **Vercel** (`vercel.json`). Connect the repository to either platform and it will build automatically using the Vite build command.

## Owner

Maintained by [@akashp9686-star](https://github.com/akashp9686-star).

## License

No license specified yet — consider adding one (e.g. MIT) if you plan to share or open source this project.
