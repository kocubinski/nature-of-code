/*global Sketch ui */

function Attractor(x, y) {
    this.x = x;
    this.y = y;
}

Attractor.fromSketch = function (s) {
    var x = Math.randomRange(0, s.width);
    var y = Math.randomRange(0, s.height);
    return new Attractor(x, y);
};


function Particle(s) {
    // initialise with random velocity:
    this.x = Math.random() * s.width;
    this.y = Math.random() * s.height;

    // initialise with random velocity:
    this.vx = Math.randomRange(-params.accel/2,params.accel/2);
    this.vy = Math.randomRange(-params.accel/2,params.accel/2);
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
            this.vx += params.accel * (attractor[i].x-this.x) / d2;
            this.vy += params.accel * (attractor[i].y-this.y) / d2;
        }
    }

    // move by the velocity
    this.x += this.vx;
    this.y += this.vy;

    // scale the velocity back for the next frame
    this.vx *= params.damp;
    this.vy *= params.damp;
};

var NUM_PARTICLES  = 500;
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
                    (100   << 24) |  // alpha
                    (params.blue << 16) |   // blue
                    (params.green <<  8) |   // green
                    params.red;            // red
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

var params = {};

if (ui.live) {
    ui.bindModelInput(params, 'damp', document.getElementById('damp'));
    ui.bindModelInput(params, 'accel', document.getElementById('accel'));
    ui.bindModelInput(params, 'red', document.getElementById('red'));
    ui.bindModelInput(params, 'green', document.getElementById('green'));
    ui.bindModelInput(params, 'blue', document.getElementById('blue'));
    ui.setup();
} else {
    // good defaults
    params.damp = 0.00002;
    params.accel = 8000.0;
    params.blue = params.green = params.red = 0;
    setup();
}
