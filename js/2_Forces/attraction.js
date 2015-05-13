/*global Sketch */

function Mover(mass, x, y, opts) {
    opts = opts || {};
    this.location = new Sketch.vector2(x, y);
    this.velocity = new Sketch.vector2(2, 0);
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
    var f = Sketch.vector2.div(force, this.mass);
    this.acceleration.add(f);
};

Mover.prototype.checkEdges = function(sketch) {
    var s = sketch;
    var bouncyness = 0.7;

    if (this.location.x > s.width) {
        this.location.x = s.width;
        this.velocity.x *= -bouncyness;
    } else if (this.location.x < 0) {
        this.location.x = 0;
        this.velocity.x *= -bouncyness;
    }

    if (this.location.y > s.height) {
        this.location.y = s.height;
        this.velocity.y *= -bouncyness;
    } else if (this.location.y < 0) {
        this.location.y = 0;
        this.velocity.y *= -bouncyness;
    }
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
    var G = 1;
    var f = Sketch.vector2.subtract(this.location, m.location);
    var d = f.mag();
    d = Math.constrain(d, 5, 20);

    f.normalize();
    var str = (G * this.mass * m.mass) / (d * d);

    f.mult(str);

    return f;
};

var s, a;
var ms = [];

function setup() {
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 900, 600);
    for (var i = 0; i < 20; i++) {
        var mass = Math.constrain(20 * Math.random(), 3, 10);
        ms.push(new Mover(mass, s.width * Math.random(), s.height * Math.random()));
    }
    //m = new Mover(10, s.width / 2 + 60, s.height / 2 + 60);
    //m = new Mover(20, 400, 50);

    a = new Attractor(20, s.width / 2, s.height / 2);
    s.onTick = draw;
}

function draw(s) {
    s.clear();
    s.ctx.globalAlpha = 0.8;

    a.draw(s);

    for (var i = 0; i < ms.length; i++) {
        var m = ms[i];
        var attraction = a.attract(m);
        m.applyForce(attraction);
        m.update();
        m.draw(s);
    }
}

setup();
