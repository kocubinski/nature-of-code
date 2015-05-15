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
    this.mouse = {pressed: 0};

    var rect = c.getBoundingClientRect();
    var self = this;

    c.addEventListener('mousedown', function(e) {
        self.mouse.pressed = 1;
    });
    c.addEventListener('touchstart', function(e) {
        self.mouse.pressed = 1;
        var t = e.targetTouches[0];
        self.mouse.x = t.clientX - rect.left;
        self.mouse.y = t.clientY - rect.top;
    });
    c.addEventListener('mouseup', function(e) {
        self.mouse.pressed = 0;
    });
    c.addEventListener('touchend', function(e) {
        self.mouse.pressed = 0;
    });
    c.addEventListener('touchmove', function(e) {
        var t = e.targetTouches[0];
        self.mouse.x = t.clientX - rect.left;
        self.mouse.y = t.clientY - rect.top;
        self.mouse.radius = t.radiusX;
    });
    c.addEventListener('mousemove', function(e) {
        self.mouse.x = e.clientX - rect.left;
        self.mouse.y = e.clientY - rect.top;
        self.mouse.radius = null;
    });

    this.destroy = function() {
        this.destroyed = true;
        parent.removeChild(c);
    };

    this.tick();
};

Sketch.sketch.prototype.onTick = null;

Sketch.sketch.prototype.tick = function () {
    var self = this;
    if (this.onTick) {
        this.onTick(this);
    }

    window.requestAnimationFrame(function() {
        if (!self.destroyed) {
            self.tick();
        }
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

Sketch.sketch.prototype.rectangle = function(x, y, w, h, opts) {
    opts = opts || {};
    var c = this.ctx;
    c.beginPath();
    c.rect(x, y, w, h);
    c.fillStyle = opts.color || 'black';
    c.fill();
    c.lineWidth = opts.lineWidth || 1;
    c.strokeStyle = opts.strokeStyle || 'black';
    c.stroke();
};

Sketch.sketch.prototype.dot = function(r, g, b, a, x, y) {
    if (!this.imageData) {
        this.imageData = this.ctx.createImageData(1, 1);
    }
    var d = this.imageData.data;
    this.ctx.putImageData(this.imageData, x, y);
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

Sketch.vector2.subtract = function(v1, v2) {
    return new Sketch.vector2(v1.x - v2.x, v1.y - v2.y);
};

Sketch.vector2.prototype.subtract = function(v) {
    this.x -= v.x;
    this.y -= v.y;
};

Sketch.vector2.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Sketch.vector2.prototype.limit = function(max) {
    var mag = this.mag();
    if (mag <= max) return;
    this.mult(max / mag);
};

Sketch.vector2.mult = function(f, d) {
    var v = new Sketch.vector2(f.x * d, f.y * d);
    return v;
};

Sketch.vector2.prototype.mult = function(f) {
    this.x *= f;
    this.y *= f;
};

Sketch.vector2.div = function(f, d) {
    var v = new Sketch.vector2(f.x / d, f.y / d);
    return v;
};

Sketch.vector2.prototype.div = function(f) {
    this.x /= f;
    this.y /= f;
};

Sketch.vector2.prototype.normalize = function(f) {
    var mag = this.mag();
    if (mag === 0) return;
    this.mult(1 / this.mag());
};

Sketch.vector2.prototype.get = function() {
    return new Sketch.vector2(this.x, this.y);
};

Sketch.vector2.test = function() {
    var v1 = new Sketch.vector2(2, 3);
    var v2 = new Sketch.vector2(3, 2);
    return Sketch.vector2.add(v1, v2);
};

// extending math

Math.constrain = function(n, min, max) {
    n = n < min ? min : n;
    n = n > max ? max : n;
    return n;
};

Math.randomRange = function(min, max) {
    return Math.random() * (max - min) + min;
};
