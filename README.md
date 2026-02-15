# Allstar AI

A modern web application built with Vite, React, and Tailwind CSS, configured with Supabase and GitHub MCP servers.

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **Tailwind CSS v4** - Utility-first CSS framework
- **MCP Servers** - Supabase and GitHub integrations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_API_KEY` - Your Supabase anon/public key
- `GITHUB_PERSONAL_ACCESS_TOKEN` - GitHub PAT for MCP server

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## MCP Servers

This project is configured with two MCP servers in `.mcp.json`:

1. **Supabase** - Database and authentication integration
2. **GitHub** - Repository and code management

MCP servers will automatically connect when using Claude Code in this project directory.

## Project Structure

```
allstar-ai/
├── .claude/              # Claude Code settings
├── .mcp.json            # MCP server configuration
├── public/              # Static assets
├── src/
│   ├── App.jsx         # Main application component
│   ├── App.css         # Component styles
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles (Tailwind)
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

## License

MIT
