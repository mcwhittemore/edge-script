var tape = require('tape');
var match = require('../lib/match');

tape('string hits string', function(assert) {
  var types = {
    string: 'string'
  };
  var rule = {
    limits: {
      string: ['string']
    }
  };

  var opts = {
    string: 'string'
  };

  assert.ok(match(types, rule, opts));
  assert.end();
});
