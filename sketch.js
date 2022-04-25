const _WIDTH = 400;
const _HEIGHT = 400;

const COLS = 40;
const ROWS = 40;

class Grid {
  constructor(ctx, left, top, width, height, rows, cols, drawCell) {
    this.ctx = ctx;
    this.left = left;
    this.top = top;
    this.rows = rows;
    this.cols = cols;
    this.width = width;
    this.height = height;
    this.cellHeight = Math.floor(height / rows);
    this.cellWidth = Math.floor(width / cols);
    this.drawCell = drawCell;
  }

  forEachCellWork(workCell) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let yLoc = i * this.cellHeight;
        let xLoc = j * this.cellWidth;
        workCell(i, j, xLoc, yLoc, this.cellWidth, this.cellHeight);
      }
    }
  }

  forEachCellDraw(drawCell) {
    this.ctx.save();
    this.ctx.translate(this.left, this.top);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let yLoc = i * this.cellHeight;
        let xLoc = j * this.cellWidth;
        drawCell(this.ctx, i, j, xLoc, yLoc, this.cellWidth, this.cellHeight);
      }
    }
    this.ctx.restore();
  }

  drawGrid() {
    // this.ctx.save();
    // this.ctx.translate(this.left, this.top);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let yLoc = i * this.cellHeight;
        let xLoc = j * this.cellWidth;
        this.drawCell(
          this.ctx,
          i,
          j,
          xLoc,
          yLoc,
          this.cellWidth,
          this.cellHeight
        );
      }
    }
    // this.ctx.restore();
  }
}

const simplex = new SimplexNoise();
const params = {
  cols: COLS,
  rows: ROWS,
  freqX: 34,
  freqY: 44,
  freqT: 120,
  frameRate: 60,
  animate: true,
  draw: 'both',
  amplitude: 220,
  hue: 360,
  saturation: 79,
  lightness: 79,
};

let lastFrameRate = params.frameRate;
let lastDraw = params.draw;
let lastRows = params.rows;
let lastCols = params.cols;

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid ' });

  folder.addInput(params, 'cols', { min: 2, max: 50, step: 1 });
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 });

  folder = pane.addFolder({ title: 'Noise' });
  folder.addInput(params, 'freqX', { min: 1, max: 1000, step: 1 });
  folder.addInput(params, 'freqY', { min: 1, max: 1000, step: 1 });
  folder.addInput(params, 'freqT', { min: 1, max: 1000, step: 1 });
  folder.addInput(params, 'frameRate', { min: 1, max: 60, step: 1 });
  folder.addInput(params, 'animate');
  folder.addInput(params, 'draw', {
    options: { rec: 'rect', circle: 'circle', both: 'both' },
  });

  folder = pane.addFolder({ title: 'Color' });
  folder.addInput(params, 'hue', { min: 0, max: 360, step: 1 });
  folder.addInput(params, 'saturation', { min: 0, max: 100, step: 1 });
  folder.addInput(params, 'lightness', { min: 0, max: 100, step: 1 });
  folder.addInput(params, 'amplitude', { min: 0, max: 360, step: 1 });
};

createPane();

function drawCell(ctx, i, j, x, y, w, h) {
  //const n = simplex.noise3D(timeX, timeY, timeZ);
  // const n = noise(timeX, timeY, timeZ);
  const n = noise(
    i / params.freqX,
    j / params.freqY,
    frameCount / params.freqT
  );
  let hue = map(n, 0, 1, 180, 360, true);
  const fromHue = params.hue - params.amplitude / 2;
  const toHue = params.hue + params.amplitude / 2;
  hue = map(n, 0, 1, fromHue, toHue, true);
  if (hue < 0) {
    hue = hue * -1;
  }
  if (hue > 360) {
    hue = hue - 360;
  }
  fill(hue, params.saturation, params.lightness);
  if (params.draw === 'rect' || params.draw === 'both') {
    rect(x, y, w, h);
  }
  if (params.draw === 'circle' || params.draw === 'both') {
    circle(x + w / 2, y + h / 2, w - 1);
  }
}

let grid;

function setup() {
  createCanvas(_WIDTH, _HEIGHT);
  colorMode(HSL, 360, 100, 100, 100);
  frameRate(60);
  noStroke();
  grid = new Grid(
    drawingContext,
    0,
    0,
    _WIDTH,
    _HEIGHT,
    params.rows,
    params.cols,
    drawCell
  );
}

function draw() {
  if (params.animate) {
    if (lastCols !== params.cols || lastRows !== params.rows) {
      background(0, 0, 100);
      grid = new Grid(
        drawingContext,
        0,
        0,
        _WIDTH,
        _HEIGHT,
        params.rows,
        params.cols,
        drawCell
      );
      lastCols = params.cols;
      lastRows = params.rows;
    }
    if (params.frameRate !== lastFrameRate) {
      lastFrameRate = params.frameRate;
      frameRate(lastFrameRate);
    }
    if (lastDraw !== params.draw) {
      lastDraw = params.draw;
      background(0, 0, 100);
    }
    grid.drawGrid();
  }
}
