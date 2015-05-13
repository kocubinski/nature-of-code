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
    this.velocity.add(this.acceleration);
    this.velocity.limit(5);
    this.location.add(this.velocity);
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
    if (!mouse.x) return;
    var a = new Sketch.vector2(mouse.x - m.location.x, mouse.y - m.location.y);
    a.normalize();
    a.mult(0.3);
    mover.acceleration = a;
}

function setup() {
    m = new Mover();
    s = s || new Sketch.sketch('canvas', 900, 600);
    s.background('#ddd');
    s.onTick = draw;
}

function draw(sketch) {
    sketch.clear();
    accelerateToMouse(m, sketch.mouse);
    //console.log(m.location);
    m.checkEdges(sketch);
    m.update();
    m.draw(sketch);
}
