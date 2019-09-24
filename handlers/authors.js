const { Author } = require("@quintype/backend");
const {
  DEFAULT_STORY_FIELDS,
  getRefactoredStoryObject
} = require("../constants/utils");

/**
 * * This Handler is for getting the childItem for authors
 */
async function authorsRequestHandler(req, res, next, { client }) {
  const authorId = req.query["id"];
  const limit = req.query["limit"] || 20;
  const offset = req.query["offset"] || 0;
  const storyfields =
    (req.query["story-fields"] && req.query["story-fields"].split(",")) ||
    DEFAULT_STORY_FIELDS;

  const authorCollection = await Author.getAuthorCollection(client, authorId, {
    limit,
    offset,
    fields: storyfields
  });
  const stories = authorCollection.items.map(item =>
    storyfields ? 
    getRefactoredStoryObject(item.story, storyfields)
    : getRefactoredStoryObject(item.story)
  );

  const authorsData = {
    "total-count": authorCollection["total-count"],
    template: authorCollection["template"],
    items: stories
  };

  res
    .header(
      "Cache-Control",
      "public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400"
    )
    .header("Vary", "Accept-Encoding")
    .json(authorsData);
}

module.exports = { authorsRequestHandler };
