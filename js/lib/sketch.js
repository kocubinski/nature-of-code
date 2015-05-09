var Sketch = Sketch || {};

/* Canvas */

Sketch.sketch = function (pid, w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    c.style.width = w + 'px';
    c.style.display = 'block';
    c.style.marginRight = 'auto';
    c.style.marginLeft = 'auto';
    var parent = document.getElementById(pid);
    parent.appendChild(c);

    this.width = w;
    this.height = h;
    this.elem = c;
    this.ctx = c.getContext('2d');
    this.tick();
};

Sketch.sketch.prototype.onTick = null;

Sketch.sketch.prototype.tick = function () {
    var self = this;
    if (this.onTick) {
        this.onTick(this);
    }

    window.requestAnimationFrame(function() {
        self.tick();
    });
};

Sketch.sketch.prototype.background = function(color) {
    this.elem.style.background = color;
};

Sketch.sketch.prototype.circle = function(radius, location, opts) {
    var c = this.ctx;
    c.beginPath();
    c.arc(location.x, location.y, radius, 2 * Math.PI, false);
    c.fillStyle = opts.color || 'black';
    c.fill();
    c.lineWidth = opts.lineWidth || 1;
    c.strokeStyle = opts.lineColor || 'black';
    c.stroke();
};

Sketch.sketch.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.elem.width, this.elem.height);
};

Sketch.sketch.test = function() {
    var c = new Sketch.sketch('canvas', 600, 600);
    c.background('#ddd');
    c.circle(20, new Sketch.vector2(100, 100), {color: 'green'});
};


/* Vector */

Sketch.vector2 = function (x, y) {
    this.x = x;
    this.y = y;
};

Sketch.vector2.add = function(v1, v2) {
    return new Sketch.vector2(v1.x + v2.x, v1.y + v2.y);
};

Sketch.vector2.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
};

Sketch.vector2.test = function() {
    var v1 = new Sketch.vector2(2, 3);
    var v2 = new Sketch.vector2(3, 2);
    return Sketch.vector2.add(v1, v2);
};
