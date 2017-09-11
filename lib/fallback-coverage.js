var toBlocks = require('./to-blocks');

module.exports = function(types, rules) {
  var all = Object.keys(toBlocks(types, rules.fallback)).reduce(function(m, n) {
    m[n] = [];
    return m;
  }, {});

  Object.keys(rules).forEach(function(n) {
    if (n === 'fallback') return;
    Object.keys(toBlocks(types, rules[n])).forEach(function(allName) {
      all[allName].push(n);
    });
  });

  return all;
};
