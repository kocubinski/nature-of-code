/*global Sketch*/

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations#Rotating

var s;

function rotate(s) {
    var ctx = s.ctx;
    s.clear();

    var left = new Sketch.vector2(200, 150);
    var right = new Sketch.vector2(300, 150);
    var center = new Sketch.vector2(left.x + ((right.x - left.x) / 2), left.y);

    ctx.translate(center.x, center.y);
    ctx.rotate(Math.radians(1));
    ctx.translate(-center.x, -center.y);

    s.circle(5, left);
    s.line(left.x, left.y, right.x, right.y);
    s.circle(5, new Sketch.vector2(300, 150));
}

function accelerate() {
    var angle = 0,
        velocity = 0,
        accel = 0.001;

    s.onTick = function() {
        var ctx = s.ctx;
        s.clear();

        var left = new Sketch.vector2(200, 150);
        var right = new Sketch.vector2(300, 150);
        var center = new Sketch.vector2(left.x + ((right.x - left.x) / 2), left.y);

        velocity += accel;
        angle += velocity;

        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(Math.radians(angle));
        ctx.translate(-center.x, -center.y);

        s.circle(5, left);
        s.line(left.x, left.y, right.x, right.y);
        s.circle(5, new Sketch.vector2(300, 150));

        ctx.restore();
    };
}

function setup() {
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 900, 600);

    //s.onTick = rotate;
    accelerate();
}

setup();
