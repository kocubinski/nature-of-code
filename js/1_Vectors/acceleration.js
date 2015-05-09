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

function setup() {
    m = new Mover();
    s = s || new Sketch.sketch('canvas', 600, 600);
    s.background('#ddd');
    s.onTick = draw;
    //m.draw(s);
}

function draw(sketch) {
    sketch.clear();
    m.location.x += 5;
    m.checkEdges(sketch);
    m.draw(sketch);
}

document.addEventListener('DOMContentLoaded', function(e) {
    setup();
});

if (s) {
    setup();
}
