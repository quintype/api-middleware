const { collectionHandler } = require("./handlers/collection-data");
const { appConfigRequestHandler } = require("./handlers/app-config");
const { mobileMenuRequestHandler } = require("./handlers/menu-groups");
const { authorsRequestHandler } = require("./handlers/authors");
const { advancedSearchRequestHandler } = require("./handlers/authors");

module.exports = {collectionHandler , appConfigRequestHandler , mobileMenuRequestHandler , authorsRequestHandler, advancedSearchRequestHandler};
