function Circle(opts) {
    var radius = opts.radius || 100;
    var x = opts.x || 0;
    var y = opts.y || 0;
    this.radius = radius
    this.x = x;
    this.y = y;
    this.vx = opts.vx || 0;
    this.vy = opts.vy || 0;
    this.bounce = opts.bounce || 1;
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
        this.vy = -3
    }.bind(this))
    this.shape = c;
    $("body").append(this.shape);

}

Circle.prototype.move = function (dt) {
    this.vy += this.g;
    this.vx *= .99;
    this.y += this.vy * dt;
    this.x += this.vx * dt;

    if (this.y + this.radius + 2 > window.innerHeight) {
        this.vy = -this.vy * this.bounce;
        this.y = window.innerHeight - this.radius - 2;
    }
    if (this.x < this.radius + 2) {
        this.vx = -this.vx * this.bounce;
        this.x = this.radius + 2
    } else if (this.x > window.innerWidth - this.radius - 2) {
        this.vx = -this.vx * this.bounce;
        this.x = window.innerWidth - this.radius - 2;
    }

    this.shape.css('top', this.y - this.radius);
    this.shape.css('left', this.x - this.radius);
}


$(document).ready(function () {
    var controlHtml =
        '<div id="fps" class="output">FPS:</div> \
         <div id="time" class="output">TIME:</div> \
         <div id="delta" class="output">DT:</div> \
         <textarea id="count"></textarea> \
         <div><button id="start">Start</button></div>'
    var controls = $(controlHtml);

    $('body').append(controls);
    $("#start").on('click', dropBalls)
    var frames = 0;

    function dropBalls() {
        var count = parseInt($("#count")[0].value);
        var balls = [];
        for (var i = 0; i < count; i++) {
            balls.push(new Circle({
                radius: Math.random() * 15 + 10,
                x: Math.random() * 1024 + 100,
                y: 0,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                bounce: Math.random()
            }));
        }


        var lastTime = null;
        var start = Date.now();
        window.requestAnimationFrame(drawFrame);

        function drawFrame(now) {
            lastTime = lastTime || now;
            var dt = (now - lastTime);
            lastTime = now;
            $("#delta").text("DT:" + dt.toFixed(2))
            $.each(balls, function (index, ball) {
                ball.move(dt);
            })

            frames++;
            var delta = Date.now() - start
            fps = frames / (delta / 1000);
            $("#fps").text("FPS:" + fps.toFixed(2));
            $("#time").text("TIME:" + (delta / 1000).toFixed(2));
            window.requestAnimationFrame(drawFrame);
        }
    }
})