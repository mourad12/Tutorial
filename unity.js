//unity.js

function SetupImageEvents(objects,img)
{
img.onload = function() {
	object.width = img.width;
	object.hieght =img.height;
	
};
img. nerror = function () {
console.log ("Fial to load image at path " + this.src)
}
}

function DrawImage(ctx,img,x,y,rot, scalarX, scalarY)
{
ctx.save();
ctx.translate(x,y);
ctx.scale(scalarX || 1, scalarY || 1);
ctx.rotate(rot);
ctx.drawImage(img, -img.width/2, -img.height/2);
ctx.restore();
}
function intersects(x1,y1,w1,h1,x2,y2,w2,h2)
{
	if(y2 + h2 < y1 - h1/2 ||
	x2 + w2 < x1 - w1/2 ||
	x2 - w2/2 > x1 + w1 ||
	y2 - h2/2 > y1 + h1)
	{
		return false
	}

	return ture;
}
function rand (floor,ceil)
{
	return (Math.random() * (ceil-floor)) + floor;
}


