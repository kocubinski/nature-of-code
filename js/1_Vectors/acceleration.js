function Vector(x, y) {
    this.x = x;
    this.y = y;
}

function Scene(selector) {
    this.canvas = $('#canvas');
    this.ctx = scene.canvas.get(0).getContext('2d');
}

Scene.prototype.tick = function() {
    draw(this.canvas, this.ctx);
    window.requestAnimationFrame(this.tick);
};

Scene.prototype.run = function() {
    setup(this.ctx);
    window.requestAnimationFrame(this.tick);
};

Scene.prototype.circle = function(radius, location, color) {
    var c = scene.ctx;
    c.beginPath();
    c.arc(this.x, this.y, this.size, 2 * Math.PI, false);
    c.fillStyle = 'green';
    c.fill();
    c.lineWidth = 2;
    c.strokeStyle = 'black';
    c.stroke();
};

function Mover(ctx) {
    this.ctx = ctx;
    this.x = 100;
    this.y = 100;
    this.size = 20;
}

Mover.prototype.draw = function() {
    var c = this.ctx;
};

var m;

function setup(ctx) {
    m = new Mover(ctx);
    m.draw();
}

function draw(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width(), canvas.height());
    m.x += 0.3;
    m.draw();
}

scene.run();
