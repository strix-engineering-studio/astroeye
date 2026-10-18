import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: true,
  environment: process.env.NODE_ENV,

  debug: process.env.NODE_ENV === "development",

  tracesSampleRate:
    process.env.NODE_ENV === "development" ? 1.0 : 0.1,
});

// // This file configures the initialization of Sentry on the client.
// // The added config here will be used whenever a users loads a page in their browser.
// // https://docs.sentry.io/platforms/javascript/guides/nextjs/

// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   dsn: "https://f1d8478821b8da855e2a2d69429f5398@o4512237446692864.ingest.us.sentry.io/4512237448003584",

//   // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
//   tracesSampleRate: 1,

//   dataCollection: {
//     // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
//     // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
//     // userInfo: false,
//     // httpBodies: [],
//   },
// });

// export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
