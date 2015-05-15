/*global Sketch */

function Attractor(x, y) {
    this.x = x;
    this.y = y;
}

Attractor.fromSketch = function (s) {
    var x = Math.randomRange(0, s.width);
    var y = Math.randomRange(0, s.height);
    return new Attractor(x, y);
};

// a point in space with a velocity
// moves according to acceleration and damping parameters
// in this case, it moves very fast so the process is basically "scattering"

// changing these parameters can give very different results
var damp = 0.00002; // remember a very small amount of the last direction
var accel = 4000.0; // move very quickly


function Particle(s) {
    // initialise with random velocity:
    this.x = Math.random() * s.width;
    this.y = Math.random() * s.height;

    // initialise with random velocity:
    this.vx = Math.randomRange(-accel/2,accel/2);
    this.vy = Math.randomRange(-accel/2,accel/2);
}

Particle.prototype.step = function() {

    // move towards every attractor
    // at a speed inversely proportional to distance squared
    // (much slower when further away, very fast when close)

    for (var i = 0; i < attractor.length; i++) {

        // calculate the square of the distance
        // from this particle to the current attractor
        var a = attractor[i];
        var d2 = Math.pow(attractor[i].x-this.x, 2) + Math.pow(attractor[i].y-this.y, 2);

        if (d2 > 0.1) { // make sure we don't divide by zero
            // accelerate towards each attractor
            this.vx += accel * (attractor[i].x-this.x) / d2;
            this.vy += accel * (attractor[i].y-this.y) / d2;
        }
    }

    // move by the velocity
    this.x += this.vx;
    this.y += this.vy;

    // scale the velocity back for the next frame
    this.vx *= damp;
    this.vy *= damp;
};

var NUM_PARTICLES  = 100;
var NUM_ATTRACTORS = 6;

var particle = [];
var attractor = [];

var s;

function setup() {
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 708, 400);

    scatter(s);

    // a favourite... (comment these out if you change NUM_ATTRACTORS)
    attractor[0] = new Attractor(199.51851,109.791565);
    attractor[1] = new Attractor(142.45416,273.7996);
    attractor[2] = new Attractor(81.76278,28.523111);
    attractor[3] = new Attractor(167.28207,196.15504);
    attractor[4] = new Attractor(517.4808,312.41132);
    attractor[5] = new Attractor(564.9883,7.6203823);

    tick();
}

function tick() {
    var imageData = s.ctx.getImageData(0, 0, s.width, s.height);
    var buf = new ArrayBuffer(imageData.data.length);
    var buf8 = new Uint8ClampedArray(buf);
    var data = new Uint32Array(buf);

    s.onTick =
        function (s) {

            for (var i = 0; i < particle.length; i++) {
                var p = particle[i];
                p.step();
                var color = 0;
                data[Math.round(p.y) * s.width + Math.round(p.x)] =
                    (200   << 24) |  // alpha
                    (color << 16) |   // blue
                    (color <<  8) |   // green
                    color;            // red
            }

            imageData.data.set(buf8);
            s.ctx.putImageData(imageData, 0, 0);
        };
}

function scatter(s) {
    // clear the preview
    s.clear();

    // randomise attractors
    for (var i = 0; i < NUM_ATTRACTORS; i++) {
        attractor[i] = Attractor.fromSketch(s);
        // so you *can* get your favourite one back, if you want!
        //println("attractor["+i+"] = new Attractor("+attractor[i].x+","+attractor[i].y+");");
    }

    // randomise particles
    for (i = 0; i < NUM_PARTICLES; i++) {
        particle[i] = new Particle(s);
    }
}

function reset() {
    scatter(s);
    tick();
}

setup();
