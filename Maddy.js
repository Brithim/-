(function() {
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        setTimeout(callback, 1000 / 60);
    };
    var get = document.querySelector.bind(document),
        on = document.addEventListener.bind(document),
        context, canvas, mouseX, mouseY, px, py, points = [],
        size = 1,
        red = 0,
        green = 255,
        blue = 255,
        spread, MAX_SPREAD = 1,
        SPEED_X = 0.15,
        SPEED_Y = 0.15,
        MAX_LENGTH = 120,
        RED_STEP = 0,
        GREEN_STEP = 0.015,
        BLUE_STEP = 0.025;

    function Point(x, y, dx, dy, size, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.color = color;
    }
    Point.prototype.spread = function() {
        this.x += this.dx;
        this.y += this.dy;
    };

    function drawLines() {
        var p0, p1, p2, total = points.length;
        for(var i = total - 1; i > 1; i--) {
            p0 = points[i];
            p1 = points[i - 1];
            p2 = points[i - 2];
            context.beginPath();
            context.strokeStyle = p0.color;
            context.lineWidth = p0.size;
            context.globalAlpha = i / total;
            context.moveTo((p1.x + p0.x) / 2, (p1.y + p0.y) / 2);
            context.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
            context.stroke();
            p0.spread();
        }
        points[0].spread();
        points[total - 1].spread();
    }

    function draw() {
        var dx = (mouseX - px) * SPEED_X,
            dy = (mouseY - py) * SPEED_Y;
        if(dx < -spread) {
            dx = -spread;
        } else if(dx > spread) {
            dx = spread;
        }
        if(dy < -spread) {
            dy = -spread;
        } else if(dy > spread) {
            dy = spread;
        }
        px = mouseX;
        py = mouseY;
        points.push(new Point(px, py, dx, dy, Math.abs(Math.sin(size += 0.125) * 10) + 1, 'rgb(' +
            (Math.floor(Math.sin(red += RED_STEP) * 0 + 0)) + ',' +
            (Math.floor(Math.sin(green += GREEN_STEP) * 128 + 128)) + ',' +
            (Math.floor(Math.sin(blue += BLUE_STEP) * 128 + 128)) + ')'));
        if(points.length > MAX_LENGTH) points.shift();
        context.globalCompositeOperation = 'source-over';
        context.globalAlpha = 1;
        context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.globalCompositeOperation = 'lighter';
        drawLines();
        drawLines();
        drawLines();
    }

    function update() {
        requestAnimationFrame(update);
        draw();
    }

    function resize() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }

    function init() {
        canvas = get('canvas');
        try {
            context = canvas.getContext('2d');
        } catch(e) {
            get('.alt').style.display = 'block';
            return;
        }
        canvas.style.display = 'block';
        window.onmousemove = function(event) {
            mouseX = event.pageX;
            mouseY = event.pageY;
        };
        document.onmouseenter = function(event) {
            mouseX = event.pageX;
            mouseY = event.pageY;
            for(var i = points.length; i--;) {
                points[i].x = mouseX;
                points[i].y = mouseY;
            }
        };
        window.ontouchmove = function(event) {
            mouseX = event.targetTouches[0].pageX;
            mouseY = event.targetTouches[0].pageY;
            spread = 1;
        };
        window.ontouchstart = function(event) {
            spread = 0;
            mouseX = event.targetTouches[0].pageX;
            mouseY = event.targetTouches[0].pageY;
            for(var i = points.length; i--;) {
                points[i].x = mouseX;
                points[i].y = mouseY;
            }
            if(!event.target.href) {
                event.preventDefault();
            }
        };
        window.onresize = resize;
        resize();
        mouseX = canvas.width / 2;
        mouseY = canvas.height / 2;
        update();
    }
    on('DOMContentLoaded', init);
}());