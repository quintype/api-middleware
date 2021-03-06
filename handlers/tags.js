const { Story } = require("@quintype/backend");
const {
  DEFAULT_STORY_FIELDS,
  getRefactoredStoryObject
} = require("../constants/utils");

async function tagRequestHandler(req, res, next, { client }) {
  const tagName = req.query["tag"];
  const limit = req.query["limit"] || 20;
  const offset = req.query["offset"] || 0;
  const storyfields =
    (req.query["story-fields"] && req.query["story-fields"].split(",")) ||
    DEFAULT_STORY_FIELDS;

  const tagCollection = await Story.getStories(client, "top", {
    "tag-slugs": tagName,
    limit: limit,
    offset: offset,
    fields: storyfields
  });
  const tagStory = tagCollection.map(story =>
    storyfields
      ? getRefactoredStoryObject(story.story, storyfields)
      : getRefactoredStoryObject(story.story)
  );
  const tagData = {
    items: tagStory
  };
  res
    .header(
      "Cache-Control",
      "public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400"
    )
    .header("Vary", "Accept-Encoding")
    .json(tagData);
}

module.exports = { tagRequestHandler };
