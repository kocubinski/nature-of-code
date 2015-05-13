/*global Sketch */

function Mover(mass, x, y) {
    this.location = new Sketch.vector2(x, y);
    this.velocity = new Sketch.vector2(0, 0);
    this.acceleration = new Sketch.vector2(0, 0);
    this.mass = mass;
    this.size = mass * 2;
}

Mover.prototype.draw = function(sketch) {
    //sketch.circle(this.size, this.location, {color: "cyan"});
    sketch.rectangle(this.location.x, this.location.y,
                     this.size, this.size, {color: "cyan"});
};

Mover.prototype.update = function() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.velocity.limit(10);
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

function Resistance(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
}

Resistance.prototype.draw = function(sketch) {
    sketch.rectangle(this.x, this.y, this.w, this.h, {color: "#bbb" });
};

Resistance.prototype.isInside = function(l, a) {
    return l.x >= this.x && l.y >= this.y;
};

Resistance.prototype.drag = function(m) {
    var speed = m.velocity.mag();
    var a = m.size / 10;
    a = 1;
    var dragMagnitude = this.c * speed * speed * a;
    console.log(dragMagnitude);
    var drag = m.velocity.get();
    drag.mult(-1);
    drag.normalize();
    drag.mult(dragMagnitude);
    m.applyForce(drag);
};

var width = 900;
var height = 600;
var liquid = new Resistance(0, height/2, width, height/2, 0.3);
var s;
var ms = [];


function setup() {
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 900, 600);

    for (var i = 0; i < 20; i++) {
        var mass = Math.constrain(20 * Math.random(), 3, 40);
        ms.push(new Mover(mass, i * (s.width / 20), 0));
    }

    //s.background('#eee');
    s.onTick = function(s) { draw(s); };
    //s.onTick = draw;
}

function draw(sketch) {
    sketch.clear();
    liquid.draw(sketch);

    var gravity = new Sketch.vector2(0, 0.3);
    for (var i = 0; i < ms.length; i++) {
        var m = ms[i];

        if (liquid.isInside(m.location)) {
            liquid.drag(m);
        }

        var g = Sketch.vector2.mult(gravity, m.mass);
        m.applyForce(g);

        m.checkEdges(sketch);
        m.update();
        m.draw(sketch);
    }
}

setup();
