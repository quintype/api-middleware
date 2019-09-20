const { Author, Story } =  require("@quintype/backend");
const { DEFAULT_STORY_FIELDS } = require("../constants/constants");

/**
 * * This Handler is for getting the childItem for authors
 */
async function authorsRequestHandler(req, res, next, { client }) {
    const authorId = req.query["id"];
    const limit  = req.query["limit"] || 20;
    const offset = req.query["offset"] || 0;
    const storyfields = (req.query["story-fields"] && req.query["story-fields"].split(",")) || DEFAULT_STORY_FIELDS;

    const authorCollection = await Author.getAuthorCollection(client, authorId , {limit,  offset , "fields" : storyfields})
    const stories = authorCollection.items.map(item => getRefactoredStoryObject(item.story));

    const authorsData = {
        "total-count" : authorCollection["total-count"],
        "template" : authorCollection["template"],
        "items" : stories
    };

    res
    .header("Cache-Control", "public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400")
    .header("Vary", "Accept-Encoding")
    .json(authorsData);
  }

/**
 * This Handler is for getting the childItem for advanced-search
 */
  async function advancedSearchRequestHandler(req, res, next, { client }) {
    const searchParam = req.query["q"];
    const limit  = req.query["limit"] || 20;
    const offset = req.query["offset"] || 0;
    const storyfields = (req.query["story-fields"] && req.query["story-fields"].split(",")) || DEFAULT_STORY_FIELDS;

    const advancedSearch = await client.getAdvancedSearch({
        q : searchParam,
        limit:limit,
        offset:offset,
        "content-types": "story",
        "fields":storyfields
    })
    const advancedSearchStories = advancedSearch.items.map(story => getRefactoredStoryObject(story));
    const advancedSearchData = {
        "total-count" : advancedSearch["total"],
        "items" : advancedSearchStories
    };

    res
    .header("Cache-Control", "public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400")
    .header("Vary", "Accept-Encoding")
    .json(advancedSearchData);
  }

async function tagRequestHandler(req, res, next, { client }){
        const tagName = req.query["tag"];
        const limit = req.query["limit"] || 20;
        const offset = req.query["offset"] || 0;
        const tagCollection = await Story.getStories(client , "top" , {
                "tag-slugs": tagName,
                limit: limit,
                offset:offset,
                 "fields":  DEFAULT_STORY_FIELDS 
        });
        const tagStory = tagCollection.map(story => getRefactoredStoryObject(story.story));        
        const tagData = {
                "items" :tagStory
            };
        res
        .header("Cache-Control", "public,max-age=15,s-maxage=900,stale-while-revalidate=7200,stale-if-error=14400")
        .header("Vary", "Accept-Encoding")
        .json(tagData);
   }

  function getRefactoredStoryObject(story){
    const refactoredStoryObject = {
        "type" : "story",
        "id" : story["id"],
        "hero-image-s3-key" : story["hero-image-s3-key"],
        "headline" : story["headline"],
        "authors" : story["authors"],
        "alternative" : story["alternative"],
        "hero-image-metadata" : story["hero-image-metadata"],
        "slug" : story["slug"],
        "subheadline" : story["subheadline"],
        "author-name" : story["author-name"],
        "url" : story["url"],
        "last-published-at" : story["last-published-at"],
        "access" : story["access"],
        "tags":story["tags"]
    }
    return refactoredStoryObject;
  }

  module.exports = { authorsRequestHandler, advancedSearchRequestHandler, tagRequestHandler};
