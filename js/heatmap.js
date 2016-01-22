/*global Sketch Touch */

var size = window.isMobile() ? 300 : 400;
var heatmap = [];
var index = 0;
var s, g;

function setup() {
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', size, size);

    g = new Color.gradient();
    g.add(0, 0, 0);
    g.add(102, 0, 102);
    g.add(0, 144, 255);
    g.add(0, 255, 207);
    g.add(51, 204, 102);
    g.add(111, 255, 0);
    g.add(191, 255, 0);
    g.add(255, 240, 0);
    g.add(255, 153, 102);
    g.add(204, 51, 0);
    g.add(153, 0, 0);

    // g.colors.forEach(function (c, i) {
    //     var height = s.height / g.colors.length;
    //     s.rectangle(0, i * height, s.width, height,
    //                 {color: 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')'});
    // });

    // double buffering
    heatmap[0] = [];
    heatmap[1] = [];
    for (var i = 0; i < size; i++) {
        heatmap[0][i] = [];
        heatmap[1][i] = [];
        for (var j = 0; j < size; j++) {
            heatmap[0][i][j] = 0.0;
            heatmap[1][i][j] = 0.0;
        }
    }

    tick();
}

function draw(s) {
}

function tick() {
    var imageData = s.ctx.getImageData(0, 0, s.width, s.height),
        buf = new ArrayBuffer(imageData.data.length),
        buf8 = new Uint8ClampedArray(buf),
        data = new Uint32Array(buf),
        touch = new Touch(s.ctx.elem);

    s.onTick =
        function (s) {


            if (s.mouse.pressed > 0) {
                var x = Math.round(s.mouse.x),
                    y = Math.round(s.mouse.y),
                    r = s.mouse.radius ? Math.round(s.mouse.radius) : 16,
                    r = r % 2 == 0 ? r : r + 1,
                    d = s.mouse.pressed == 1 ? 0.5 : -0.5;
                if (s.mouse.isTouch) {
                    r *= 8;
                    d *= 4;
                }
                //console.log(x, y, r);
                // console.log(s.mouse);
                applyHeat(x, y, r, d);
            }

            updateHeatmap();

            var width = s.width;
            var big = function() {
                var map = heatmap[index];
                for (x = 0; x < size; x++) {
                    var row = map[x];
                    for (y = 0; y < size; y++) {
                        var color = g.get(row[y]);
                        data[y * width + x] =
                            (255     << 24) |  // alpha
                            (color.b << 16) |  // blue
                            (color.g <<  8) |  // green
                            color.r;          // red
                    }
                }
            };
            big();

            imageData.data.set(buf8);
            s.ctx.putImageData(imageData, 0, 0);
        };
}

function updateHeatmap() {
    // Calculate the new heat value for each pixel
    var map = heatmap[index ^ 1];
    var _map = heatmap[index];

    for(var i = 0; i < size; i++) {
        var row = map[i];
        for(var j = 0; j < size; j++) {
            row[j] = calcPixel(i, j, _map);
        }
    }

    // flip the index to the next heatmap
    index ^= 1;
}

function calcPixel(i, j, heatmap) {
    var total = 0.0;
    var count = 0;

    for(var ii = -1; ii < 2; ii++) {
        for(var jj = -1; jj < 2; jj++) {
            var row = heatmap[i + ii];
            if(i + ii < 0 || i + ii >= s.width || j + jj < 0 || j + jj >= s.height)
                continue;

            ++count;
            total += row[j + jj];
        }
    }

    // return the average
    return total / count;
}

function applyHeat(i, j, r, delta) {
    // apply delta heat (or remove it) at location
    // (i, j) with radius r
    var h = heatmap[index];
    for (var ii = -(r / 2); ii < (r / 2); ii++) {
        var x = i + ii;
        var row = h[x];
        for (var jj = -(r / 2); jj < (r / 2); jj++) {
            var y = j + jj;

            if (x < 0 || x >= s.width || y < 0 || y >= s.height)
                continue;

            // apply the heat
            row[y] += delta;
            row[y] = Math.constrain(row[y], 0.0, 20.0);
        }
    }
}

setup();
