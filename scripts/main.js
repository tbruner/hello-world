var canvas = document.getElementById("myCanvas");
var ctx  = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var ballradius = 10;
var dx = 2;
var dy = -2;
var dp = 0;

var paddleWidth = 75;
var paddleHeight = 10;
var paddleX = (canvas.width - paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 4;
var brickColumnCount = 7;
var brickWidth = 52;
var brickHeight = 27;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var destroyed = 0;
var lives = 3;

var bricks = [];
for(var c=0; c<brickColumnCount; c++)
{
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++)
  {
    bricks[c][r] = {x:0,y:0,status:1,points:1};
  }
}

function drawBall()
{
  ctx.beginPath();
  ctx.arc(x, y, ballradius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle()
{
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - (paddleHeight*2), paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks()
{
  for(var c=0; c<brickColumnCount; c++)
  {
    for(var r=0; r<brickRowCount; r++)
    {
      if(bricks[c][r].status == 1)
      {
        var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        if(r == 0)
        {
          ctx.fillStyle = "#0000DD";
        }
        else if(r == 1)
        {
          if(c == 0 || c == brickColumnCount-1)
          {
            ctx.fillStyle = "#000000";
          }
          else
          {
            ctx.fillStyle = "#00DD00";
          }
        }
        else
        {
          ctx.fillStyle = "#DD0000";
        }
        ctx.fill();
        ctx.closePath();
      }
      if(r==0)
      {
        bricks[c][r].points = 4;
      }
      if(r==1)
      {
        if(c==0 || c==brickColumnCount-1)
        {
          bricks[c][r].points = -10;
        }
        else
        {
          bricks[c][r].points = 2;
        }
      }
    }
  }
}

function draw()
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();

  if(x + dx > canvas.width-ballradius || x + dx < ballradius)
  {
    dx = -dx;
  }
  if(y + dy < ballradius)
  {
    dy = -dy;
  }
  else if(y + dy > canvas.height-(ballradius+paddleHeight*2) && x > paddleX && x < paddleX + paddleWidth)
  {
    dy = -dy;
    dx = dx+dp;
  }
  else if(y + dy > canvas.height-ballradius)
  {
    lives--;
    if(!lives)
    {
      alert("GAME OVER\nSCORE: "+score);
      document.location.reload();
    }
    else {
      x = canvas.width/2;
      y = canvas.height-30;
      dx = 2;
      dy = -2;
      paddleX = (canvas.width-paddleWidth)/2;
    }
  }

  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  x += dx;
  y += dy;

  if(rightPressed && paddleX < canvas.width-paddleWidth)
  {
    dp = .5;
    paddleX += 4;
  }
  else if(leftPressed && paddleX > 0)
  {
    dp = -.5;
    paddleX -= 4;
  }
  else
  {
    dp = 0;
  }
  requestAnimationFrame(draw);
}

function keyDownHandler(e)
{
  if(e.key == "Right" || e.key == "ArrowRight")
  {
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft")
  {
    leftPressed = true;
  }
}

function keyUpHandler(e)
{
  if(e.key == "Right" || e.key == "ArrowRight")
  {
    rightPressed = false;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft")
  {
    leftPressed = false;
  }
}

function collisionDetection()
{
  for(var c=0; c<brickColumnCount; c++)
  {
    for(var r=0; r<brickRowCount; r++)
    {
      var b = bricks[c][r];
      if(b.status == 1)
      {
        if(x>b.x && x<b.x+brickWidth && y>b.y && y<b.y+brickHeight)
        {
          dy=-dy;
          b.status = 0;
          score += b.points;
          destroyed++;
          if(destroyed == brickRowCount*brickColumnCount)
          {
            alert("STAGE CLEARED!\nSCORE: "+score);
            stageClear();
          }
        }
      }
    }
  }
}

function stageClear()
{
  for(var c=0; c<brickColumnCount; c++)
  {
    for(var r=0; r<brickRowCount; r++)
    {
      bricks[c][r].status = 1;
    }
  }
  x = canvas.width/2;
  y = canvas.height-30;
  dx = 2;
  if(dy>=-3)
  {
    dy -= .1;
  }
  else
  {
    dy = -3
  }
  paddleX = (canvas.width-paddleWidth)/2;
  destroyed = 0;
}

function drawScore()
{
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawLives()
{
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives,canvas.width-65, 20);
}

function mouseMoveHandler(e)
{
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX>paddleWidth/2 && relativeX<canvas.width-paddleWidth/2)
  {
    paddleX = relativeX - paddleWidth/2;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

draw();
