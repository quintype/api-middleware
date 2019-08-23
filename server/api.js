const apiClients = require("@quintype/framework/server/api-client");
const { get } =  require("lodash");
const { getPagePath } = require("../data/collection");

const { Collection, Entity } = apiClients;

function addPagePathToCollectionItems(collection, config, depth = 0) {
  if (collection) {
    collection.items.forEach(item => {
      if (item.type === "collection") {
        if (depth > 0) {
          item = addPagePathToCollectionItems(item, config, depth - 1);
        }
        item.pagePath = getPagePath(item, config);
      }
    });
  }
  return collection;
}

function addPagePathToEntityItems(entity, config) {
  entity.collections = entity.collections.map(collection => {
    collection.pagePath = getPagePath(collection, config);
    return collection;
  });
  return entity;
}

class ProxyCollection extends Collection {
  static async getCollectionBySlug(client, slug, params, opts, config) {
    let collection = await super.getCollectionBySlug(client, slug, params, opts);
    if (collection) {
      collection.collection.pagePath = getPagePath(collection, config);
      return addPagePathToCollectionItems(collection, config, get(opts, ["depth"]));
    }
    return null;
  }
}

class ProxyEntity extends Entity {
  async getCollections(client, params, config) {
    const collections = await super.getCollections(client, params).map(c => c.asJson());
    const magazineEntity = Object.assign(this.asJson(), { collections });
    return addPagePathToEntityItems(magazineEntity, config);
  }
}

module.exports = { ...apiClients, Collection: ProxyCollection, Entity: ProxyEntity };
