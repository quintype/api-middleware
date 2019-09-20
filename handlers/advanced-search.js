const { DEFAULT_STORY_FIELDS, getRefactoredStoryObject } = require("../constants/utils");

/**
 * This Handler is for getting the childItem for advanced-search
 */
async function advancedSearchRequestHandler(req, res, next, { client }) {
  const searchParam = req.query["q"];
  const limit = req.query["limit"] || 20;
  const offset = req.query["offset"] || 0;
  const storyfields =
    (req.query["story-fields"] && req.query["story-fields"].split(",")) ||
    DEFAULT_STORY_FIELDS;

  const advancedSearch = await client.getAdvancedSearch({
    q: searchParam,
    limit: limit,
    offset: offset,
    "content-types": "story",
    fields: storyfields
  });
  const advancedSearchStories = advancedSearch.items.map(story =>
    getRefactoredStoryObject(story)
  );
  const advancedSearchData = {
    "total-count": advancedSearch["total"],
    items: advancedSearchStories
  };

  res
    .header(
      "Cache-Control",
      "public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400"
    )
    .header("Vary", "Accept-Encoding")
    .json(advancedSearchData);
}

module.exports = { advancedSearchRequestHandler };
