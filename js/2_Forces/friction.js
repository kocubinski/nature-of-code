/*global Sketch noise */

function Mover(mass, x, y) {
    this.location = new Sketch.vector2(x, y);
    this.velocity = new Sketch.vector2(0, 0);
    this.acceleration = new Sketch.vector2(0, 0);
    this.mass = mass;
    this.size = mass * 2;
}

Mover.prototype.draw = function(sketch) {
    sketch.circle(this.size, this.location, {color: "yellow"});
};

Mover.prototype.update = function() {
    this.location.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(10);
    this.acceleration.mult(0);
};

Mover.prototype.applyForce = function(force) {
    var f = Sketch.vector2.div(force, this.mass);
    this.acceleration.add(f);
};

Mover.prototype.checkEdges = function(sketch) {
    var s = sketch;
    var bouncyness = 2;

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
        this.velocity.y *= -bouncyness / 2;
    }
};

var s, frictionMap;
var ms = [];

function setup() {
    var width = 900;
    var height = 600;

    for (var i = 0; i < 20; i++) {
        var mass = 20 * Math.random();
        if (mass < 1) mass = 1;
        ms.push(new Mover(mass, 30, 30));
    }

    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 900, 600);
    //s.background('black');
    s.onTick = draw;

    noise.seed(Math.random());
    frictionMap = noiseMap(width, height);
    drawNoise(frictionMap);
}

function drawNoise(map) {
    var image = s.ctx.createImageData(s.width, s.height);
    var data = image.data;
    for (var x = 0; x < map.length; x++) {
        var row = map[x];
        for (var y = 0; y < row.length; y++) {
            var value = Math.abs(Math.floor(row[y] * 256));
            var cell = (x + y * map.length) * 4;
            data[cell] = data[cell + 1] = data[cell + 2] = value;
            data[cell + 3] = 255;
        }
    }

    s.ctx.putImageData(image, 0, 0);
}

function getFriction(x, y) {
    x = Math.floor(x);
    x = isNaN(x) ? 0 : x;
    x = x == s.width ? x - 1 : x;
    y = Math.floor(y);
    y = isNaN(y) ? 0 : y;
    //console.log(x, y);
    var f = Math.abs(frictionMap[x][y]);
    f = isNaN(f) ? 0 : f;
    f = f / 1.1;
    //console.log(f);
    return f;
}

function noiseMap(w, h) {
    var n = [];

    for (var i = 0; i < w; i++) {
        n[i] = [];
        for (var j = 0; j < h; j++) {
            n[i][j] = noise.perlin2(i / 100, j / 100);
        }
    }

    return n;
}

function draw(sketch) {
    sketch.clear();
    drawNoise(frictionMap);

    var wind = new Sketch.vector2(0.02, 0);
    var gravity = new Sketch.vector2(0, 0.3);

    for (var i = 0; i < ms.length; i++) {
        var m = ms[i];

        //var c = 0.01;

        var c = getFriction(m.location.get().x,
                            m.location.get().y);
        var normal = 1;
        var frictionMag = c * normal;

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

setup();
