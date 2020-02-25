const { Collection } = require("../server/api");
const get = require("lodash/get");
const { DEFAULT_STORY_FIELDS } = require("../constants/utils");

function isBundle(collection) {
  const type = get(collection, ["metadata", "type", "0", "name"], null);
  return type === "bundle";
}

function ignoreChildrenOfBundle(purgeFlag, item) {
  return purgeFlag && isBundle(item);
}

function ignoreChildrenOfMagazine(purgeFlag, item) {
  return purgeFlag && isMagazine(item);
}

function isMagazine(item) {
  return !!get(item, [
    "metadata",
    "entities",
    "collectionEntities",
    "magazine",
    "0"
  ]);
}

function getStoryObject(story, fieldsReqd = DEFAULT_STORY_FIELDS) {
  const storyObject = { type: "story" };
  fieldsReqd.forEach(field => {
    if (story.story[field]) {
      storyObject[field] = story.story[field];
    }
  });
  return storyObject;
}

function getBreakingNewsStory(story, fieldsReqd = DEFAULT_STORY_FIELDS) {
  const storyObject = {
    type: "story"
  };
  fieldsReqd.forEach(field => {
    if (field === "slug") {
      storyObject.slug = get(
        story,
        ["story", "metadata", "linked-story-slug"],
        null
      );
    } else if (story.story[field]) {
      storyObject[field] = story.story[field];
    }
  });
  return storyObject;
}

function getCollectionObject(collectionObject, items) {
  const refactoredCollectionObject = {
    type: collectionObject["type"],
    template: collectionObject["template"],
    metadata: collectionObject["metadata"],
    "updated-at": collectionObject["updated-at"],
    slug: collectionObject["slug"],
    name: collectionObject["name"],
    summary: collectionObject["summary"],
    id: collectionObject["id"],
    "total-count": collectionObject["total-count"],
    "collection-date": collectionObject["collection-date"],
    items,
    "created-at": collectionObject["created-at"],
    "associated-metadata": collectionObject["associated-metadata"]
  };
  return refactoredCollectionObject;
}

function convertInteger(num) {
  /* number and null and undefined will be returned as it is,
     undefined will be returned as 0,
     Strings like "0", "1" will be cast to number and returned
  */
  return typeof num === "number" || num === null
    ? num
    : isNaN(num)
    ? 0
    : parseInt(num);
}

function getFetchParams(item, collectionParameters, params) {
  const numberOfStoriesPerCollection =
    (collectionParameters["number_of_stories_inside_collection_to_show"] &&
      convertInteger(
        collectionParameters["number_of_stories_inside_collection_to_show"]
      )) ||
    null;

  const numberOfCollection =
    convertInteger(collectionParameters["number_of_collections_to_show"]) ||
    null;
  const numberOfStories =
    convertInteger(collectionParameters["number_of_stories_to_show"]) || 5;
  const fetchParams = {
    ...params,
    "associated-metadata": item["associated-metadata"],
    storyfields: params["storyfields"],
    haveLimits: true,
    limit: 40,
    purgeBundleItems: params.purgeBundleItems,
    purgeMagazineItems: params.purgeMagazineItems
  };
  if (isMagazine(item)) {
    fetchParams.limit = 5;
    fetchParams["associated-metadata"]["number_of_stories_to_show"] = 5;
    fetchParams["item-type"] = "story";
  } else if (numberOfCollection && numberOfStoriesPerCollection) {
    fetchParams.limit = numberOfStoriesPerCollection;
    fetchParams["associated-metadata"][
      "number_of_collections_to_show"
    ] = numberOfCollection;
    fetchParams["associated-metadata"][
      "number_of_stories_inside_collection_to_show"
    ] = numberOfStoriesPerCollection;
    fetchParams["item-type"] = "collection";
  } else if (numberOfStories) {
    fetchParams.limit = numberOfStories;
    fetchParams["item-type"] = "story";
  }
  return fetchParams;
}

function numberofStoriesTobeReturned(collectionParameters) {
  return (
    convertInteger(collectionParameters["number_of_slider_stories_to_show"]) +
      convertInteger(collectionParameters["number_of_child_stories_to_show"]) ||
    convertInteger(collectionParameters["number_of_stories_to_show"]) ||
    (collectionParameters["number_of_stories_inside_collection_to_show"] &&
      convertInteger(
        collectionParameters["number_of_stories_inside_collection_to_show"]
      )) ||
    5
  );
}

function reduceCollection(
  itemList,
  params,
  numberofStories,
  numberofCollection
) {
  let [storyCount, collectionCount] = [0, 0];
  const redcuedItemList = itemList.reduce((acc, item) => {
    if (item.type === "story") {
      if (storyCount < numberofStories) {
        acc.push(item);
        storyCount++;
      }
    } else if (
      item.type === "collection" &&
      ignoreChildrenOfBundle(params.purgeBundleItems, item)
    ) {
      if (collectionCount < numberofCollection) {
        acc.push(item);
        collectionCount++;
      }
    } else {
      acc.push(item);
    }
    return acc;
  }, []);

  return redcuedItemList;
}

function filterItemType(collection, itemType) {
  if (itemType) {
    collection.items = collection.items.filter(item => item.type === itemType);
  }
  return collection;
}

async function cumulateCollection(client, collection, params = {}) {
  const collectionObject = collection.items
    ? filterItemType(collection, params["item-type"])
    : (
        await Collection.getCollectionBySlug(client, collection.slug, params)
      ).asJson();
  if (params["associated-metadata"]) {
    collectionObject["associated-metadata"] = params["associated-metadata"];
  }
  const collectionParameters = params["associated-metadata"] || {};
  const numberofStories = numberofStoriesTobeReturned(collectionParameters);
  const numberofCollection = convertInteger(
    collectionParameters["number_of_collections_to_show"]
  );
  const objectList =
    params.haveLimits && (numberofStories || numberofCollection)
      ? reduceCollection(
          collectionObject.items,
          params,
          numberofStories,
          numberofCollection
        )
      : collectionObject.items;

  const newItems = await Promise.all(
    objectList.map(async item => {
      if (item.type === "collection" && item.slug) {
        if (
          ignoreChildrenOfBundle(params.purgeBundleItems, item) ||
          ignoreChildrenOfMagazine(params.purgeMagazineItems, item)
        ) {
          if (item["items"]) {
            /* If child items of a bundle or magazine are already fetched, purge them it reduce the download size */
            delete item["items"];
          }
          return new Promise(resolve => resolve(item));
        } else {
          // const childParams = item["associated-metadata"] && Object.keys(item["associated-metadata"]).length ? item["associated-metadata"] : collectionParameters
          const childParams = item["associated-metadata"];
          return childParams
            ? cumulateCollection(
                client,
                item,
                getFetchParams(item, childParams, params)
              )
            : cumulateCollection(
                client,
                item,
                getFetchParams(item, collectionParameters, params)
              );
        }
      } else if (item.type === "story" || item.type === "breaking-news") {
        return new Promise(resolve => {
          if (collection.slug === "breaking-news") {
            if (params.storyfields) {
              resolve(getBreakingNewsStory(item, params.storyfields));
            } else {
              resolve(getBreakingNewsStory(item));
            }
          } else {
            if (params.storyfields) {
              resolve(getStoryObject(item, params.storyfields));
            } else {
              resolve(getStoryObject(item));
            }
          }
        });
      } else {
        return new Promise(resolve => resolve(item));
      }
    })
  );

  const refactoredCollectionObject = getCollectionObject(
    collectionObject,
    newItems
  );
  return refactoredCollectionObject;
}

async function collectionHandler(req, res, next, { config, client, params }) {
  const { slug: collectionSlug, limit, offset, depth = 2 } = req.query;
  const purgeBundleItems = !!(
    req.query["exclude-bundle-items"] &&
    req.query["exclude-bundle-items"] === "true"
  );
  const purgeMagazineItems = !!(
    req.query["exclude-magazine-items"] &&
    req.query["exclude-magazine-items"] === "true"
  );

  const storyfields =
    (req.query["story-fields"] && req.query["story-fields"].split(",")) || null;
  const initialParams = {
    offset,
    limit,
    haveLimits: false,
    storyfields: storyfields,
    purgeBundleItems,
    purgeMagazineItems
  };

  const collectionObject = await Collection.getCollectionBySlug(
    client,
    collectionSlug,
    initialParams,
    { depth }
  );

  if (collectionObject) {
    const collectionDataSet = await cumulateCollection(
      client,
      collectionObject.asJson(),
      initialParams
    );

    const collectionRefactoredData = {
      "updated-at": collectionDataSet["updated-at"],
      slug: collectionDataSet["slug"],
      name: collectionDataSet["name"],
      summary: collectionDataSet["summary"],
      id: collectionDataSet["id"],
      "collection-date": collectionDataSet["collection-date"],
      items: collectionDataSet["items"],
      "total-count": collectionDataSet["total-count"],
      metadata: collectionDataSet["metadata"]
    };
    res
      .header("Cache-Control","public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400")
      .header("Vary", "Accept-Encoding")
      .header("Cache-Tag",(collectionObject.cacheKeys(config.asJson()["publisher-id"]) || []).join(","))
      .header("Surrogate-Tag",(collectionObject.cacheKeys(config.asJson()["publisher-id"]) || []).join(" "))
      .json(collectionRefactoredData);
  } else {
    res
      .header("Vary", "Accept-Encoding")
      .status(404)
      .json({ message: "could not find collection" });
  }
}

module.exports = { collectionHandler };
