const { Author } =  require("@quintype/backend");
const { DEFAULT_STORY_FIELDS } = require("../constants/constants");

async function authorsRequestHandler(req, res, next, { client }) {
    const authorId = req.query["id"];
    const limit  = req.query["limit"] || 20;
    const offset = req.query["offset"] || 0;
    const storyfields = (req.query["story-fields"] && req.query["story-fields"].split(",")) || null;

    const authorCollection = await Author.getAuthorCollection(client, authorId , {limit,  offset , storyfields : storyfields})
    const stories = authorCollection.items.map(item => getAuthorStory(item));

    const authorsData = { 
        "total-count" : authorCollection["total-count"],
        "template" : authorCollection["template"],
        "items" : stories 
    };

    res
    .header("Cache-Control", "public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400")
    .header("Vary", "Accept-Encoding")
    .json(authorsData);
  }

  function getAuthorStory(item){
    const story = item.story;
    const refactoredStoryObject = {
        "type" : "story",
        "id" : story["id"],
        "hero-image-s3-key" : story["hero-image-s3-key"],
        "headline" : story["headline"],
        "authors" : story["authors"],
        "alternative" : story["alternative"],
        "hero-image-metadata" : story["hero-image-metadata"],
        "slug" : story["slug"],
        "subheadline" : story["subheadline"],
        "author-name" : story["author-name"],
        "url" : story["url"],
        "last-published-at" : story["last-published-at"],
        "access" : story["access"]
    }
    return refactoredStoryObject;
  }
  
  module.exports = { authorsRequestHandler };