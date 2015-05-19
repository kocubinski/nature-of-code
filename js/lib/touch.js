var Touch = function(el, mouse) {

    this.ongoingTouches = [];

    var self = this;

    function copyTouch (touch) {
        return { identifier: touch.identifier,
                 clientX: touch.clientX,
                 clientY: touch.clientY,
                 radiusX: touch.radiusX
               };
    };

    function findPos(obj) {
        var curleft = 0,
            curtop = 0;

        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);

            return { x: curleft-document.body.scrollLeft, y: curtop-document.body.scrollTop };
        }
    };

    function ongoingTouchIndexById(idToFind) {
        for (var i = 0; i < self.ongoingTouches.length; i++) {
            var id = self.ongoingTouches[i].identifier;

            if (id == idToFind) {
                return i;
            }
        }
        return -1; // not found
    };

    function handleStart(evt) {
        log("touchstart.");
        var el = document.getElementsByTagName("canvas")[0];
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;
        var offset = findPos(el);

        for (var i = 0; i < touches.length; i++) {
            var touch = touches[i];
            if (touch.clientX-offset.x > 0
                && touch.clientX-offset.x < parseFloat(el.width)
                && touch.clientY-offset.y > 0
                && touch.clientY-offset.y < parseFloat(el.height)) {

                evt.preventDefault();
                log("touchstart:" + i + "...");
                self.ongoingTouches.push(copyTouch(touch));
                // var color = colorForTouch(touches[i]);
                // ctx.beginPath();
                // ctx.arc(touches[i].clientX-offset.x, touches[i].clientY-offset.y, 4, 0, 2 * Math.PI, false);
                // ctx.fillStyle = color;
                // ctx.fill();
                log("touchstart:" + i + ".");
                // console.log("onTouchStart with", touch);
                var onTouchStart = new CustomEvent('onTouchStart',
                                                   {detail: {x: touch.clientX,
                                                             y: touch.clientY,
                                                             r: touch.radiusX}});
                self.el.dispatchEvent(onTouchStart);
            }
        }
    };

    function handleMove(evt) {
        var el = document.getElementsByTagName("canvas")[0];
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;
        var offset = findPos(el);

        for (var i = 0; i < touches.length; i++) {
            if (touches[i].clientX-offset.x > 0
                && touches[i].clientX-offset.x < parseFloat(el.width)
                && touches[i].clientY-offset.y > 0
                && touches[i].clientY-offset.y < parseFloat(el.height)) {

                evt.preventDefault();
                //var color = colorForTouch(touches[i]);
                var idx = ongoingTouchIndexById(touches[i].identifier);

                if (idx >= 0) {
                    log("continuing touch " + idx);
                    // ctx.beginPath();
                    var x = self.ongoingTouches[idx].clientX,
                        y = self.ongoingTouches[idx].clientY,
                        r = self.ongoingTouches[idx].radiusX;

                    log("ctx.moveTo(" + x + ", " + y + ");");
                    // ctx.moveTo(ongoingTouches[idx].clientX-offset.x, ongoingTouches[idx].clientY-offset.y);
                    log("ctx.lineTo(" + touches[i].clientX + ", " + touches[i].clientY + ");");
                    // ctx.lineTo(touches[i].clientX-offset.x, touches[i].clientY-offset.y);
                    // ctx.lineWidth = 4;
                    // ctx.strokeStyle = color;
                    // ctx.stroke();

                    self.ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
                    log(".");
                    var onTouchMove = new CustomEvent('onTouchMove' , {detail: {x: x, y: y, r: r}});
                    self.el.dispatchEvent(onTouchMove);
                } else {
                    console.log("can't figure out which touch to continue");
                }
            }
        }
    };

    function handleEnd(evt) {
        log("touchend/touchleave.");
        var el = document.getElementsByTagName("canvas")[0];
        var ctx = el.getContext("2d");
        var touches = evt.changedTouches;
        var offset = findPos(el);

        for (var i = 0; i < touches.length; i++) {
            if (touches[i].clientX-offset.x >0
                && touches[i].clientX-offset.x < parseFloat(el.width)
                && touches[i].clientY-offset.y > 0
                && touches[i].clientY-offset.y < parseFloat(el.height)) {

                evt.preventDefault();
                //var color = colorForTouch(touches[i]);
                var idx = ongoingTouchIndexById(touches[i].identifier);

                if (idx >= 0) {
                    // ctx.lineWidth = 4;
                    // ctx.fillStyle = color;
                    // ctx.beginPath();
                    // ctx.moveTo(ongoingTouches[idx].clientX-offset.x, ongoingTouches[idx].clientY-offset.y);
                    // ctx.lineTo(touches[i].clientX-offset.x, touches[i].clientY-offset.y);
                    // ctx.fillRect(touches[i].clientX - 4-offset.x, touches[i].clientY - 4-offset.y, 8, 8);
                    self.ongoingTouches.splice(i, 1); // remove it; we're done
                    var onTouchEnd = new Event('onTouchEnd');
                    self.el.dispatchEvent(onTouchEnd);
                } else {
                    console.log("can't figure out which touch to end");
                }
            }
        }
    };

    function handleCancel(evt) {
        evt.preventDefault();
        // console.log("touchcancel.");
        var touches = evt.changedTouches;

        for (var i = 0; i < touches.length; i++) {
            self.ongoingTouches.splice(i, 1); // remove it; we're done
        }
    };

    function log(msg) {
        //console.log(msg);
    };

    el = el || document.body;
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchleave", handleEnd, false);
    el.addEventListener("touchmove", handleMove, false);
    this.el = el;
};

Touch.prototype.addEventListener = function(evt, fn) {
    this.el.addEventListener(evt, fn);
};
