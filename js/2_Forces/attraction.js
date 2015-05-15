/*global Sketch ui */

function Mover(mass, x, y, opts) {
    opts = opts || {};
    this.location = new Sketch.vector2(x, y);
    this.velocity = new Sketch.vector2(4, 0);
    this.acceleration = new Sketch.vector2(0, 0);
    this.mass = mass;
    this.size = mass;
    this.color = opts.color || "gray";
}

Mover.prototype.draw = function(sketch) {
    sketch.circle(this.size, this.location, {color: this.color});
};

Mover.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
};

Mover.prototype.applyForce = function(force) {
    var f = Sketch.vector2.div(force, this.mass * params.massFactor);
    this.acceleration.add(f);
};

function Attractor(mass, x, y, opts) {
    opts = opts || {};
    this.location = new Sketch.vector2(x, y);
    this.mass = this.size = mass;
    this.color = opts.color || "gray";
};

Attractor.prototype.draw = function(sketch) {
    sketch.circle(this.size, this.location, {color: this.color});
};

Attractor.prototype.attract = function(m) {
    var G = params.G;
    var f = Sketch.vector2.subtract(this.location, m.location);
    var d = f.mag();
    d = Math.constrain(d, 5, 10);

    f.normalize();
    var str = (G * this.mass * m.mass) / (d * d);

    f.mult(str);

    return f;
};

Attractor.prototype.isClicked = function(s) {
    var r = this.size / 2;
    if (s.mouse.radius) r += s.mouse.radius;

    if (s.mouse.pressed > 0
        && s.mouse.x >= this.location.x - r
        && s.mouse.x <= this.location.x + r
        && s.mouse.y >= this.location.y - r
        && s.mouse.y <= this.location.y + r) {
        return true;
    }

    return false;
};

Attractor.prototype.beginDrag = function(s) {
    this.color = '#333';
    this.dragging = true;
};

Attractor.prototype.stopDrag = function(s) {
    this.dragging = false;
    this.color = 'gray';
};

Attractor.prototype.drag = function(s) {
    if (s.mouse.pressed === 0 ) {
        this.stopDrag();
        return;
    }

    this.location.x = s.mouse.x;
    this.location.y = s.mouse.y;
};

var DRAW_MODE = false;
var s;
var ms = [];
var as = [];

function setup() {
    DRAW_MODE = false;
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 900, 600);

    s.background('#ddd');

    for (var i = 0; i < 20; i++) {
        var mass = Math.constrain(20 * Math.random(), 3, 10);
        ms.push(new Mover(mass, s.width * Math.random(), s.height * Math.random()));
    }

    as[0] = new Attractor(20, s.width / 2, s.height / 2);
    s.onTick = draw;
}

function addAttractor() {
    as.push(new Attractor(20, Math.randomRange(0, s.width), Math.randomRange(0, s.height)));
}

function draw(s) {
    var a;

    s.clear();
    s.ctx.globalAlpha = 0.8;

    for (var i = 0; i < as.length; i++) {
        a = as[i];
        if (a.dragging) {
            a.drag(s);
        } else if (a.isClicked(s)) {
            a.beginDrag();
        }
    }

    for (i = 0; i < ms.length; i++) {
        var m = ms[i];
        for (var j = 0; j < as.length; j++) {
            a = as[j];
            a.draw(s);
            var attraction = a.attract(m);
            m.applyForce(attraction);
        }
        m.update();
        m.draw(s);
    }
}

function drawTick() {
    var imageData = s.ctx.getImageData(0, 0, s.width, s.height);
    var buf = new ArrayBuffer(imageData.data.length);
    var buf8 = new Uint8ClampedArray(buf);
    var data = new Uint32Array(buf);

    s.onTick =
        function (s) {

            for (var i = 0; i < ms.length; i++) {
                var p = ms[i];

                for (var j = 0; j < as.length; j++) {
                    var a = as[j];
                    var attraction = a.attract(p);
                    p.applyForce(attraction);
                }

                p.update();

                var color = 0;
                data[Math.round(p.location.y) * s.width + Math.round(p.location.x)] =
                    (200   << 24) |  // alpha
                    (color << 16) |   // blue
                    (color <<  8) |   // green
                    color;            // red
            }

            imageData.data.set(buf8);
            s.ctx.putImageData(imageData, 0, 0);
        };
}

function setDrawMode(mode) {
    if (mode && !DRAW_MODE) {
        s.clear();
        s.background('#fff');
        drawTick();
    } else if (!mode && DRAW_MODE) {
        s.clear();
        s.background('#ddd');
        s.onTick = draw;
    }
    DRAW_MODE = mode;
}

function reset() {
    ms = [];
    as = [];
    setup();
}

var params = {};

if (ui.live) {
    ui.bindModelInput(params, 'G', document.getElementById('gravity'));
    ui.bindModelInput(params, 'massFactor', document.getElementById('mass'));
    ui.setup();
} else {
    params.massFactor = 1;
    params.G = 1;
    setup();
}
