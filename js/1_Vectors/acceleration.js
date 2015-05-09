function Mover() {
    this.location = new Sketch.vector2(100, 100);
    this.velocity = new Sketch.vector2(0, 0);
    this.acceleration = new Sketch.vector2(0, 0);
    this.size = 20;
}

Mover.prototype.draw = function(sketch) {
    sketch.circle(this.size, this.location, {color: "green"});
};

Mover.prototype.update = function() {
    this.velocity.limit(5);
    this.location.add(this.velocity);
    this.velocity.add(this.acceleration);
};

Mover.prototype.checkEdges = function(sketch) {
    var s = sketch;

    if (this.location.x > s.width) {
      this.location.x = 0;
    } else if (this.location.x < 0) {
      this.location.x = s.width;
    }

    if (this.location.y > s.height) {
      this.location.y = 0;
    } else if (this.location.y < 0) {
      this.location.y = s.height;
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

function setup() {
    m = new Mover();
    s = s || new Sketch.sketch('canvas', 600, 600);
    s.background('#ddd');
    s.onTick = draw;
    //m.draw(s);
}

function draw(sketch) {
    sketch.clear();
    //m.acceleration = new Sketch.vector2(0.1, 0);
    accelerateToMouse(m, sketch.mouse);
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
