var index = require('../index');
var tape = require('tape');
var fs = require('fs');
var path = require('path');

var basicFixture = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'basic-rule-set.edges'))
  .toString();

tape('just test it', function(assert) {
  var basic = index(basicFixture);
  var coverage = basic.coverage();
  assert.equal(coverage.abused, 0, 'no abused cells');
  assert.equal(coverage.missed, 391, 'some cells are caught by fallthrough');
  assert.equal(coverage.used, 305, 'some cells are caught by other rules');
  assert.equal(coverage.total, 696, 'lots of cells');
  assert.end();
});
