var g = {
    x: 0,
    y: 0
}

var mouse = {
    x: 0,
    y: 0
}

var cursor = null;

function Circle(opts) {
    var radius = opts.radius || Math.pow(opts.mass, 1 / 3) * 20;
    this.id = opts.id;
    this.radius = radius
    this.center = opts.center || {
        x: 0,
        y: 0
    };
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
    c.css('top', this.center.y - this.radius);
    c.css('left', this.center.x - this.radius)
    c.on('click', function () {
        this.vy = -50
    }.bind(this))
    this.shape = c;
    $("#content").append(this.shape);

}

Circle.prototype.move = function (dt) {


    var mouseVector = vector(this.center, mouse);
    var f = (mouseVector.mag) > 0 ? 5 / mouseVector.mag : 0;
    var fx = -f * Math.cos(mouseVector.angle);
    var fy = f * Math.sin(mouseVector.angle);
    this.vy += this.massToDrag * (g.y + fy / this.mass) * this.exp * dt;
    this.vx += this.massToDrag * (g.x + fx / this.mass) * this.exp * dt;



    this.center.y += this.vy;
    this.center.x += this.vx;

    if (this.center.y < this.radius + 2) {
        debugger
        this.vy = -this.vy * this.bounce;
        this.center.y = this.radius + 2;
    } else if (this.center.y + this.radius + 2 > window.innerHeight) {
        debugger
        this.vy = -this.vy * this.bounce;
        this.center.y = window.innerHeight - this.radius - 2;
    }

    if (this.center.x < this.radius + 2) {
        this.vx = -this.vx * this.bounce;
        this.center.x = this.radius + 2
    } else if (this.center.x > window.innerWidth - this.radius - 2) {
        this.vx = -this.vx * this.bounce;
        this.center.x = window.innerWidth - this.radius - 2;
    }

    this.shape.css('top', this.center.y - this.radius);
    this.shape.css('left', this.center.x - this.radius);
}

function distance(p1, p2) {
    dx = p1.x - p2.x;
    dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function angle(p1, p2) {
    dx = p2.x - p1.x;
    dy = -(p2.y - p1.y);
    var alpha = Math.atan2(dy, dx);
    if (alpha < 0) alpha = 2 * Math.PI + alpha;
    return alpha;
}

function vector(p1, p2) {
    var v = {};
    v.mag = distance(p1, p2);
    v.angle = angle(p1, p2);
    return v
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

    $(document).mousemove(function (event) {
        mouse.x = event.pageX;
        mouse.y = event.pageY;
    })

    var controlHtml =
        '<div id="acc" class="output"></div> \
         <div id = "balls" class = "output">BALLS:</div> \
         <div id="fps" class="output">FPS:</div> \
         <div id="time" class="output">TIME:</div> \
         <input id="count" resize="false" placeholder="Number of balls"></textarea> \
         <div><button id="drop">Drop Balls</button></div>'
    var controls = $(controlHtml);

    cursor = $("<img id = 'cursor' src = './img/fan2.gif'>");
    $('#content').append(cursor);
    $('#content').append(controls);
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
                //radius: Math.random() * 15 + 10,
                center: {
                    x: Math.random() * 1024 + 100,
                    y: 400
                },
                vx: 0,
                vy: 0,
                mass: Math.random() * 3 + 1,
                airFriction: 1,
                bounce: Math.random() * .3 + .3,
                color: "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ", 0.5)"
            }));
        }

        $('#balls').text("BALLS: " + balls.length);
        cursor.show();
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
            debugger
            drawCursor();

            frames++;
            var delta = Date.now() - start
            fps = frames / (delta / 1000);
            $("#fps").text("FPS:" + fps.toFixed(2));
            $("#time").text("TIME:" + (delta / 1000).toFixed(2));
            window.requestAnimationFrame(drawFrame);
        }

        function drawCursor() {
            debugger
            cursor.css('top', mouse.y - 15);
            cursor.css('left', mouse.x - 15);
        }
    }
})