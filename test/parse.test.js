var tape = require('tape');
var fs = require('fs');
var path = require('path');
var parse = require('../lib/parse');

var basicFixture = fs
  .readFileSync(path.join(__dirname, 'fixtures', 'basic-rule-set.edges'))
  .toString();

tape('parsing the basic fixture', function(assert) {
  try {
    var parsed = parse(basicFixture);
  } catch (err) {
    return assert.end(err);
  }

  var rules = parsed.rules;

  assert.ok(typeof rules === 'object');
  var ruleNames = Object.keys(rules);

  assert.deepEquals(ruleNames, ['fallback', 'first', 'second']);

  var actionNames = ruleNames.map(function(name) {
    return rules[name].action;
  });

  assert.deepEquals(actionNames, ['fallback', 'first', 'customNamedAction']);

  check(assert, rules, 'duration', {
    fallback: { min: 0, max: Infinity },
    first: { min: 0, max: 100 },
    second: { min: 50, max: 100 }
  });

  check(assert, rules, 'hasHighway', {
    fallback: [false, true],
    first: [true],
    second: [false]
  });

  check(assert, rules, 'type', {
    fallback: ['postturn', 'preturn', 'turn'],
    first: ['preturn', 'turn'],
    second: ['postturn', 'preturn', 'turn']
  });

  assert.end();
});

function check(assert, rules, limitName, values) {
  Object.keys(values).forEach(function(ruleName) {
    assert.deepEqual(
      rules[ruleName].limits[limitName],
      values[ruleName],
      `${ruleName} should have expected value for ${limitName}`
    );
  });
}
