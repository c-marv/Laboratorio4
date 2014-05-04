/// <reference path='../defs/three.d.ts' />
/// <reference path='axis.ts' />
module game {
    export class Game {
        camera: THREE.PerspectiveCamera;
        scene: THREE.Scene;
        renderer: THREE.WebGLRenderer;

        width: number = window.innerWidth;
        height: number = window.innerHeight;

        axis: helper.Axis;

        ambientLigth: THREE.AmbientLight;

        constructor(container: HTMLElement, width?: number, height?: number) {
            if (width) this.width = width;
            if (height) this.height = height;
            this.init(container, 0x000000);
        }
        private init(container: HTMLElement, color: number): void {
            // Init renderer
            this.renderer = new THREE.WebGLRenderer();
            this.setBackgroundColor(new THREE.Color(color));
            this.renderer.setSize(this.width, this.height);
            // init scene
            this.scene = new THREE.Scene();
            // init camera
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            this.camera.position.x = 200;
            this.camera.position.y = 300;
            this.camera.position.z = 400;
            //this.camera.position.set(0, 0, 1000);
            //this.camera.lookAt(this.camera.position);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.scene.add(this.camera);

            // Ambient Ligth
            this.ambientLigth = new THREE.AmbientLight(0xffffff);
            this.ambientLigth.position.y = 100;
            this.scene.add(this.ambientLigth);
            // Directional Ligth
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 1).normalize();
            this.scene.add(directionalLight);

            container.appendChild(this.renderer.domElement);

            this.renderGame();

            this.axis = new helper.Axis();
        }
        setBackgroundColor(color: THREE.Color): void {
            this.renderer.setClearColor(color, 1);
            this.renderGame();
        }
        renderGame() {
            this.renderer.render(this.scene, this.camera);
        }
        enableAxis() {
            this.axis.enable(this);
            this.renderGame();
        }
        disableAxis() {
            this.axis.disable(this);
            this.renderGame();
        }
    }
}