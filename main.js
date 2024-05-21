

function randomGradient(ix, iy) {
    const w = 32; // 32-bit unsigned integer size
    const s = w / 2;

    let a = ix >>> 0; // ensure unsigned 32-bit integer
    let b = iy >>> 0; // ensure unsigned 32-bit integer

    a = (a * 3284157443) >>> 0;

    b ^= ((a << s) | (a >>> (w - s))) >>> 0;
    b = (b * 1911520717) >>> 0;

    a ^= ((b << s) | (b >>> (w - s))) >>> 0;
    a = (a * 2048419325) >>> 0;

    let random = a * (Math.PI / ~(~0 >>> 1)); // equivalent to a * (Math.PI / 2147483647)

    // Create the vector from the angle
    let v = {
        x: Math.sin(random),
        y: Math.cos(random)
    };

    return v;
}


function randomGradientForCorner(ix, iy, x, y)
{
    // Computing the random gradients for the corner using a hashing function
    let gradient = randomGradient(ix, iy);
    // Distance Vectors
    let dx = x - ix;
    let dy = y - iy;
    // Return dot product
    return (dx * gradient.x + dy * gradient.y);    
}

function interpolate(a0, a1, w)
{
    return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
}

function perlin(x, y) //Float x, Float Y representing coordinates of every point in the canvas 
{   
    // Grid intersection points are ints
    let x0 = Math.trunc(x);
    let y0 = Math.trunc(y);
    let x1 = x0 + 1;
    let y1 = y0 + 1;

    //Interpolation Weights
    let sx = x - x0;
    let sy = y - y0;

    let n0 = randomGradientForCorner(x0, y0, x, y);
    let n1 = randomGradientForCorner(x1, y0, x, y);
    let ix0 = interpolate(n0, n1, sx);
 
    // Compute and interpolate bottom two corners
    n0 = randomGradientForCorner(x0, y1, x, y);
    n1 = randomGradientForCorner(x1, y1, x, y);
    let ix1 = interpolate(n0, n1, sx);
 
    // Final step: interpolate between the two previously interpolated values, now in y
    let value = interpolate(ix0, ix1, sy);
    
    return value;
}


window.addEventListener("load", () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    canvas.height = 900; canvas.width = 900;
    for(let i = 0; i < canvas.height; i++)
    {
        for(let j = 0; j < canvas.height; j++)
        {
            let freq = 1; let amp = 1; let val = 0;

            for(let idx = 0; idx < 12; idx++)
            {
                val += perlin(i * freq/400, j * freq/400) * amp;
                freq *= 2; amp /= 2;

            }
            val *= 1.2;
            if(val > 1) { val = 1; }
            else if(val < -1) { val = -1; }
            let color = (((val + 1) * 0.5) * 255);
            ctx.fillStyle = `rgba(${color}, ${color}, ${color}, 255)`;
            ctx.fillRect(i, j, 1, 1);
        }
    }
}); 