import Raven from "raven-js";

function init() {
  Raven.config(
    "https://48550880dc72b6a2b70241ee24e74966@o4506655200051200.ingest.sentry.io/4506655342460928",
    {
      release: "1-0-0",
      environment: "development-test",
    }
  ).install();
}

function log(error) {
  Raven.captureException(error);
}

export default {
  init,
  log,
};
