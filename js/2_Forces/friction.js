function Mover(mass, x, y) {
    this.location = new Sketch.vector2(x, y);
    this.velocity = new Sketch.vector2(0, 0);
    this.acceleration = new Sketch.vector2(0, 0);
    this.mass = mass;
    this.size = mass * 2;
}

Mover.prototype.draw = function(sketch) {
    sketch.circle(this.size, this.location, {color: "green"});
};

Mover.prototype.update = function() {
    this.location.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
};

Mover.prototype.applyForce = function(force) {
    var f = Sketch.vector2.div(force, this.mass);
    this.acceleration.add(f);
};

Mover.prototype.checkEdges = function(sketch) {
    var s = sketch;
    var bouncyness = 1;

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

var s;
var ms = [];

function helium(mover) {
    mover.applyForce(new Sketch.vector2(0, -0.2));
}

function setup() {
    for (var i = 0; i < 20; i++) {
        var mass = 20 * Math.random();
        if (mass < 0.5) mass = 0.5;
        ms.push(new Mover(mass, 30, 30));
    }

    s = s || new Sketch.sketch('canvas', 900, 600);
    s.background('#ddd');
    s.onTick = draw;
}

function draw(sketch) {
    sketch.clear();

    var wind = new Sketch.vector2(0.02, 0);
    var gravity = new Sketch.vector2(0, 0.3);

    for (var i = 0; i < ms.length; i++) {
        var c = 0.01;
        var normal = 1;
        var frictionMag = c * normal;

        var m = ms[i];
        var friction = m.velocity.get();
        friction.mult(-1);
        friction.normalize();
        friction.mult(frictionMag);

        m.applyForce(wind);
        var g = Sketch.vector2.mult(gravity, m.mass);
        m.applyForce(gravity);
        m.applyForce(friction);
        m.checkEdges(sketch);

        m.update();
        m.draw(sketch);
    }
}

document.addEventListener('DOMContentLoaded', function(e) {
    setup();
});

setup();
