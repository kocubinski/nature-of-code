/*global Touch */
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

    var isRightClick = function(e) {
        var isRight;
        if ("which" in e)
            isRight = e.which == 3;
        else if ("button" in e)
            isRight = e.button == 2;
        return isRight;
    };

    c.addEventListener('mousedown', function(e) {
        var isRight = isRightClick(e);
        self.mouse.pressed = isRight ? 2 : 1;
    });
    c.addEventListener('mouseup', function(e) {
        var isRight = isRightClick(e);
        self.mouse.pressed = 0;
        if (isRight) e.preventDefault();
    });
    c.addEventListener('mousemove', function(e) {
        self.mouse.x = e.clientX - rect.left;
        self.mouse.y = e.clientY - rect.top;
        self.mouse.radius = null;
    });

    var t = new Touch(this.elem, this.mouse);
    t.addEventListener('onTouchStart', function(e) {
        var d = e.detail;
        self.mouse.isTouch = true;
        self.mouse.x = d.x - rect.left;
        self.mouse.y = d.y - rect.top;
        self.mouse.radius = d.r;
        self.mouse.pressed = 1;
    });
    t.addEventListener('onTouchMove', function(e) {
        var d = e.detail;
        self.mouse.x = d.x - rect.left;
        self.mouse.y = d.y - rect.top;
        self.mouse.radius = d.r;
    });
    t.addEventListener('onTouchEnd', function() {
        self.mouse.pressed = 0;
        self.mouse.isTouch = false;
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
    //console.log(opts.color);
    c.fillStyle = opts.color || 'black';
    c.fill();
    if (opts.lineColor) {
        c.lineWidth = opts.lineWidth || 1;
        c.strokeStyle = 'black';
        c.stroke();
    }
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

Sketch.sketch.prototype.clear = function(rgba) {
    if (!rgba) {
        this.ctx.clearRect(0, 0, this.elem.width, this.elem.height);
    } else {
        this.ctx.fillStyle = rgba;
        this.ctx.fillRect(0, 0, this.elem.width, this.elem.height);
    }
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

window.isMobile = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/* Color */
var Color = Color ||
        function(r, g, b) {
            this.r = r || 0;
            this.g = g || 0;
            this.b = b || 0;
        };

Color.prototype = {

    // here we have a static member variable -- hm.
    // (function() {
    //var _tween;
    // return {

    _tween: null,

    toRgb: function() {
        return 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
    },

    set: function(c) {
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.round();
    },

    tween: function(gradient, easing) {
        var len = gradient.colors.length;
        if (this._tween === null) {
            this._tween = Math.randomRange(0, len - 1);
            console.log(this._tween);
            this.set(gradient.get(this._tween));
        }
        this._tween += easing;
        if (this._tween > len) {
            this._tween = 0;
        }
        this.set(gradient.get(this._tween));
    },

    round: function() {
        this.r = Math.round(this.r);
        this.g = Math.round(this.g);
        this.b = Math.round(this.b);
    }
};


Color.lerp = function(c1, c2, amt) {
    amt = Math.constrain(amt, 0, 1);
    var lerp = function(a, b, u) {
        return (1 - u) * a + u * b;
    };
    return new Color(lerp(c1.r, c2.r, amt),
                     lerp(c1.g, c2.g, amt),
                     lerp(c1.b, c2.b, amt));
};

Color.gradient = function() {
    this.colors = [];
};

Color.gradient.prototype = {

    add: function(r, g, b) {
        this.colors.push(new Color(r, g, b));
    },

    get: function(val) {
        var cs = this.colors;
        if (cs.length == 0)
            return new Color(0, 0, 0);

        if (val <= 0.0)
            return cs[0];

        if (val >= cs.length - 1)
            return cs[cs.length - 1];

        var i = Math.floor(val);
        var c1 = cs[i];
        var c2 = cs[i + 1];
        var amt = val - i;
        return Color.lerp(c1, c2, val - i);
    },

    random: function() {
        var ci = Math.round(Math.randomRange(0, this.colors.length - 1));
        return this.colors[ci];
    }

};

Color.gradient.rainbow11 = new function() {
    var g = new Color.gradient();
    g.add(0, 0, 0);
    g.add(102, 0, 102);
    g.add(0, 144, 255);
    g.add(0, 255, 207);
    g.add(51, 204, 102);
    g.add(111, 255, 0);
    g.add(191, 255, 0);
    g.add(255, 240, 0);
    g.add(255, 153, 102);
    g.add(204, 51, 0);
    g.add(153, 0, 0);
    return g;
}();

Color.gradient.rainbow10 = new function() {
    var g = new Color.gradient();
    g.colors = Color.gradient.rainbow11.colors.slice();
    g.colors.shift();
    return g;
}();
