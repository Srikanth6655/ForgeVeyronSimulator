# Forge & Veyron Currency Simulator

## Overview
This project contains two currency simulators (Forge and Veyron) and a simple chatbot assistant. The simulators run client-side and return results to the parent React app (no iframes). A lightweight Express server is provided to proxy AI requests (so API keys are kept server-side).

## Software Requirements
- Node.js 18.x or newer (LTS recommended)
- npm (comes with Node) or yarn
- Recommended: 4GB RAM minimum, 2 CPU cores, 200MB free disk for the project
- Optional: An OpenAI API key (or other LLM endpoint) if you want the AI assistant to call a hosted model

## Hardware (recommended)
- Development machine: modern laptop/desktop (Intel i5 / Ryzen 5 or better)
- Disk: 1GB free for node modules; SSD preferred for faster install
- RAM: 4GB minimum (8GB+ recommended for simult. dev tools)

## Setup
1. Unzip the project and `cd` into the directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` from `.env.example` and set `OPENAI_API_KEY` (if you want AI):
   ```
   OPENAI_API_KEY=sk-...
   PORT=3001
   ```
4. Start the client (Vite dev server):
   ```bash
   npm run dev
   ```
5. In another terminal start the server to proxy AI requests:
   ```bash
   npm run start-server
   ```
   Server default port: 3001. Client dev server will run on port 5173 by default.

## How to use
- Open `http://localhost:5173` (or the vite URL) and navigate between **Forge** and **Veyron** pages.
- Upload the appropriate file format (Forge: JSON; Veyron: CSV/XLSX converted to CSV).
- Select multiplier type and click **Calculate** to see results.
- Use **Download CSV** to export the results.
- Use the **Chat Assistant** to ask for explanations. The assistant will proxy the request to the server route `/api/chat`.

## Notes
- XLS/XLSX support is not included by default in the client; convert to CSV or ask me to add `xlsx` support.
- All currency multiplications are client-side; for secure/large datasets, move logic to server-side.
