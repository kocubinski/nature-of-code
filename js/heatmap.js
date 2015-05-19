/*global Sketch */
var Color = Color ||
        function(r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
        };

Color.lerp = function(c1, c2, amt) {
    amt = Math.constrain(amt, 0, 1);
    var lerp = function(a, b, u) {
        return (1 - u) * a + u * b;
    };
    return new Color(lerp(c1.r, c2.r, amt),
                     lerp(c1.g, c2.g, amt),
                     lerp(c1.b, c2.b, amt));
};

Color.gradient = function() {
    this.colors = [];
};

Color.gradient.prototype.add = function(r, g, b) {
    this.colors.push(new Color(r, g, b));
};

Color.gradient.prototype.get = function(val) {
    var cs = this.colors;
    if (cs.length == 0)
        return new Color(0, 0, 0);

    if (val <= 0.0)
        return cs[0];

    if (val >= cs.length - 1)
        return cs[cs.length - 1];

    var i = Math.floor(val);
    var c1 = cs[i];
    var c2 = cs[i + 1];
    var amt = val - i;
    //console.log(val, i, amt);
    return Color.lerp(c1, c2, val - i);
};

var size = 400;
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
        data = new Uint32Array(buf);

    s.onTick =
        function (s) {

            if (s.mouse.pressed > 0) {
                var x = Math.round(s.mouse.x),
                    y = Math.round(s.mouse.y),
                    r = s.mouse.radius ? Math.round(s.mouse.radius) : 16,
                    r = r % 2 == 0 ? r : r + 1,
                    d = s.mouse.pressed == 1 ? 0.5 : -0.5;
                console.log(x, y);
                applyHeat(x, y, r, d);
            }

            updateHeatmap();

            for (x = 0; x < size; x++) {
                var row = heatmap[index][x];
                for (y = 0; y < size; y++) {
                    var color = g.get(heatmap[index][x][y]);
                    data[y * s.width + x] =
                        (255     << 24) |  // alpha
                        (color.b << 16) |  // blue
                        (color.g <<  8) |  // green
                         color.r;          // red
                }
            }

            imageData.data.set(buf8);
            s.ctx.putImageData(imageData, 0, 0);
        };
}

function updateHeatmap() {
    // Calculate the new heat value for each pixel
    for(var i = 0; i < size; i++)
        for(var j = 0; j < size; j++)
            heatmap[index ^ 1][i][j] = calcPixel(i, j);

    // flip the index to the next heatmap
    index ^= 1;
}

function calcPixel(i, j) {
    var total = 0.0;
    var count = 0;

    for(var ii = -1; ii < 2; ii++) {
        for(var jj = -1; jj < 2; jj++) {
            if(i + ii < 0 || i + ii >= s.width || j + jj < 0 || j + jj >= s.height)
                continue;

            ++count;
            total += heatmap[index][i + ii][j + jj];
        }
    }

    // return the average
    return total / count;
}

function applyHeat(i, j, r, delta) {
    // apply delta heat (or remove it) at location
    // (i, j) with radius r
    for (var ii = -(r / 2); ii < (r / 2); ii++) {
        for (var jj = -(r / 2); jj < (r / 2); jj++) {

            if (i + ii < 0 || i + ii >= s.width || j + jj < 0 || j + jj >= s.height)
                continue;

            // apply the heat
            var x = i + ii;
            var y = j + jj;
            var h = heatmap[index];
            heatmap[index][i + ii][j + jj] += delta;
            heatmap[index][i + ii][j + jj] = Math.constrain(heatmap[index][i + ii][j + jj], 0.0, 20.0);
        }
    }
}

setup();
