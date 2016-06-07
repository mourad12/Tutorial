var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
 
  var HIGH_SCORE = 0;
 var score = 0;

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

function cellAtPixelCoord(layer, x,y)
{
if(x<0 || x>SCREEN_WIDTH || y<0)
return 1;
// let the player drop of the bottom of the screen (this means death)
if(y>SCREEN_HEIGHT)
return 0;
return cellAtTileCoord(layer, p2t(x), p2t(y));
};
function cellAtTileCoord(layer, tx, ty)
{
if(tx<0 || tx>=MAP.tw || ty<0)
return 1;
// let the player drop of the bottom of the screen (this means death)
if(ty>=MAP.th)
return 0;
return cells[layer][ty][tx];
};
function tileToPixel(tile)
{
return tile * TILE;
};
function pixelToTile(pixel)
{
return Math.floor(pixel/TILE);
};
function bound(value, min, max)
{
if(value < min)
return min;
if(value > max)
return max;
return value;
}

function cellAtPixelCoord(layer, x,y)
{
if(x<0 || x>SCREEN_WIDTH) // remove ‘|| y<0’
return 1;
// let the player drop of the bottom of the screen
// (this means death)
if(y>SCREEN_HEIGHT)
return 0;
return cellAtTileCoord(layer, p2t(x), p2t(y));
};
function cellAtTileCoord(layer, tx, ty) // remove ‘|| y<0’
{
if(tx<0 || tx>=MAP.tw)
return 1;
// let the player drop of the bottom of the screen
// (this means death)
if(ty>=MAP.th)
return 0;
return cells[layer][ty][tx];
};


var LAYER_BACKGOUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;


// define some constant values for the game states
var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var gameState = STATE_SPLASH;
 

 var splashTimer = 3;
function runSplash(deltaTime)
{
splashTimer -= deltaTime;
if(splashTimer <= 0)
{
gameState = STATE_GAME;
return;
}
context.fillStyle = "#000";
context.font="24px Arial";
context.fillText("SPLASH SCREEN", 200, 240);
}


function runGameOver(deltaTime)
{context.fillStyle = "#000";
context.font="24px Arial";
context.fillText("GAME OVER", 200, 240);
context.fillStyle = "blue"
context.fillText(HIGH_SCORE,250,300);
}

for( var layerIdx=0; layerIdx < LAYER_COUNT; layerIdx++ )
{
 for( var y = 0; y < level1.layers[layerIdx].height; y++ )
 {
var idx = y * level1.layers[layerIdx].width + startX;
for( var x = startX; x < startX + maxTiles; x++ )
{
 if( level1.layers[layerIdx].data[idx] != 0 )
 {
 // the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile),
 // so subtract one from the tileset id to get the
 // correct tile
 var tileIndex = level1.layers[layerIdx].data[idx] - 1;
 var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) *
(TILESET_TILE + TILESET_SPACING);
 var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) *
(TILESET_TILE + TILESET_SPACING);
 context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE,
(x-startX)*TILE - offsetX, (y-1)*TILE, TILESET_TILE, TILESET_TILE);
 }
 idx++;
}
 }
}

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;
var enemies = [];
var LAYER_COUNT = 3;
var LAYER_BACKGOUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;
var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;

var Bullet = function(x, y, moveRight)
{
this.sprite = new Sprite("bullet.png");
this.sprite.buildAnimation(1, 1, 32, 32, -1, [0]);
this.sprite.setAnimationOffset(0, 0, 0);
this.sprite.setLoop(0, false);
this.position = new Vector2();
this.position.set(x, y);
this.velocity = new Vector2();
this.moveRight = moveRight;
if(this.moveRight == true)
this.velocity.set(MAXDX *2, 0);
else
this.velocity.set(-MAXDX *2, 0);
}

Bullet.prototype.update = function(dt)
{
this.sprite.update(dt);
this.position.x = Math.floor(this.position.x + (dt * this.velocity.x));
}
Bullet.prototype.draw = function()
{
var screenX = this.position.x - worldOffsetX;
this.sprite.draw(context, screenX, this.position.y);
}

function drawMap()
{
for(var layerIdx=0; layerIdx<LAYER_COUNT; layerIdx++)
{

var offsetx =level1.layers[layerIdx].offsetx || 0;
var offsety =level1.layers[layerIdx].offsety || 0;

var idx = 0;
for( var y = 0; y < level1.layers[layerIdx].height; y++ )
{
for( var x = 0; x < level1.layers[layerIdx].width; x++ )
{
if( level1.layers[layerIdx].data[idx] != 0 )
{

if(level1.layers[layerIdx].data[idx] == 0)continue;
var tileIndex = level1.layers[layerIdx].data[idx] - 1;
var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE + offsetx,(y-1)*TILE + offsety, TILESET_TILE, TILESET_TILE);
}
idx++;
}
}
}
}

function tileToPixel(tile)
{
return tile * TILE;
};
function pixelToTile(pixel)
{
return Math.floor(pixel/TILE);
};





var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var LAYER_COUNT =level1.layers.length;
var MAP = {tw:level1.width,th: level1.height};
var TILE = level1.tilewidth;
var TILESET_TILE = level1.tilesets[0].tilewidth;
var TILESET_PADDING = level1.tilesets[0].margin;
var TILESET_SPACING = level1.tilesets[0].spacing;
var  TILESET_COUNT_X = level1.tilesets[0].columns;
var TILESET_COUNT_Y  = level1.tilesets[0].tilecount
							/ TILESET_COUNT_X;

var tileset = document.createElement("img");
tileset.src = level1.tilesets[0].image;
var heartImage = document.createElement("img");
heartImage.src = "hearted-small.png"

// abitrary choice for 1m
var METER = TILE;
// very exaggerated gravity (6x)
var GRAVITY = METER * 9.8 * 6;
// max horizontal speed (10 tiles per second)
var MAXDX = METER * 10;
// max vertical speed (15 tiles per second)
var MAXDY = METER * 15;
// horizontal acceleration - take 1/2 second to reach maxdx
var ACCEL = MAXDX * 2;
// horizontal friction - take 1/6 second to stop from maxdx
var FRICTION = MAXDX * 6;
// (a large) instantaneous jump impulse
var JUMP = METER * 1500;


var player = new Player();
var keyboard = new Keyboard();
var viewOffset = new Vector2();





//-------------------- Don't modify anything below here



var cells = []; // the array that holds our simplified collision data



function initialize() 



{
	// initialize trigger layer in collision map
cells[LAYER_OBJECT_TRIGGERS] = [];
idx = 0;
for(var y = 0; y < level1.layers[LAYER_OBJECT_TRIGGERS].height; y++) {
cells[LAYER_OBJECT_TRIGGERS][y] = [];
for(var x = 0; x < level1.layers[LAYER_OBJECT_TRIGGERS].width; x++) {
if(level1.layers[LAYER_OBJECT_TRIGGERS].data[idx] != 0) {
cells[LAYER_OBJECT_TRIGGERS][y][x] = 1;
cells[LAYER_OBJECT_TRIGGERS][y-1][x] = 1;
cells[LAYER_OBJECT_TRIGGERS][y-1][x+1] = 1;
cells[LAYER_OBJECT_TRIGGERS][y][x+1] = 1;
}
else if(cells[LAYER_OBJECT_TRIGGERS][y][x] != 1) {
// if we haven't set this cell's value, then set it to 0 now
cells[LAYER_OBJECT_TRIGGERS][y][x] = 0;
}
idx++;
}
}
	
	musicBackground = new Howl(  
{
urls: ["background.ogg"],
loop: true,
buffer: true,
volume: 1
} );
musicBackground.play();
sfxFire = new Howl(
{
urls: ["fireEffect.ogg"],
buffer: true,
volume: 1,
onend: function() {
isSfxPlaying = false;
}
} );


for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) { // initialize the collision map
cells[layerIdx] = [];
var idx = 0;
for(var y = 0; y < level1.layers[layerIdx].height; y++) {
cells[layerIdx][y] = [];
for(var x = 0; x < level1.layers[layerIdx].width; x++) {
if(level1.layers[layerIdx].data[idx] != 0) {
// for each tile we find in the layer data, we need to create 4 collisions
// (because our collision squares are 35x35 but the tile in the level are 70x70)
cells[layerIdx][y][x] = 1;
cells[layerIdx][y-1][x] = 1;
cells[layerIdx][y-1][x+1] = 1;
cells[layerIdx][y][x+1] = 1;
}
else if(cells[layerIdx][y][x] != 1) {
cells[layerIdx][y][x] = 0; // if we haven't set this cell's value, then set it to 0 now
}
idx++;
}
}
}

// add enemies
idx = 0;
for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++) {
for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++) {
if(level1.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) {
var px = tileToPixel(x);
var py = tileToPixel(y);
var e = new Enemy(px, py);
enemies.push(e);
}
idx++;
}
} 
}

var lives = 3;

function runGame(deltaTime)
{
context.fillStyle = "#ccc";
context.fillRect(0, 0, canvas.width, canvas.height);


context.save();
if(player.position.x>= viewOffset.x + canvas.width/2)
{
	viewOffset.x = player.position.x - canvas.width/2;
}
context.translate(-viewOffset.x,0);
drawMap();
player.update(deltaTime);
player.draw();

for(var i=0; i<enemies.length; i++)
{
enemies[i].update(deltaTime);
}

context.restore()
// update the frame counter
fpsTime += deltaTime;
fpsCount++;
if(fpsTime >= 1)
{
fpsTime -= 1;
fps = fpsCount;
fpsCount = 0;
}
// life counter
for(var i=0; i<lives; i++)
{
context.drawImage(heartImage, 20 + ((heartImage.width+2)*i), 10);
}

// score
context.fillStyle = "yellow";
context.font="32px Arial";
var scoreText = "Score: " + score;
context.fillText(scoreText, SCREEN_WIDTH - 170, 35);
// draw the FPS
context.fillStyle = "#f00";
context.font="14px Arial";
context.fillText("FPS: " + fps, 5, 20, 100);
}

initialize();

function run()
{
context.fillStyle = "#ccc";
context.fillRect(0, 0, canvas.width, canvas.height);
var deltaTime = getDeltaTime();
switch(gameState)
{
case STATE_SPLASH:
runSplash(deltaTime);
break;
case STATE_GAME:
runGame(deltaTime);
break;
case STATE_GAMEOVER:
runGameOver(deltaTime);
break;
}
}
//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
   window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
 
