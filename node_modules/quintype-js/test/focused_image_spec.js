var assert = require("assert");

var FocusedImage = require("../index").FocusedImage;
var imageBounds = FocusedImage.imageBounds;

describe('FocusedImage', function(){
  describe('of a perfectly sized image', function(){
    it('is the same as the image', function(){
      var image = new FocusedImage("foobar", {width: 1600, height: 900, "focus-point": [800, 450]});
      assert.equal("foobar?rect=0%2C0%2C1600%2C900&w=400", image.path([16,9], {w: 400}));
    });
  });
  describe('when aspect ratio is not provided', function() {
    it('is the full image without the focus point set', function() {
      var image = new FocusedImage("foobar", {width: 1600, height: 900, "focus-point": [800, 450]});
      assert.equal("foobar?w=400", image.path(null, {w: 400}));
    });
  });
});

describe('ImageBounds', function(){
  describe('of a perfectly sized image', function(){
    var image_dimentions = [1600, 900];
    var aspect_ratio = [16, 9];

    it('is the same as the image', function(){
      assert.deepEqual([0, 0, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [0, 0]));
      assert.deepEqual([0, 0, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [1600, 900]));
      assert.deepEqual([0, 0, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [800, 450]));
      assert.deepEqual([0, 0, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [200, 200]));
    });
  });

  describe('of a longer image', function(){
    var image_dimentions = [3200, 900];
    var aspect_ratio = [16, 9];

    it('it takes the left half for a point on the left', function(){
      assert.deepEqual([0, 0, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [0, 0]));
    });

    it('it takes the right half for a point on the right', function(){
      assert.deepEqual([1600, 0, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [3200, 0]));
    });

    it('it takes the center half for a point in the center', function(){
      assert.deepEqual([800, 0, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [1600, 0]));
    });
  });

  describe('of an inverted aspect ratio', function(){
    var image_dimentions = [1600, 1800];
    var aspect_ratio = [16, 9];

    it('it takes the top half for a point on the top', function(){
      assert.deepEqual([0, 0, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [0, 0]));
    });

    it('it takes the middle half for a point on the middle', function(){
      assert.deepEqual([0, 450, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [0, 900]));
    });

    it('it takes the bottom half for a point on the bottom', function(){
      assert.deepEqual([0, 900, 1600, 900], imageBounds(image_dimentions, aspect_ratio, [1600, 1800]));
    });
  });
});
