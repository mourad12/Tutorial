//bullet.js

var Bullet =function()
{
	this.image = document.creteElement("img")
	this.position =new Vectors2();
	this.position.add(player.position);
	this.velocity =new Vectors2(1,0);
	this.width = 0;
	this.heigh = 0;
	var speed = 256;
	this.rotation = player.rotation;
	
	this.velocity.rotateDirection(this.rotation);
	this.velocity.multiplyScalar(speed);
	
	this.image.src = "bullet.png";
};	
	Bullet.prototype.update =function(deltaTime)
{
	var posChange = this.velocity.copy();
posChange.multiplyScalar(deltaTime)
this.position.add(posChange);
};
Bullet.prototype.draw = function()
{
	DrawImage (context, this.image,this.position.x,
	this.position.y,this.rotation);
}
