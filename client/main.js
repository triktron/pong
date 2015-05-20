var c, cctx, p1, p2, ball, animate = animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60)
};
var menu = {"open":true},SingleplayerBtn, multyplayerBtn;


//
//          init script
//
//         set p1, p2, ball and starts draw/update loop
window.onload = function() {
    c = document.getElementById("canvas");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    cctx = c.getContext("2d");
    
    SingleplayerBtn = new Button(50, 50, 100, 50, 'Singleplayer', {
      'default': {
        top: '#1879BD',
        bottom: '#084D79'
      },
      'hover': {
        top: '#678834',
        bottom: '#093905'
      },
      'active': {
        top: '#EB7723',
        bottom: '#A80000'
      }
    }, function() {
      p1 = new Player();
        p2 = new Computer();

        p1.paddle = new Paddle(20, 384, 10, 80);
        p2.paddle = new Paddle(994, 384, 10, 80);
        ball = new Ball(384, 512);
      menu.open = false;
    });
    multyplayerBtn = new Button(160, 50, 100, 50, 'Multyplayer', {
      'default': {
        top: '#1879BD',
        bottom: '#084D79'
      },
      'hover': {
        top: '#678834',
        bottom: '#093905'
      },
      'active': {
        top: '#EB7723',
        bottom: '#A80000'
      }
    }, function() {
      menu.open = false;
      p1 = new Player();

        p1.paddle = new Paddle(20, 384, 10, 80);
        ball = new Ball(384, 512);
    });

    animate(drawloop);
    precessGame();
}

// mouse listener for menu
document.addEventListener("mousemove",function(e) {
    SingleplayerBtn.mousemove(e.clientX,e.clientY);
    multyplayerBtn.mousemove(e.clientX,e.clientY);
});
document.addEventListener("mousedown",function(e) {
    if (menu.open) {
        SingleplayerBtn.mouseclick();
        multyplayerBtn.mouseclick();
    }
});
document.addEventListener("mouseup",function(e) {
    if (menu.open) {
        SingleplayerBtn.mouseup();
        multyplayerBtn.mouseup();
    }
});
function Button(x, y, w, h, text, colors, clickCB) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.colors = colors;
      this.text = text;

      this.state = 'default';  // current button state
        
      var isClicking = false;

      /**
       * Check to see if the user is hovering over.
       */
      this.mousemove = function(_x,_y) {
        // check for hover
        if (_x >= this.x && _x <= this.x + this.width &&
            _y >= this.y && _y <= this.y + this.height) {
          this.state = 'hover';
        }
        else {
          this.state = 'default';
        }
      };
      /**
       * Check to see if the user is clicking on the button.
       */
       this.mouseclick = function() {
           // check for click
           if (this.state == 'hover') {
            this.state = 'active';
              
            if (typeof clickCB === 'function' && !isClicking) {
              clickCB();
              isClicking = true;
            }
           }
       }
       this.mouseup = function() {
           if (this.state == 'active') isClicking = false;
       }
       
       

      /**
       * Draw the button.
       */
      this.draw = function() {
        cctx.save();

        var colors = this.colors[this.state];
        var halfH = this.height / 2;

        // button
        cctx.fillStyle = colors.top;
        cctx.fillRect(this.x, this.y, this.width, halfH);
        cctx.fillStyle = colors.bottom;
        cctx.fillRect(this.x, this.y + halfH, this.width, halfH);

        // text
        var size = cctx.measureText(this.text);
        var x = this.x + (this.width - size.width) / 2;
        var y = this.y + (this.height - 15) / 2 + 12;

        cctx.fillStyle = '#FFF';
        cctx.fillText(this.text, x, y);

        cctx.restore();
      };
    }

//
//              draw loop
//
function drawloop() {
    animate(drawloop);
    
    if (menu.open) {
        SingleplayerBtn.draw();
        multyplayerBtn.draw();
    } else {
        cctx.strokeStyle = "#FFF";
        cctx.lineWidth = 10;
        cctx.strokeRect(10, 10, 1004, 748);
        cctx.clearRect(15, 15, 995, 738);
        p1.paddle.render();
        p2.paddle.render();
        ball.render();
    }
}

//          pridicte ai
function predict() {
    var fbx = ball.x, fby = ball.y, fbxV = ball.xV, fbyV = ball.yV;
    while(fbx <= 978) {
        fbx += fbxV;
        fby += fbyV;
        if (fby <= 16) {
            fbyV *= -1;
        } else if (fby >= 732) {
           fbyV *= -1;
        }
    }
    p2.paddle.p = fby - 35;
}

// processes game

function precessGame() {
    setTimeout(precessGame, 10);
    p1.Update();
    p2.Update();
    ball.update();
}

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.xV = -3;
    this.yV = 0;
    this.render = function() {
        cctx.fillStyle = "blue";
        cctx.fillRect(this.x, this.y, 20, 20);
    };
    this.update = function() {
        this.x += this.xV;
        this.y += this.yV;
        if (this.y <= 16) {
            this.yV *= -1;
        } else if (this.y >= 732) {
           this.yV *= -1;
        }
        if (this.x <= 16) {
            this.xV = -3;
            this.yV = 0;
            this.x = 512;
            this.y = 384;
        } else if (this.x >= 988) {
            this.xV = 3;
            this.yV = 0;
            this.x = 512;
            this.y = 384;
        }
        if (this.x <= 26 && this.y > p1.paddle.y && this.y < p1.paddle.y + 80) {
            this.xV *= -1;
            this.yV += p1.paddle.yV / 2;
            this.x += this.xV;
            predict();
        }
        if (this.x >= 978 && this.y > p2.paddle.y && this.y < p2.paddle.y + 80) {
            this.xV *= -1;
            this.yV += p2.paddle.yV / 2;
            this.x += this.xV;
        }
    }
}

function Player() {
    this.paddle;
    this.Update = function() {
        if (KeysDown[38] && p1.paddle.y > 16) p1.paddle.yV = -3; else if (KeysDown[40] && p1.paddle.y < 672) p1.paddle.yV = 3; else p1.paddle.yV = 0;
        p1.paddle.y += p1.paddle.yV;
    };
    this.score = 0;
}

function Computer() {
    this.paddle;
    this.Update = function() {
            if (p2.paddle.p > p2.paddle.y + 10) p2.paddle.y += 3;
            else if (p2.paddle.p < p2.paddle.y + 70) p2.paddle.y -= 3;
    };
    this.score = 0;
}

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xV = 0;
    this.yV = 0;
    this.p = 384;
    this.render = function() {
        cctx.fillStyle = "red";
        cctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var KeysDown = [];
for (var i = 8; i < 222; i++) KeysDown[i] = false;

document.addEventListener("keydown", function(e) {
    KeysDown[e.keyCode] = true;
});

document.addEventListener("keyup", function(e) {
    KeysDown[e.keyCode] = false;
});