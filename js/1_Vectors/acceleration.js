var scene = scene || {};
scene.ctx = $('#canvas').get(0).getContext('2d');
scene.run = function() {
    setup(ctx);
};

function setup(ctx) {
    var pointLen = this.radius * 2.5;
    ctx.fillStyle = 'blue';
}

function Mover(ctx) {
    this.ctx = ctx;
}
