const { MenuGroups } = require("@quintype/backend");

async function mobileMenuRequestHandler(req, res, next, { client }) {
  const menuGroups = await MenuGroups.getMenuGroups(client);

  const menuTitle = req.query["title"] || "mobile-menu";
  const mobileMenu = menuGroups["menuGroups"][menuTitle];
  res
    .header("Cache-Control", "public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400")
    .header("Vary", "Accept-Encoding")
    .json({ "mobile-menu": mobileMenu });
}

module.exports = { mobileMenuRequestHandler };