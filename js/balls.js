function Circle(opts) {
    var radius = opts.radius || 100;
    var x = opts.x
    var y = opts.y
    this.radius = radius
    this.x = x;
    this.y = y;
    this.vx = opts.vx

    console.log("Vx = " + this.vx)
    this.vy = opts.vy || 0;
    this.g = .06
    this.lastTime = Date.now();
    var c = $('<div>');
    c.css('position', 'absolute');
    c.css('width', radius * 2 + 'px');
    c.css('height', radius * 2 + 'px');
    c.css('border-radius', radius + 'px');
    c.css('border', '1px solid black');
    c.css('background-color', '#777777');
    c.css('top', this.y - this.radius);
    c.css('left', this.x - this.radius)
    c.on('click', function () {
        this.vy = -1
    }.bind(this))
    this.c = c;
    $("body").append(this.c);

}

Circle.prototype.move = function (dt) {
    this.vy += this.g;
    this.vx *= .99;
    this.y += this.vy * dt;
    this.x += this.vx * dt;

    if (this.y + this.radius + 2 > window.innerHeight) {
        this.vy = -this.vy * .7
        this.y = window.innerHeight - this.radius - 2;
    }
    if (this.x < this.radius + 2) {
        this.vx = -this.vx
        this.x = this.radius + 2
    } else if (this.x > window.innerWidth - this.radius - 2) {
        this.vx = -this.vx;
        this.x = window.innerWidth - this.radius - 2;
    }

    this.c.css('top', this.y - this.radius);
    this.c.css('left', this.x - this.radius);

}




$(document).ready(function () {
    var balls = [];
    for (var i = 0; i < 10; i++) {
        balls.push(new Circle({
            radius: Math.random() * 25 + 12,
            x: Math.random() * 1024 + 100,
            y: 0,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1
        }));
    }
    frames = 0;

    var lastTime = null;
    var start = Date.now();
    window.requestAnimationFrame(drawFrame);


    function drawFrame(now) {
        lastTime = lastTime || now;
        var dt = (now - lastTime);
        lastTime = now;
        $("#delta").text("DT:" + dt)
        $.each(balls, function (index, ball) {
            ball.move(dt);
        })

        frames++;
        var delta = Date.now() - start
        fps = frames / (delta / 1000);
        $("#fps").text("FPS:" + fps.toFixed(2));
        $("#time").text("TIME:" + delta / 1000)
        window.requestAnimationFrame(drawFrame);
    }
})