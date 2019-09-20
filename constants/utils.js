const DEFAULT_STORY_FIELDS = [
  "updated-at",
  "author-name",
  "tags",
  "headline",
  "subheadline",
  "story-content-id",
  "slug",
  "sections",
  "hero-image-metadata",
  "published-at",
  "summary",
  "hero-image-attribution",
  "bullet-type",
  "id",
  "hero-image-s3-key",
  "cards",
  "story-version-id",
  "alternative",
  "content-type",
  "author-id",
  "owner-id",
  "first-published-at",
  "hero-image-caption",
  "story-template",
  "created-at",
  "authors",
  "metadata",
  "linked-story-ids"
];

function getRefactoredStoryObject(story) {
  const refactoredStoryObject = {
    type: "story",
    id: story["id"],
    "hero-image-s3-key": story["hero-image-s3-key"],
    headline: story["headline"],
    authors: story["authors"],
    alternative: story["alternative"],
    "hero-image-metadata": story["hero-image-metadata"],
    slug: story["slug"],
    subheadline: story["subheadline"],
    "author-name": story["author-name"],
    url: story["url"],
    "last-published-at": story["last-published-at"],
    access: story["access"],
    tags: story["tags"]
  };
  return refactoredStoryObject;
}

module.exports = { DEFAULT_STORY_FIELDS, getRefactoredStoryObject };
