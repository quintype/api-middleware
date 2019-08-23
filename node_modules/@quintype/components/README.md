# Quintype Components

This is a set of components that is to be used to build a Quintype Node App. This README servers as documentation of the components. Please see [malibu](https://github.com/quintype/malibu) for a reference application using this architecture.

   * [Quintype Components](#quintype-components)
         * [BreakingNews](#breakingnews)
         * [BreakingNewsItem](#breakingnewsitem)
         * [Collection](#collection)
         * [ClientSideOnly](#clientsideonly)
         * [DfpAds](#dfpads)
         * [AdbutlerAds](#adbutlerads)
         * [HamburgerButton](#hamburgerbutton)
         * [ImageGalleryElement](#imagegalleryelement)
         * [InfiniteScroll](#infinitescroll)
         * [InfiniteStoryBase](#infinitestorybase)
         * [LazyCollection](#lazycollection)
         * [LazyLoadImages](#lazyloadimages)
         * [Link](#link)
         * [LoadMoreBase](#loadmorebase)
         * [LoadMoreCollectionStories](#loadmorecollectionstories)
         * [LoadingIndicator](#loadingindicator)
         * [Menu](#menu)
         * [NavigationComponentBase](#navigationcomponentbase)
         * [ResponsiveHeroImage](#responsiveheroimage)
         * [ResponsiveImage](#responsiveimage)
         * [Responsive Source](#responsive-source)
         * [SearchPageBase](#searchpagebase)
         * [Search box](#search-box)
         * [SocialShare](#socialshare)
         * [StoryElement](#storyelement)
         * [WithClientSideOnly](#withclientsideonly)
         * [WithError](#witherror)
         * [WithHostUrl](#withhosturl)
         * [WithLazy](#withlazy)
         * [WithMember](#withmember)
         * [WithPreview](#withpreview)
         * [WithSocialLogin](#withsociallogin)
         * [Review Rating](#review-rating)
      * [Recommended Components that are not included](#recommended-components-that-are-not-included)
         * [Sliders](#sliders)
         * [Marquee for Breaking News](#marquee-for-breaking-news)
         * [ReactTable for table story elements](#reacttable-for-table-story-elements)
         * [UpdateOnInterval](#UpdateOnInterval)
         * [AccessType](#accesstype)

### BreakingNews
This component will automatically fetch breaking news every 30 seconds, and render the provided view.

```javascript
import { renderBreakingNews } from '@quintype/framework/client/start';
const BreakingNewsView = ({breakingNews, breakingNewsLoaded}) =>
  <ul>{breakingNews.map((item, index) => <li key={index}><BreakingNewsItem item={item} /></li>)}</ul>
renderBreakingNews('breaking-news-container', store, BreakingNewsView);
```

### BreakingNewsItem

This component can be used to render a BreakingNewsItem.

```javascript
import {BreakingNewsItem} from '@quintype/components'

<BreakingNewsItem item={item} className="breaking-news__headline"/>
```

### Collection

This component can be used to render a collection. You should typically pass this a collection that represents a page. Also see [LazyCollection](#lazycollection).

```javascript
import {Collection} from '@quintype/components'

// collection = Collection.getCollectionBySlug(client, 'home', {}, {depth: 1})

function TwoColLayout({collection, associatedMetadata, index}) {
  // for item in collection.item
  //   if item.type == story
  //     showStory
  //   else if item.type == colection
  //     <Collection />
  // speed = associatedMetadata.scroll_speed
}

function collectionTemplates(layout, index) {
  if(layout == 'twoColLayout')
    return TwoColLayout;
}

// optional
function storyTemplates(index) {
  return StoryTemplate;
}

// optional
function interstitial(index) {
  if(index % 2 == 0)
    return <AdComponent />
}

<Collection collection={collection}
            collectionTemplates={collectionTemplates}
            storyTemplates={storyTemplates}
            interstitial={interstitial} />
```

### ClientSideOnly
This component will be loaded by client, and bypassed when doing server side rendering. Also see [WithClientSideOnly](#WithClientSideOnly) for a render props version.

```javascript
import { ClientSideOnly } from '@quintype/components';
<ClientSideOnly>
  This will be shown only on the client side
</ClientSideOnly>
```

### DfpAds
This is a higher order component which can be used to manage ad units in a single place. A component must be created, and used with the `adtype` parameter. These ads are lazy-loaded and single-request mode is disabled by default which can be overwritten as follows.

```javascript
import { createDfpAdComponent } from '@quintype/components';

export const CONFIG = {
  "homepage-2": { adUnit: "HP_728x90-3", sizes: [[728, 90], [320, 50]] },
  "homepage-3": { adUnit: "HP_728x90-3", sizes: [[728, 90], [320, 50]] },
}

export const DfpAd = createDfpAdComponent({
  defaultNetworkID: "123456789",
  config: CONFIG,
  targeting: function(state) {
    const params = {};

    // if(storyIsSponsored) params['sponsor'] = storySponsor

    return params;
  },
  // Only if you want to overwrite the existing values
  lazyLoad: false,
  singleRequest: true
});

<DfpAd adtype="homepage-2" />
```

### AdbutlerAds
This component can be used to get ads from `Adbutler` ad service provider based on the `adtype` you want to show

```javascript
import { AdbutlerAd } from '@quintype/components';

// Lists publisher id and the respective mapping of the zone ids
const adbutlerConfig = {
  publisherId: "175635",
  "Horizontal-Ad": "353618",
  "Vertical-Ad": "353620"
};

// Lists sizes of respective ads
const sizes = {
  "Horizontal-Ad": {
    mobile: [320, 50],  // [<width>, <height>]
    tablet: [728, 90],
    desktop: [728, 90]
  },
  "Vertical-Ad": {
    mobile: [300, 250],
    tablet: [300, 600],
    desktop: [300, 600]
  }
};

<AdbutlerAd adtype="Story-Middle-Ad" adbutlerConfig={adbutlerConfig} sizes={sizes} />
```

### HamburgerButton
This component can be used to trigger an action openening the Hamburger menu. The state can be accessed via state.hamburgerOpened

```javascript
import { HamburgerButton } from '@quintype/components';
<HamburgerButton>
  <img src="/path/to/hamburger.png"/>
</HamburgerButton>
```

### ImageGalleryElement
This component can be used for adding image gallery on the story page. You can pass in props like ```className, imageAspectRatio, defaultWidth, element``` and ```widths```

``` javascript
import { ImageGalleryElement } from "@quintype/components";

<ImageGalleryElement element={element} key={element.id} imageAspectRatio={[4,3]} />
```

### InfiniteScroll

This component can be used to implement InfiniteScroll. This is an internal component.

### InfiniteStoryBase

This component can be used to implement InfiniteScroll on the story page. You will need to specify the function which renders the story (which will recieve props.index and props.story), and functions for triggering analytics.

```javascript
import React from 'react';

import { BlankStory } from './story-templates';
import { InfiniteStoryBase } from '@quintype/components';

function StoryPageBase({index, story, otherProp}) {
  // Can switch to a different template based story-template, or only show a spoiler if index > 0
  return <BlankStory story={story} />
}

const FIELDS = "id,headline,slug,url,hero-image-s3-key,hero-image-metadata,first-published-at,last-published-at,alternative,published-at,author-name,author-id,sections,story-template,tags,cards";
function storyPageLoadItems(pageNumber) {
  return global.superagent
           .get("/api/v1/stories", {fields: FIELDS, limit:5, offset:5*pageNumber})
           .then(response => response.body.stories.map(story => ({story: story, otherProp: "value"})));
}

function StoryPage(props) {
  return <InfiniteStoryBase {...props}
                            render={StoryPageBase}
                            loadItems={storyPageLoadItems}
                            onItemFocus={(item) => console.log(`Story In View: ${item.story.headline}`)}
                            onInitialItemFocus={(item) => console.log(`Do Analytics ${item.story.headline}`)} />
}

exports.StoryPage = StoryPage;
```

### LazyCollection

This component can be used to render a collection, but with the components being lazy. This takes all the same options as Collection, but with a `lazyAfter` prop.
This Component also accepts extra props, which will be passed down to collection templates.

Note: This does not accept `interstitial` items (yet). And home page items are not hidden after being rendered

```javascript
import { LazyCollection } from '@quintype/components'

// collection = Collection.getCollectionBySlug(client, 'home', {}, {depth: 1})

<LazyCollection collection={collection}
                collectionTemplates={collectionTemplates}
                storyTemplates={storyTemplates}
                lazyAfter={3}
                extraProp="some prop" />

```

### LazyLoadImages

This component will ensure all [ResponsiveImages](#ResponsiveImage) that are in its descendent path will be loaded async. By default, the image is loaded with an empty gif, and the image becomes visible when the image scrolls 250 from the edge of the screen.

You can use `EagerLoadImages` or `eager={true}` to force the image to be eager. If `EagerLoadImages` is passed a predicate, then images that pass a matching value to `eager` will be rendered eagerly.

```javascript
import { LazyLoadImages, EagerLoadImages } from '@quintype/components';

function LazyLoadSecondImage() {
  return <div>
    <ResponsiveImage slug={props["eager-image-1"]} />
    <LazyLoadImages margin={50}>
      <div>
        <UnrelatedContent/>
        <ResponsiveImage slug={props["lazy-image-1"]} />
        <ResponsiveImage slug={props["lazy-image-forced-to-be-eager"]} eager/>
        <ResponsiveImage slug={props["lazy-image-2"]} />
        <EagerLoadImages>
          <ResponsiveImage slug={props["lazy-image-forced-to-be-eager"]} />
        </EagerLoadImages>
        <EagerLoadImages predicate={(token) => token % 2 === 0}>
          <ResponsiveImage slug={props["lazy-image"]} eager={1} />
          <ResponsiveImage slug={props["eager-image"]} eager={2} />
        </EagerLoadImages>
      </div>
    </LazyLoadImages>
    <ResponsiveImage slug={props["eager-image-2"]} />
  </div>
}
```

### Link
This component generates an anchor tag. Instead of doing a browser page load, it will go to the next page via AJAX. Analytics scripts will be fired correctly (and if not, it's a bug)

```javascript
import { Link } from '@quintype/components';
<Link href="/section/story-slug" otherLinkAttribute="value">Text here</Link>
```

### LoadMoreBase

This component starts with a set of stories, and then provides a load more button. This calls out to `/api/v1/stories` with the properties passed via the `params` prop. The stories are concatenated with the stories in `props.data.stories`, and the contents of `props.data` are passed to the rendered template.

It can accept an alternate `api` as a prop as well as `apiResponseTransformer` which can be used to tranformer the api response before being passed to the `template`.

```javascript
import { LoadMoreStoriesBase } from '@quintype/components';

function SectionPageWithStories({section, stories, loading, onLoadMore, noMoreStories}) {
  return <div/>;
}

export function SectionPage(props) {
  return <LoadMoreStoriesBase template={SectionPageWithStories}
                              fields={"id,headline"}
                              {...props}
                              params={{"section-id": props.data.section.id}}
                              api="/api/v1/stories"
                              apiResponseTransformer={(response) => response.stories} />
}
```

### LoadMoreCollectionStories

This component is very similar to the LoadMoreBase component but fetches the stroies from a `collection`. The api call `/api/v1/collections/{collectionSlug}` is made with the passed collection slug value. The component accepts the `params` prop and a requires a Collection Slug from which to fetch the stories and returns a set of stories only.

```javascript
import { LoadMoreCollectionStories } from '@quintype/components';

function MoreCollectionStories({collection, stories, loading, onLoadMore, noMoreStories}) {
  return <div/>;
}

export function HomePage(props) {
  return <LoadMoreCollectionStories template={MoreCollectionStories}
                                    collectionSlug={props.data.collectionSlug}
                                    data={{collection: collection, stories: initialStories}}
                                    params={{}}/>
}
```

### Get Collection of stories written by a particular author
We can get the collection of stories written by a specific author by using the authorId prop as below:
```javascript
export function HomePage(props) {
  return <LoadMoreCollectionStories
            template={MoreCollectionStories}
            data={{stories: stories}}
            authorId={props.author.id}
            params={{}}
            numStoriesToLoad={10} />
}
```

### LoadingIndicator
This component renders it's children when the app is moving between pages. It can be used to show a spinner. It always has the class "loading-indicator", and also "loading-indicator-loading" when loading.

```javascript
import { LoadingIndicator } from '@quintype/components';

<LoadingIndicator>
  <div className="spinner">Please Wait</div>
</LoadingIndicator>
```

### Menu
This component can be used to render a menu from the menuItems in the editor. An extra class called active is applied if the menu item is the current url. By default, links will resolve via AJAX.

Items will automatically be pulled from `config`, please remember to expose the `layout` key.

Children are prepended to the list of items. Slice can be passed to extract a set of menu items.

```javascript
import { Menu } from '@quintype/components';

<Menu className="menu-class" itemClassName="item-class" slice={[0, 10]}>
  <li>
    <a className="item-class" href="/"> होम </a>
  </li>
</Menu>
```

### NavigationComponentBase

This is a base component which *must* be subclassed, providing a navigateTo function.

```javascript
import { NavigationComponentBase }from '@quintype/components';

class SearchComponent extends NavigationComponentBase {
  render() { return <a href="#" onClick={() => this.navigateTo("/some-page-here")}>Link</a>}
}
```

### ResponsiveHeroImage
This component takes is a wrapper over [ResponsiveImages](#ResponsiveImage), which accepts a story and returns the hero image. By default, it picks the alt text from the headline.

```javascript
import { ResponsiveHeroImage } from '@quintype/components';
<figure className="story-grid-item-image qt-image-16x9">
  <ResponsiveHeroImage story={props.story}
    aspectRatio={[16,9]}
    defaultWidth={480} widths={[250,480,640]} sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
    imgParams={{auto:['format', 'compress']}}/>
</figure>
```

### ResponsiveImage
This component takes an image, and resizes it to the correct aspect ratio using imgix or thumbor.

Also see [Using Responsive Image](doc/using-responsive-image.md)

```javascript
import { ResponsiveImage } from '@quintype/components';

<figure className="story-grid-item-image qt-image-16x9">
  <ResponsiveImage slug={props.story["hero-image-s3-key"]}
    metadata={props.story["hero-image-metadata"]}
    alt={props.story['headline']}
    aspectRatio={[16,9]}
    defaultWidth={480} widths={[250,480,640]}
    sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
    imgParams={{auto:['format', 'compress']}}/>
</figure>
```

### Responsive Source
This component is used in more advanced usages if the aspect ratio is expected to change between screens

```javascript
import { ResponsiveSource } from '@quintype/components';

<figure className="story-grid-item-image">
  <picture>
    // Desktop Version
    <ResponsiveSource media="(min-width: 1024px)"
      slug={props.story["hero-image-s3-key"]}
      metadata={props.story["hero-image-metadata"]}
      aspectRatio={[4,3]}
      widths={[250,480,640]}
      sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
      imgParams={{auto:['format', 'compress']}}/>

    // Mobile Version
    <ResponsiveImage
      slug={props.story["hero-image-s3-key"]}
      metadata={props.story["hero-image-metadata"]}
      alt={props.story['headline']}
      aspectRatio={[16,9]}
      defaultWidth={480} widths={[250,480,640]}
      sizes="(max-width: 500px) 98vw, (max-width: 768px) 48vw, 23vw"
      imgParams={{auto:['format', 'compress']}}/>
  </picture>
</figure>
```

### SearchPageBase
This component is to handle search functionality and also handles load more.

A template must be passed in to render search results. Fields can be passed to get specific fields in the results. The contents of `props.data` are passed to the rendered template.

```javascript
import { SearchPageBase } from "@quintype/components";

function SearchPageView({query, stories, onLoadMore, loading, noMoreStories}) {
  return <div />;
}

<SearchPageBase template={SearchPageView} fields={"id,headline"} {...props}/>
```

### Search box
This component provides a form with a search text box. On submit, the user is redirected to the search page via AJAX.

A template function can also be passed in, to do custom rendering. The template prop will be called with childen having the child text box. See [madrid](https://github.com/quintype/madrid/blob/master/app/isomorphic/components/basic/search.js) as an example

```javascript
import { SearchBox } from '@quintype/components';

<SearchBox className="foobar" placeholder="search" inputClassName="foobar-box" inputId="stg" inputRef={(x) => this.foo = x} onEscape={() => this.closeDialog()}/>
```

### SocialShare
This component renders social share component to front end app.

```javascript
import { SocialShare } from '@quintype/components';

class CustomComponent extends React.Component {

  getSocialCardsTemplate({fbUrl, twitterUrl, gplusUrl, linkedinUrl, handleNativeShare}) {
    return <ul className="social-share-icons">
        <li className="social-share-icon">
          <a href={fbUrl} target="_blank">
            <img src={fbIcon} alt="fb icon"/>
          </a>
        </li>
        {handleNativeShare && <li className="social-share-icon">
          <button onClick={handleNativeShare}>
            <img src={fbIcon} alt="share icon"/>
          </button>
        </li>}
      </ul>
  }

  render() {
    return <div className="story-byline__social-share">
              <SocialShare fullUrl={this.props.story.url}
                title='Headline of the story'
                template={this.getSocialCardsTemplate}
                hashtags='news,india,press' />
           </div>
  }
}
```

### StoryElement
This component renders different types of story elements

Qlitics event is fired on story-elements become visible (this can be disabled by passing a prop called `disableAnalytics={true}`)

```javascript
import { StoryElement } from '@quintype/components';
function StoryCard(props){
  return <div>
    {props.card['story-elements'].map((element, index) => <StoryElement element={element} key={index} story={props.story}></StoryElement>)}
  </div>
}
```
For different quality images in Image Story Element, pass `imageWidths` and `imageDefaultWidth` as props. like
```
<StoryElement story={story} element={element} imageWidths={[420,1040,1600]} imageDefaultWidth={1040}/>
```

### WithClientSideOnly
This component calls the render prop with true if the client side is completely loaded, and false during SSR and initial bootup.

```javascript
import { WithClientSideOnly } from '@quintype/components';
<WithClientSideOnly>
  {({clientSideRendered}) => (
    {clientSideRendered && <span>This will be shown only on the client side</span>}
  )}
</WithClientSideOnly>
```

### WithError
This function can be used to generate a wrapper component that implements `componentDidCatch()`.

```javascript

import { withError } from '@quintype/components';

function optionalErrorFn(props) {
  return <span />;
}

const MyStoryElement = withError(ClassThatMayCrash, optionalErrorFn)
```

### WithHostUrl
This function can be used to get access to the `currentHostUrl` and `primaryHostUrl`.

```javascript
import { WithHostUrl } from '@quintype/components';

<WithHostUrl>{({ primaryHostUrl, currentHostUrl }) =>
  <div>
    <div>primaryHostUrl: {primaryHostUrl}</div>
    <div>currentHostUrl: {currentHostUrl}</div>
  </div>
}</WithHostUrl>
```

### WithLazy

This component can be used to load some DOM just before it scrolls into the screen. Currently, it does not support unloading. The `margin` prop is passed to `IntersectionObserver`.

```javascript
import { WithLazy } from '@quintype/components';

<WithLazy margin="50px">{() =>
  <SomeHeavyComponent />
}</WithLazy>
```

### WithMember
This is a render props component which will call your callback with the current logged in member. It will automatically call `/api/v1/members/me` to figure out if you are logged in, and replace the contents in the store and callback. In future, this may use LocalStorage to cache the member for some time.

The render will also be passed a function to call for logging out, and another to force the library to check if the member is now logged in.

On initial load, the `isLoading` prop will be set, which will become false when the user is loaded. Use this field to avoid showing a Login Button while fetch is happening.

In order to update the current member, call `checkForMemberUpdated`.

```javascript
import { WithMember } from '@quintype/components';

function MyView({ member, logout, checkForMemberUpdated }) {
  return member ? <div>{member.name} <a onClick={logout}>Logout</a></div> : <div>Please Login!</div>;
}

<WithMember>
  {({ member, logout, isLoading }) => (
    <MyView member={member} logout={logout} isLoading={isLoading} />
  )}
</WithMember>
```

### WithPreview

This higher order component can be used for the home or story page preview

```javascript
import { WithPreview, replaceAllStoriesInCollection } from '@quintype/components';
import { StoryPage } from '../pages/story';
import { HomePage } from '../pages/home';

function storyPageData(data, story) {
  return {...data, story, relatedStories: Array(5).fill(story)};
}

// Remember to update load-data.js for the initial data
function homePageData(data, story) {
  return {...data, collection: replaceAllStoriesInCollection(data.collection, story)};
}

export const StoryPreview = WithPreview(StoryPage, storyPageData);
export const HomePreview = WithPreview(HomePage, homePageData)
```

### WithSocialLogin
This is a render props component for logging in. The component adds two items to scope: `serverSideLoginPath` for redirecting to server side, and `login` for doing a client side login. Calling `login()` returns a promise which can be used to handle success and failure cases.

NOTE:
- Twitter does not support ClientSideLogin, and thus `login()` will just redirect to the server. It also ignores the apiKey
- Twitter and LinkedIn do not verify presence of email on the client side. Please ask for these permissions in the app

```javascript
import { WithFacebookLogin, WithGoogleLogin, WithTwitterLogin, WithLinkedInLogin } from '@quintype/components';

function socialLogin(e, login) {
  e.preventDefault();
  login().then(() => window.location.refresh()); // Can also make an API call to /api/v1/members/me
}

<WithFacebookLogin appId="apiKey" scope="email" emailMandatory>{({ login, serverSideLoginPath }) =>
    <a href={serverSideLoginPath} onClick={e => socialLogin(e, login)}>
      <img src={assetify(facebookIcon)} />
    </a>
}</WithFacebookLogin>
<WithGoogleLogin clientId="clientId" scope="email" emailMandatory>{({ login, serverSideLoginPath }) =>
    <a href={serverSideLoginPath} onClick={e => socialLogin(e, login)}>
      <img src={assetify(gplusIcon)} />
    </a>
}</WithGoogleLogin>
<WithTwitterLogin apiKey="apiKey" emailMandatory>{({login, serverSideLoginPath}) =>
    <a href={serverSideLoginPath} onClick={e => socialLogin(e, login)}>
      <img src={assetify(twitterIcon)} />
    </a>
}</WithTwitterLogin>
<WithLinkedInLogin clientKey="clientKey" emailMandatory>{({login, serverSideLoginPath}) =>
    <a href={serverSideLoginPath} onClick={e => socialLogin(e, login)}>
      <img src={assetify(linkedInIcon)} />
    </a>
}</WithLinkedInLogin>
```

### Review Rating

This component takes in the value for rating and renders star for the value passed in. This comopent is generally used for story review type.

```javascript
import { ReviewRating } from '@quintype/components';

<ReviewRating value="3" />
```
The component supports additional props which allows more customization, you can pass in props like size, color, count of stars or even change the render from star to a custom svg component. Refer to component src to know exact details of what is supported.

## Recommended Components that are not included

### Sliders

For a slider, we recomment `react-slick`. It pulls in JQuery, which will add 90kb to your bundle, but is the most malleable slider out there

### Marquee for Breaking News

Our Marquee recommendation is `react-malarquee`. Just remember to mark all items as `display: inline`, and remove any floats. It supports `pauseOnHover`.

### ReactTable for table story elements

The story table element renders a very basic table story element. It can be enhaced by using 'react-table', which supports pagination and other fancy things.

### UpdateOnInterval

  Serves as a wrapper (using render props) used to update it's children via props while executing data loaders sent as props to the component.

  Note : Dataloaders are made to be at an app level to keep the component generic, the return of Dataloaders are sent as props to its children.

  Props | Type | Description | Optional
 --- | --- | --- | ---
 `interval`| `number`(ms) | Sets the time, defaults to 30s | True
 `dataLoader`| `func` | Executes the dataloader, the return of which will be the data to the components children.| False

  Example :
 ```javascript
 import {UpdateOnInterval} from '@quintype/components';

 const story = {
    'example' : 'data'
 };

 function getData() {
     return fetch('/url/something')//...
 }

 ```

```javascript
      <UpdateOnInterval dataLoader={getData} interval={3000} initData={story}>
        {
          ({data}) => <Component data={data}></Component>
        }
      </UpdateOnInterval>
 ```

### AccessType

`AccessType` is a generic connected render prop which exposes methods to handle access to stories / assets and initialize accesstype js

  Name | arguments | Description
 --- | --- | ---
 `initAccessType`| -NA- | Initializes accesstype, checks for existance of accesstype before requesting for AT js
 `initRazorPayPayment`| `selectedPlan`(object) | Executes accesstype js method to bring forth RP payment gateway
 `checkAccess`| `assetId`(string) | Checks if the user has access to the story/asset id passed
 `getSubscriptionForUser`| -NA- | Gets the subscriptions of the current logged in user
 `accessUpdated`| `accessObject`(object) | Sets the current story access to redux store
 `accessIsLoading`| `loading`(boolean) | A boolean which holds true between the request for access of a story and its response


 ##### Props

   Name | type | isRequired
  --- | --- | ---
  `children`| `func` | yes
  `email`| `string` | no
  `phone`| `number` | no
  `isStaging`| `boolean` | no
  `enableAccesstype`| `boolean` | yes
  `accessTypeKey`| `string` | yes


###### Notes :

    * This component uses AccessType Js internally
    * It uses the Access API from subtype for metering, the API works on firebase which uses `thinmint` cookie (set by qlitics) of the user to verify and keep track of visits
    * This component only supports Razorpay payment options for now
    * It communicates to sketches where routes are in pattern `/api/access/v1/*`
    * Metered story has a pingback which is achieved by the use of `navigator.sendBeacon` if available or falls back to fetch, this is needed to update the count of the visited stories for a user
    * Access to story/asset is saved on the redux store under the keyword access which holds keys as story asset id and the access returned from the API as its value
    * `subscriptions` is the key in the store under which all the subscription groups created for the specified account are maintained
    * `paymentOptions` is the key under the store which has all the payment options created for the current AT account
    * `selectedPlan` used by `initRazorPayPayment` refers to one of the plan object nested within the subscription groups

```javascript
//access object on store

access : {
  'c1f6c0d7-2829-4d31-b673-58728f944f82': {
        'data': {
          'isLoggedIn':true,
          'granted': false
          'grantReason': "SUBSCRIBER"
        }
    }
}
```


###### Usage:

```javascript
import { AccessType } from "@quintype/components";


render() {
  return  <AccessType
                 enableAccesstype={enableAccesstype}
                 isStaging={isStaging}
                 accessTypeKey={accessTypeKey}
                 email={email}
                 phone={phone}
                 disableMetering={disableMetering}
               >
                 {({ initAccessType, checkAccess, accessUpdated, accessIsLoading }) => (
                   <div>
                     <StoryComponent
                       accessIsLoading={accessIsLoading}
                       accessUpdated={accessUpdated}
                       initAccessType={initAccessType}
                       checkAccess={checkAccess}
                       {...this.props}
                     />
                   </div>
                 )}
               </AccessType>
}

```


###### Redux notes:

The component dispatches the following actions

* `ACCESS_BEING_LOADED`
* `ACCESS_UPDATED`
* `PAYMENT_OPTIONS_UPDATED`
* `SUBSCRIPTION_GROUP_UPDATED`
* `METER_UPDATED`
