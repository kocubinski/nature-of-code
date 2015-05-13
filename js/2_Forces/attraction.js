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

var s, a;
var ms = [];

function setup() {
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 900, 600);

    s.background('#ddd');

    for (var i = 0; i < 20; i++) {
        var mass = Math.constrain(20 * Math.random(), 3, 10);
        ms.push(new Mover(mass, s.width * Math.random(), s.height * Math.random()));
    }

    a = new Attractor(20, s.width / 2, s.height / 2);
    s.onTick = draw;
}

function draw(s) {
    s.clear();
    s.ctx.globalAlpha = 0.8;

    if (a.dragging) {
        a.drag(s);
    } else if (a.isClicked(s)) {
        a.beginDrag();
    }

    a.draw(s);

    for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        var attraction = a.attract(m);
        m.applyForce(attraction);
        m.update();
        m.draw(s);
    }
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

function reset() {
    ms = [];
    setup();
}
