/*global Sketch ui */

function Mover(mass, x, y, opts) {
    opts = opts || {};
    this.location = new Sketch.vector2(x, y);
    this.velocity = new Sketch.vector2(0, 0);
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
    this.velocity.limit(10);
    this.acceleration.mult(0);
};

Mover.prototype.attract = function(m) {
    var f = Sketch.vector2.subtract(this.location, m.location);
    var d = f.mag();
    d = Math.constrain(d, 5.0, 25.0);
    f.normalize();

    var str = (params.G * this.mass * m.mass) / (d * d);
    f.mult(-str);
    return f;
};

Mover.prototype.applyForce = function(force) {
    var f = Sketch.vector2.div(force, this.mass * params.massFactor);
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

var s;
var ms = [];

function setup() {
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 900, 600);

    s.background('#ddd');

    for (var i = 0; i < 20; i++) {
        var mass = Math.constrain(20 * Math.random(), 3, 20);
        ms.push(new Mover(mass, s.width * Math.random(), s.height * Math.random()));
    }

    s.onTick = draw;
}


function draw(s) {
    s.clear();
    s.ctx.globalAlpha = 0.6;

    var len = ms.length;
    for(var i = 0; i < len; i++) {
        for(var j = 0; j < len; j++) {
            if (i == j) continue;
            var f = ms[j].attract(ms[i]);
            ms[i].applyForce(f);
        }
        ms[i].update();
        ms[i].checkEdges(s);
        ms[i].draw(s);
    }
}

function reset() {
    ms = [];
    setup();
}

var params = {};

if (ui.live) {
    ui.bindModelInput(params, 'G', document.getElementById('gravity'));
    ui.bindModelInput(params, 'massFactor', document.getElementById('mass'));
    ui.setup();
} else {
    params.massFactor = 1;
    params.G = 0.3;
    params.repel = false;
    setup();
}
