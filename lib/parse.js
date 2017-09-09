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
    .reduce(
      function(memo, rule) {
        var name = rule.name;
        delete rule.name;
        memo[0][name] = rule;
        return memo;
      },
      [{}]
    )
    .reduce(function(memo, rules) {
      if (rules.fallback === undefined)
        throw new Error('Rule fallback is required');

      var types = Object.keys(rules.fallback.limits).reduce(function(
        memo,
        name
      ) {
        var base = rules.fallback.limits[name];

        if (!Array.isArray(base)) {
          memo[name] = 'number';
        } else {
          var id = base.join(',');
          if (id === 'false,true') {
            memo[name] = 'boolean';
            rules.fallback.limits[name] = [false, true];
          } else memo[name] = 'string';
        }

        return memo;
      }, {});

      var constraints = rules.fallback.limits;
      Object.keys(rules).forEach(function(name) {
        if (name === 'fallback') return;
        Object.keys(rules[name].limits).forEach(function(limitName) {
          if (types[limitName] === undefined)
            throw new Error(
              `Rule ${name} has a limit (${limitName}) not found in fallback`
            );

          var limit = rules[name].limits[limitName];
          var type = types[limitName];
          try {
            if (type === 'number')
              limit = checkNumber(limit, constraints[limitName]);
            if (type === 'boolean') limit = checkBoolean(limit);
            if (type === 'string') {
              limit = checkString(limit, constraints[limitName]);
            }
          } catch (err) {
            throw new Error(
              `Rule ${name} has a limit (${limitName}) ${err.message}`
            );
          }
          rules[name].limits[limitName] = limit;
        });
      });

      return {
        rules,
        types
      };
    }, {});
};

function checkNumber(limit, constraint) {
  if (typeof limit !== 'object')
    throw new Error('that should be a number but is not');
  if (limit.min < constraint.min)
    throw new Error('with its min below the fallback min');
  if (limit.max < constraint.min)
    throw new Error('with its max below the fallback min');
  if (limit.min > constraint.max)
    throw new Error('with its min above the fallback max');
  if (limit.max > constraint.max)
    throw new Error('with its max above the fallback max');
  return limit;
}

function checkBoolean(limit) {
  var id = limit.join(',');
  if (id === 'false') return [false];
  if (id === 'true') return [true];
  if (id === 'false,true') return [false, true];
  throw new Error('with non boolean values');
}

function checkString(limit, constraint) {
  if (limit[0] === '*') return constraint;
  limit.forEach(function(s) {
    if (constraint.indexOf(s) === -1)
      throw new Error(`with a value (${s}) not in the fallback enum`);
  });
  return limit;
}

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
    value = { min: vp[0], max: vp[1] || vp[0] };
    if (value.min > value.max) throw new Error('min cannot be bigger than max');
  } else {
    value = value
      .split(',')
      .map(p => p.trim())
      .sort();
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
