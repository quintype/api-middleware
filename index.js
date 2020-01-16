const { collectionHandler } = require("./handlers/collection-data");
const { appConfigRequestHandler } = require("./handlers/app-config");
const { mobileMenuRequestHandler } = require("./handlers/menu-groups");
const { authorsRequestHandler } = require("./handlers/authors");
const { advancedSearchRequestHandler } = require("./handlers/advanced-search");
const { tagRequestHandler } = require("./handlers/tags");
const { bulkStoriesByExternalId } = require("./handlers/external-id");

module.exports = {collectionHandler , appConfigRequestHandler , mobileMenuRequestHandler , authorsRequestHandler, advancedSearchRequestHandler, tagRequestHandler,bulkStoriesByExternalId};