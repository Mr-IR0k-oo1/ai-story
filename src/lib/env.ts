function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Copy .env.example to .env.local and fill in the values.`
    );
  }
  return value;
}

export const env = {
  MISTRAL_API_KEY: requireEnv("MISTRAL_API_KEY"),
  DATABASE_URL: process.env.DATABASE_URL || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 30,
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  MAX_DAILY_TOKENS: Number(process.env.MAX_DAILY_TOKENS) || 1_000_000,
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;
