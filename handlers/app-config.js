async function appConfigRequestHandler(req, res, next, { config }) {
  const appConfigData = {
    "cdn-name": config["cdn-name"],
    "shrubbery-host": config["shrubbery-host"],
    "polltype-host": config["polltype-host"],
    "publisher-id": config["publisher-id"],
    "publisher-name": config["publisher-name"],
    "cdn-image": config["cdn-image"],
    copyright: config["publisher-settings"]["copyright"],
    "static-page-urls": config["static-page-urls"]
  };
  res
    .header("Cache-Control", "public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400")
    .header("Vary", "Accept-Encoding")
    .json(appConfigData);
}

module.exports = { appConfigRequestHandler };