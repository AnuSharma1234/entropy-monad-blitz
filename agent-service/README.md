# Agent Service

Node.js/TypeScript service for AI agent betting decisions using Google's Gemini API.

## Features

- **Gemini 2.0 Flash Integration**: Uses latest Gemini model with structured output
- **Personality-Driven Decisions**: 7-stat system influences betting behavior
- **API Key Encryption**: Secure storage of user-provided Gemini API keys
- **Structured Output**: JSON schema validation for consistent responses
- **Low Temperature**: 0.1 temperature for consistent decision-making

## Installation

```bash
bun install
```

## Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Required environment variables:
- `GEMINI_API_KEY`: Your Google Gemini API key (for testing)
- `ENCRYPTION_SECRET`: Secret key for encrypting API keys
- `PORT`: Server port (default: 3001)

## Development

```bash
bun run dev
```

## Testing

```bash
bun test
```

Note: Set `GEMINI_API_KEY` environment variable to run Gemini integration tests.

## API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "service": "agent-service"
}
```

### Agent Decision

```bash
POST /api/agent/decide
```

Request body:
```json
{
  "agentId": "agent-123",
  "gameState": {
    "game": "coinflip",
    "balance": 1.0,
    "recentWins": 2,
    "recentLosses": 1,
    "otherAgentActions": ["betting on dice", "skipping"]
  },
  "geminiApiKey": "AIzaSy..."
}
```

Response:
```json
{
  "action": "bet",
  "game": "coinflip",
  "betAmount": 0.1,
  "reasoning": "With 2 recent wins and moderate risk tolerance, betting small on coinflip"
}
```

## Architecture

```
agent-service/
├── src/
│   ├── index.ts       # Express server & API endpoints
│   ├── gemini.ts      # Gemini API client with structured output
│   ├── types.ts       # TypeScript interfaces & JSON schema
│   ├── prompt.ts      # Decision prompt template with personality
│   └── crypto.ts      # API key encryption utilities
└── test/
    ├── gemini.test.ts # Gemini client tests
    └── api.test.ts    # API endpoint tests
```

## Agent Stats

Each agent has 7 personality traits (1-10 scale):

- **Risk Tolerance**: Higher = bigger bets
- **Aggression**: Higher = more frequent bets
- **Analytical**: Higher = better EV calculation
- **Patience**: Higher = long-term focus
- **Unpredictability**: Higher = unexpected plays
- **Herd Mentality**: Higher = follows other agents
- **Humor**: Higher = funny commentary

## Gemini Configuration

- **Model**: `gemini-2.0-flash-exp`
- **Temperature**: 0.1 (for consistency)
- **Response Format**: Structured JSON with schema validation
- **Rate Limits**: Free tier is 15 RPM, 1,500 RPD

## License

MIT

