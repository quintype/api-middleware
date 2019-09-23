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
  "linked-story-ids",
  "access"
];

function getRefactoredStoryObject(story, fieldsReqd = DEFAULT_STORY_FIELDS) {
    const storyObject = { type: "story" };
    fieldsReqd.forEach(field => {
      if (story[field]) {
        storyObject[field] = story[field];
      }
    });
    return storyObject;
}

module.exports = { DEFAULT_STORY_FIELDS, getRefactoredStoryObject };
