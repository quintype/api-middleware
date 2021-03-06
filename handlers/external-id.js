const { get, pick } = require("lodash");
const publisherConfig = require("@quintype/framework/server/publisher-config");
const superagent = require("superagent");

async function bulkStoriesByExternalId(req, res) {
  const externalIds = req.query["external-ids"]
    ? req.query["external-ids"].split(",")
    : [];
    console.log("externalIds============", externalIds, publisherConfig["sketches_host"])
  const fields = req.query["fields"] && req.query["fields"].split(",");

  const storyPromises = externalIds.map(externalId =>
    superagent
      .get(
        `${publisherConfig["sketches_host"]}/api/v1/story-by-external-id/${externalId}`
      )
      .catch(() => null)
  );
  const stories = (await Promise.all(storyPromises))
    .map(response => response && response.body)
    .map(storyResponse => {
      console.log('----------------', storyResponse)
      const story = get(storyResponse, ["story"]);
      const alternative = get(story, ["alternative", "home", "default"]);
      if (alternative) {
        story.headline = get(alternative, ["headline"], story.headline);
        story["hero-image-s3-key"] = get(
          alternative,
          ["hero-image", "hero-image-s3-key"],
          story["hero-image-s3-key"]
        );
      }
      if (story != null) {
        return story;
      }
    })
    .map(story => (fields && story ? pick(story, fields) : story));

  const storiesByExternalId = stories
    .map((story, index) => [externalIds[index], story])
    .filter(([externalId, story]) => !!story)
    .reduce((acc, [externalId, story]) => {
      acc[externalId] = story;
      return acc;
    }, {});
  res
    .header("Cache-Control","public,max-age=3600,s-maxage=3600,stale-while-revalidate=7200,stale-if-error=14400")
    .header("Vary", "Accept-Encoding")
    .json({ "bookmark-article-mapping": storiesByExternalId });
}

module.exports = { bulkStoriesByExternalId };