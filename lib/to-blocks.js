module.exports = function(types, rule) {
  var keys = Object.keys(types);
  return blocker([{}], 0, keys, types, rule.limits).reduce(function(m, limits) {
    var name = toId(keys, types, limits);
    m[name] = {
      action: name,
      limits: limits
    };
    return m;
  }, {});
};

function toId(keys, types, limits) {
  return keys
    .map(l => {
      var v = types[l] === 'number' ? limits[l].min : limits[l][0];
      return `${l}:${v}`;
    })
    .join(',');
}

function blocker(input, i, keys, types, limits) {
  var key = keys[i];
  var type = types[key];
  var limit = limits[key];
  var values = toList(type, limit);
  var strs = input.map(JSON.stringify);
  var outs = values.reduce(function(m, v) {
    strs.forEach(function(s) {
      var j = JSON.parse(s);
      j[key] = v;
      m.push(j);
    });
    return m;
  }, []);

  if (i === keys.length - 1) return outs;
  return blocker(outs, i + 1, keys, types, limits);
}

function toList(type, limit) {
  if (type !== 'number') return limit.map(v => [v]);
  var out = [];
  for (var i = limit.min; i <= limit.max; i++) {
    out.push({ min: i, max: i });
  }
  return out;
}
