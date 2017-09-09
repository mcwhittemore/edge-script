var parse = require('./lib/parse');
var match = require('./lib/match');

module.exports = function(script) {
  var rules = parse(script);
  var ruleNames = Object.keys(rules);

  var api = {};

  api.getAction = function(opts) {
    var rule = api.getRule(opts);
    return rules[rule].action;
  };

  api.getRule = function(opts) {
    for (var i = 0; i < ruleNames.length; i++) {
      var ruleName = ruleNames[i];
      if (ruleName === 'default') continue;
      var rule = rules[ruleName];
      if (match(rule, opts)) return rule;
    }
    return rules['default'];
  };

  return api;
};
