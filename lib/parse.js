module.exports = function(script) {
  return script
    .split('\n')
    .reduce(function(memo, line, i) {
      if (line.replace(/ /g, '').slice(0, 2) === '//') return memo;
      if (line.trim() === '') return memo;
      try {
        if (line[0] === ' ') {
          var last = memo[memo.length - 1];
          addLimit(last, line);
        } else {
          memo.push(newRule(line));
        }
        return memo;
      } catch (err) {
        throw new Error(
          'Syntax error at line: ' + i + ' (' + err.message + ')'
        );
      }
    }, [])
    .reduce(function(memo, rule) {
      var name = rule.name;
      delete rule.name;
      memo[name] = rule;
      return memo;
    }, {});
};

function addLimit(rule, line) {
  var parts = line.split(':').map(p => p.trim());
  var name = parts[0];
  var value = parts[1];

  if (value.indexOf('-') !== -1) {
    var vp = value
      .split('-')
      .map(v => v.trim())
      .map(function(v) {
        if (v === 'Infinity') return Infinity;
        if (v === '-Infinity') return -Infinity;
        return parseInt(v);
      });
    if (vp.length > 2)
      throw new Error('Number ranges can only have a min and a max');
    var nan = vp.reduce(function(m, v) {
      if (m) return true;
      return isNaN(v);
    }, false);
    if (nan) throw new Error('Unknown number');
    value = { min: vp[0], max: vp[1] };
  } else {
    value = value.split(',').map(p => p.trim());
  }

  rule.limits[name] = value;
}

function newRule(line) {
  var parts = line.split(':').map(p => p.trim());
  return {
    name: parts[0],
    action: parts[1] || parts[0],
    limits: {}
  };
}
