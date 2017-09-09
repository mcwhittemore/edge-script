module.exports = function(types, rule, opts) {
  return Object.keys(types).every(function(name) {
    var type = types[name];
    var value = opts[name];
    if (typeof value !== type) return false;
    var limit = rule.limits[name];
    if (type === 'number') return checkNumber(limit, value);
    return checkBooleanOrString(limit, value);
  });
};

function checkNumber(limit, value) {
  if (value < limit.min) return false;
  if (value > limit.max) return false;
  return true;
}

function checkBooleanOrString(limit, value) {
  return limit.indexOf(value) !== -1;
}
