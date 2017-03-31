var g = {
    x: 0,
    y: .1
}

function Circle(opts) {
    var radius = opts.radius || 100;
    var x = opts.x || 0;
    var y = opts.y || 0;
    this.id = opts.id;
    this.radius = radius
    this.x = x;
    this.y = y;
    this.vx = opts.vx || 0;
    this.vy = opts.vy || 0;
    this.maxVy = this.vy;
    this.bounce = opts.bounce || 1;
    this.mass = opts.mass || 1;
    this.k = opts.airFriction || 1;
    this.exp = (1 - Math.exp(-this.k / this.mass));
    this.massToDrag = this.mass / this.k;
    this.color = opts.color || '#777777'
    var c = $('<div>');
    c.css('position', 'absolute');
    c.css('width', radius * 2 + 'px');
    c.css('height', radius * 2 + 'px');
    c.css('border-radius', radius + 'px');
    c.css('border', '1px solid black');
    c.css('background-color', this.color);
    c.css('top', this.y - this.radius);
    c.css('left', this.x - this.radius)
    c.on('click', function () {
        this.vy = -3
    }.bind(this))
    this.shape = c;
    $("body").append(this.shape);

}

Circle.prototype.move = function (dt) {

    this.vy += (this.massToDrag * g.y) * this.exp * dt;
    this.vx += (this.massToDrag * g.x) * this.exp * dt;

    if (Math.abs(this.vy) > this.maxVy) this.maxVy = Math.abs(this.vy);
    if (this.id === 0) $("#vy").text("VY:" + this.maxVy)

    this.y += this.vy;
    this.x += this.vx;

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
    window.ondevicemotion = function (event) {
        if (event.accelerationIncludingGravity.x === null) {
            window.ondevicemotion = null;
        } else {
            window.ondevicemotion = setGravity
        }
    }

    function setGravity(event) {
        var G = 0.01;
        g = {
            y: G * event.accelerationIncludingGravity.y,
            x: -G * event.accelerationIncludingGravity.x
        }
        $('#acc').text(JSON.stringify(g));
    }

    var controlHtml =
        '<div id="acc" class="output"></div> \
         <div id = "balls" class = "output">BALLS:</div> \
         <div id="fps" class="output">FPS:</div> \
         <div id="time" class="output">TIME:</div> \
         <div id="vy" class="output">VY:</div> \
         <input id="count" resize="false" placeholder="Number of balls"></textarea> \
         <div><button id="drop">Drop Balls</button></div>'
    var controls = $(controlHtml);

    $('body').append(controls);
    $("#drop").on('click', dropBalls);

    var start = null;
    var lastTime = null;
    var frames = 0;
    var balls = [];
    var running = false;

    function dropBalls() {
        var count = parseInt($("#count")[0].value);

        for (var i = 0; i < count; i++) {
            var rgb = {
                r: Math.floor(Math.random() * 255),
                g: Math.floor(Math.random() * 255),
                b: Math.floor(Math.random() * 255)
            }
            balls.push(new Circle({
                id: i,
                radius: Math.random() * 15 + 10,
                x: Math.random() * 1024 + 100,
                y: 0,
                vx: 0,
                vy: 0,
                mass: Math.random() * 5 + 2,
                airFriction: Math.random() * 10 + .5,
                bounce: Math.random() * .5 + .2,
                color: "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ", 0.5)"
            }));
        }

        $('#balls').text("BALLS: " + balls.length);

        if (!running) {
            running = true;
            start = Date.now();
            lastTime = null;
            window.requestAnimationFrame(drawFrame);
        }

        function drawFrame(now) {
            lastTime = lastTime || now;
            var dt = (now - lastTime);
            lastTime = now;
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