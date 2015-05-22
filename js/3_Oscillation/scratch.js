/*global Sketch*/

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations#Rotating

var s;

function draw(s) {
    var ctx = s.ctx;
    s.clear();

    var left = new Sketch.vector2(200, 150);
    var right = new Sketch.vector2(300, 150);
    var center = new Sketch.vector2(left.x + ((right.x - left.x) / 2), left.y);

    //ctx.rotate(Math.radians(0.3));
    s.circle(5, left);
    s.line(left.x, left.y, right.x, right.y);
    s.circle(5, new Sketch.vector2(300, 150));
};

function setup() {
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 900, 600);

    s.onTick = draw;
}

setup();
