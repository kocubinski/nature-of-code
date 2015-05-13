function Mover(x, y) {
    this.location = new Sketch.vector2(x, y);
    this.velocity = new Sketch.vector2(0, 0);
    this.acceleration = new Sketch.vector2(0, 0);
    this.size = 20;
}

Mover.prototype.draw = function(sketch) {
    sketch.circle(this.size, this.location, {color: "green"});
};

Mover.prototype.update = function() {
    this.location.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);
};

Mover.prototype.applyForce = function(f) {
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
        this.location.y = s.width;
        this.velocity.y *= -bouncyness;
    } else if (this.location.y < 0) {
        this.location.y = 0;
        this.velocity.y *= -bouncyness;
    }
};

var s, m;

function accelerateToMouse(mover, mouse) {
    if (!mouse) return;
    var a = new Sketch.vector2(mouse.x - m.location.x, mouse.y - m.location.y);
    a.normalize();
    a.mult(0.3);
    mover.acceleration = a;
}

function helium(mover) {
    mover.applyForce(new Sketch.vector2(0, -0.2));
}

function setup() {
    m = new Mover(600 / 2, 600);
    s = s || new Sketch.sketch('canvas', 600, 600);
    s.background('#ddd');
    s.onTick = draw;
    //m.draw(s);
}

function draw(sketch) {
    sketch.clear();

    var wind = new Sketch.vector2(0.5, 0);
    console.log(sketch.mouse);
    if (sketch.mouse && sketch.mouse.pressed > 0) {
        m.applyForce(wind);
    }
    helium(m);
    m.checkEdges(sketch);
    m.update();
    m.draw(sketch);
}

document.addEventListener('DOMContentLoaded', function(e) {
    setup();
});

if (s) {
    setup();
}
