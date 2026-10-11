export type AppEnv = "development" | "staging" | "production";

const raw = process.env.APP_ENV;

export const APP_ENV: AppEnv =
  raw === "development" || raw === "staging" || raw === "production"
    ? raw
    : process.env.NODE_ENV === "production"
      ? "production"
      : "development";

export const isDev = APP_ENV === "development";
export const isProd = APP_ENV === "production";
