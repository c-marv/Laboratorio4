/// <reference path='defs/three.d.ts' />
/// <reference path='classes/axis.ts' />
/// <reference path='classes/game.ts' />
/// <reference path='classes/utils.ts' />
class CameraMouseControl {
    game: game.Game;
    isMouseDown = false;
    onMouseDownPosition: THREE.Vector2;
    radious = 500; theta = 45; onMouseDownTheta = 45; phi = 60; onMouseDownPhi = 60;

    constructor(game: game.Game) {
        this.game = game;
        this.onMouseDownPosition = new THREE.Vector2(0, 0);
        this.game.camera.position.x = this.radious * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
        this.game.camera.position.y = this.radious * Math.sin(this.phi * Math.PI / 360);
        this.game.camera.position.z = this.radious * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360)
        this.game.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.game.renderGame();
        document.onmousedown = (e: MouseEvent) => this.onMouseDown(e); 
        document.onmouseup = (e: MouseEvent) => this.onMouseUp(e);
        document.onmousemove = (e: MouseEvent) => this.onMouseMove(e);
        document.onmousewheel = (e: MouseWheelEvent) => this.onMouseWheel(e);
    }
    onMouseDown(e: MouseEvent) {
        e.preventDefault();
        
        this.isMouseDown = true;
        this.onMouseDownTheta = this.theta;
        this.onMouseDownPhi = this.phi;
        this.onMouseDownPosition.set(e.clientX, e.clientY);
    }
    onMouseMove(e: MouseEvent) {
        e.preventDefault();
        if (this.isMouseDown) {
            this.theta = ((e.clientX - this.onMouseDownPosition.x) * 0.5) + this.onMouseDownTheta;
            this.phi = ((e.clientY - this.onMouseDownPosition.y) * 0.5) + this.onMouseDownPhi;
            //this.phi = Math.min(180, Math.max(0, this.phi));
            this.game.camera.position.x = this.radious * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
            this.game.camera.position.y = this.radious * Math.sin(this.phi * Math.PI / 360);
            this.game.camera.position.z = this.radious * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
            this.game.camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        this.game.renderGame();
    }
    onMouseUp(e: MouseEvent) {
        e.preventDefault();
        this.isMouseDown = false;
        this.onMouseDownPosition.set(e.clientX - this.onMouseDownPosition.x, e.clientY - this.onMouseDownPosition.y);
        this.game.renderGame();
    }
    onMouseWheel(e: MouseWheelEvent) {
        this.radious -= e.wheelDelta;
        this.game.camera.position.x = this.radious * Math.sin(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
        this.game.camera.position.y = this.radious * Math.sin(this.phi * Math.PI / 360);
        this.game.camera.position.z = this.radious * Math.cos(this.theta * Math.PI / 360) * Math.cos(this.phi * Math.PI / 360);
        this.game.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.game.renderGame();
    }
}


class Main extends game.Game {
    speed = 5;
    constructor(container: HTMLElement) {
        super(container);
        document.body.onkeypress = (e: KeyboardEvent) => {
            console.log(e.keyCode);
            if (e.keyCode == 100) {
                this.camera.position.x += this.speed;
            } else if (e.keyCode == 97) {
                this.camera.position.x -= this.speed;
            } else if (e.keyCode == 119) {
                this.camera.position.z -= this.speed;
            } else if (e.keyCode == 115) {
                this.camera.position.z += this.speed;
            } 
        };
        
        this.renderGame();
        var controls = new CameraMouseControl(this);
    }
    drawScenary() {
        this.drawGround();
        this.drawObjects();

        this.renderGame();
    }
    private drawObjects() {
        // boxs
        var box_material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('ts/textures/crate.jpg')
        });
        for (var i = 0; i < 5; i++) {
            var box1 = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), box_material);
            box1.position.set(-250 + (i * 50), 25, -250);

            var box2 = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), box_material);
            box2.position.set(-250, 25, -250 + (i * 50));

            this.scene.add(box1);
            this.scene.add(box2);
        }

        var rock_material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('ts/textures/rock.jpg') });
        var loader = new THREE.JSONLoader();
        loader.load('ts/geometry/rock.js', (geometry: THREE.Geometry) => {
            // rock geometry
            for (var i = 0; i < geometry.vertices.length; i++) {
                console.log(geometry.vertices[i].x + ',' + geometry.vertices[i].y + ',' + geometry.vertices[i].z);
            }

            var rock = new THREE.Mesh(geometry, rock_material);
            rock.scale.addScalar(50);
            rock.position.set(200, 5, -200);
            this.scene.add(rock);

            for (var i = 0; i < 30; i++) {
                var mesh = new THREE.Mesh(geometry, rock_material);
                var signx = Math.random() < 0.5 ? 1 : -1;
                var signy = Math.random() < 0.5 ? 1 : -1;
                mesh.position.x = Math.random() * 270 * signx;
                mesh.position.z = Math.random() * 270 * signy;
                mesh.scale.addScalar(Math.random() * 10);
                mesh.rotation.x = utils.degrees2radians(Math.random() * 90); 
                this.scene.add(mesh);
            }
        });
    }
    private drawGround() {
        var ground_material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('ts/textures/grass.jpg') });
        for (var i = 0; i < 30; i++) {
            for (var j = 0; j < 30; j++) {
                var plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), ground_material);
                plane.rotation.x = utils.degrees2radians(-90);
                plane.position.x = i * 20 - 300;
                plane.position.z = j * 20 - 300;
                this.scene.add(plane);
            }
        }
        var grass_material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('ts/textures/green-grass.jpg') });
        var loader = new THREE.JSONLoader();
        loader.load('ts/geometry/grass.js', (geometry: THREE.Geometry) => {
            for (var i = 0; i < 100; i++) {
                var mesh = new THREE.Mesh(geometry, grass_material);
                mesh.scale.addScalar(5);
                mesh.scale.y = (Math.random() * 9) + 9;
                //mesh.scale.y = 10;
                //mesh.scale.divideScalar(0.5);
                var signx = Math.random() < 0.5 ? 1 : -1;
                var signy = Math.random() < 0.5 ? 1 : -1;
                mesh.position.x = Math.random() * 270 * signx;
                mesh.position.z = Math.random() * 270 * signy;
                this.scene.add(mesh);
            }
        });
    }
    animate() {
        this.renderGame();
        requestAnimationFrame(() => this.animate());
    }
}
window.onload = () => {
    var main = new Main(document.body);
    main.setBackgroundColor(new THREE.Color(0xffffff));
    main.drawScenary();
    main.enableAxis();
    //main.animate();
};