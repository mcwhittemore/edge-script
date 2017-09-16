const ndarray = require('ndarray');
const savePixels = require('save-pixels');
const fs = require('fs');

const parse = require('../lib/parse');
const fallbackCoverage = require('../lib/fallback-coverage');

const inFile = fs.readFileSync(process.argv[2]).toString();
const outFilePath = process.argv[3];

const { types, rules } = parse(inFile);
const report = fallbackCoverage(types, rules);

const unitNames = Object.keys(report);

const BLOCK_SIZE = 10;
const SCALE = Math.ceil(Math.pow(unitNames.length, 0.5));
const EDGE_SIZE = SCALE * BLOCK_SIZE;

const img = ndarray([], [EDGE_SIZE, EDGE_SIZE, 3]);

unitNames.forEach(function(name, i) {
  let y = Math.floor(i / SCALE) * BLOCK_SIZE;
  let x = Math.floor(i % SCALE) * BLOCK_SIZE;
  var color = report[name].length === 0 ? [255, 0, 0] : [0, 255, 0];
  for (var xa = 0; xa < BLOCK_SIZE; xa++) {
    for (var ya = 0; ya < BLOCK_SIZE; ya++) {
      for (var c = 0; c < 3; c++) {
        img.set(x + xa, y + ya, c, color[c]);
      }
    }
  }
});

savePixels(img, 'jpg').pipe(fs.createWriteStream(outFilePath));
