var parse = require('./lib/parse');
var match = require('./lib/match');

module.exports = function(script) {
  var { rules, types } = parse(script);
  var ruleNames = Object.keys(rules);

  var api = {};

  api.getAction = function(opts) {
    var rule = api.getRule(opts);
    if (rule === null) return null;
    return rules[rule].action;
  };

  api.getRule = function(opts) {
    for (var i = 0; i < ruleNames.length; i++) {
      var ruleName = ruleNames[i];
      if (ruleName === 'fallback') continue;
      var rule = rules[ruleName];
      if (match(types, rule, opts)) return rule;
    }
    if (match(types, rules.fallback, opts)) return rules.fallback;
    return null;
  };

  return api;
};
