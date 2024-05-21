
import * as THREE from 'three';

window.addEventListener("load", () => {
    /*const canvas = document.getElementById("canvas");
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
    }*/

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Step 3: Create the Grid of Points and Lines
    const gridSize = 50;
    const gap = 1;

    const points = [];
    const lineVertices = [];


    // Create points
    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j <= gridSize; j++) {
        let val = 0;
        let freq = 1; let amp = 1;
        for(let idx = 0; idx < 20; idx++)
        {
            val += perlin((gridSize - i) * freq/100, j * freq/100) * amp;
            freq *= 2; amp /= 2;

        }
        // - gridSize to bring to center
        const x = (i - gridSize / 2 ) * gap;
        const z = (j - gridSize / 2 ) * gap;
        points.push(new THREE.Vector3(x, (val * 40), z));
      }
    }

    // Create lines between adjacent points
    for (let i = 0; i <= gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        // Horizontal lines
        lineVertices.push(points[i * (gridSize + 1) + j]);
        lineVertices.push(points[i * (gridSize + 1) + j + 1]);

        // Vertical lines
        lineVertices.push(points[j * (gridSize + 1) + i]);
        lineVertices.push(points[(j + 1) * (gridSize + 1) + i]);
      }
    }

    // Create a points material
    const pointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 0.1 });
    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointsMesh);

    // Create a line material
    const linesMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const linesGeometry = new THREE.BufferGeometry().setFromPoints(lineVertices);
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    camera.position.z = 45;
    camera.position.y = 30;
    camera.rotation.x = -Math.PI / 6;

    // Step 4: Render the Scene
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
}); 

