function objectEntries(obj) {
  var ownProps = Object.keys( obj ),
    i = ownProps.length,
    resArray = new Array(i); // preallocate the Array

  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]];

  return resArray;
}

function findLeftBound(imageWidth, halfCropWidth, focusPoint) {
  if (focusPoint - halfCropWidth < 0) {
    return 0;
  }
  else if (focusPoint + halfCropWidth > imageWidth) {
    return imageWidth - halfCropWidth;
  }
  else {
    return focusPoint - halfCropWidth;
  }
}

function findBounds(imageWidth, cropWidth, focusPoint) {
  var leftBound = findLeftBound(imageWidth, cropWidth / 2, focusPoint);
  if (leftBound + cropWidth > imageWidth) {
    return (imageWidth - cropWidth);
  }
  else {
    return leftBound;
  }
}

function imageBounds(imageDimensions, aspectRatio, focusPoint) {
  var expectedHeight, expectedWidth, bound;
  if (imageDimensions[0] * aspectRatio[1] < imageDimensions[1] * aspectRatio[0]) {
    // Use the entire width
    expectedHeight = (imageDimensions[0] * aspectRatio[1]) / aspectRatio[0];
    bound          = findBounds(imageDimensions[1], expectedHeight, focusPoint[1]);
    return [0, Math.round(bound), imageDimensions[0], Math.round(expectedHeight)];
  } else {
    // Use the entire height
    expectedWidth = (imageDimensions[1] * aspectRatio[0]) / aspectRatio[1];
    bound         = findBounds(imageDimensions[0], expectedWidth, focusPoint[0]);
    return [Math.round(bound), 0, Math.round(expectedWidth), imageDimensions[1]];
  }
}

function imgixPath(opts) {
  if(objectEntries(opts || {}).length == 0)
    return "";

  return "?" + objectEntries(opts).map(function(entry) {
    return entry[0] + "=" + encodeURIComponent(Array.isArray(entry[1]) ? entry[1].join(",") : entry[1]);
  }).join("&");
}

function FocusedImage(slug, metadata) {
  this.slug = slug;
  this.metadata = metadata;
}

FocusedImage.prototype.path = function(aspectRatio, opts) {
  rectOpts = {};
  if(this.metadata && this.metadata["height"] && this.metadata["width"] && this.metadata["focus-point"] && aspectRatio && aspectRatio.length > 0 ) {
    rectOpts["rect"] = imageBounds([this.metadata["width"], this.metadata["height"]], aspectRatio, this.metadata["focus-point"]);
  }

  return encodeURIComponent(this.slug) + imgixPath(Object.assign(rectOpts, opts));
}

FocusedImage.imageBounds = imageBounds;

module.exports = FocusedImage;
