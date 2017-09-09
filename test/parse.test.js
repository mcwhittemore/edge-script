var tape = require('tape');
var fs = require('fs');
var path = require('path');
var parse = require('../lib/parse');

var basicFixture = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'basic-rule-set.edges'))
  .toString();

tape('parsing the basic fixture', function(assert) {
  var rules = parse(basicFixture);

  assert.ok(typeof rules === 'object');
  var ruleNames = Object.keys(rules);

  assert.deepEquals(ruleNames, ['fallback', 'first', 'second']);

  var actionNames = ruleNames.map(function(name) {
    return rules[name].action;
  });

  assert.deepEquals(actionNames, ['fallback', 'first', 'customNamedAction']);

  assert.deepEquals(rules.fallback.limits.duration, { min: 0, max: Infinity });
  assert.deepEquals(rules.first.limits.duration, { min: 0, max: 100 });
  assert.deepEquals(rules.second.limits.duration, { min: 50, max: 100 });

  assert.deepEquals(rules.fallback.limits.hasHighway, [true, false]);
  assert.deepEquals(rules.first.limits.hasHighway, [true]);
  assert.deepEquals(rules.second.limits.hasHighway, [false]);

  assert.deepEquals(rules.fallback.limits.type, [
    'preturn',
    'turn',
    'postturn'
  ]);
  assert.deepEquals(rules.first.limits.type, ['preturn', 'turn']);
  assert.deepEquals(rules.second.limits.type, ['preturn', 'turn', 'postturn']);

  assert.end();
});
