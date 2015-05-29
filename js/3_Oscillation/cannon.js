/*global Sketch*/

Sprite = function(width, height, baseX, baseY, image, opt) {

    var frameIndex = 0,
        tickCount = 0,
        ticksPerFrame = opt.ticksPerFrame || 1,
        numberOfFrames = opt.numberOfFrames || 1,
        loop = opt.loop;

    return {
        width: width,
        height: height,
        image: image,

        render: function() {
            var ctx = s.ctx;
            ctx.drawImage(this.image,
                          baseX + (frameIndex * width), baseY,
                          this.width, this.height,
                          baseX, baseY,
                          this.width, this.height);
        },

        update: function() {
            if (++tickCount > ticksPerFrame) {
                tickCount = 0;
                if (frameIndex < numberOfFrames - 1) {
                    frameIndex++;
                } else if (loop) {
                    frameIndex = 0;
                }
            }
            console.log(frameIndex);
        }
    };
};

var s;

function draw(s) {
}

function cannon() {
    var img = new Image();
    img.src = '/3_Oscillation/cannon.png';
    var cannon = new Sprite(60, 60, 0, 183, img,
                            { loop: true,
                              numberOfFrames: 6,
                              ticksPerFrame: 50
                            });

    s.onTick = function() {
        var ctx = s.ctx;
        s.clear();
        cannon.update();
        cannon.render();
    };
}

function setup() {
    if (s) { s.destroy(); };
    s = new Sketch.sketch('canvas', 900, 600);
    cannon();
}

setup();
