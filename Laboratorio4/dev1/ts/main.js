var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path='defs/three.d.ts' />
/// <reference path='classes/axis.ts' />
/// <reference path='classes/game.ts' />
/// <reference path='classes/utils.ts' />
var Main = (function (_super) {
    __extends(Main, _super);
    function Main(container) {
        var _this = this;
        _super.call(this, container);
        document.body.onkeypress = function (e) {
            console.log(e.keyCode);
            if (e.keyCode == 100) {
                _this.camera.position.x -= 1;
            } else if (e.keyCode == 97) {
                _this.camera.position.x += 1;
            } else if (e.keyCode == 119) {
                _this.camera.position.y -= 1;
            } else if (e.keyCode == 115) {
                _this.camera.position.y += 1;
            }
        };
    }
    Main.prototype.drawScenary = function () {
        this.drawGround();

        var box = new THREE.Mesh(new THREE.CubeGeometry(50, 50, 50), new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('ts/textures/crate.jpg') }));
        box.position.set(-250, 25, -250);
        this.scene.add(box);

        this.renderGame();
    };
    Main.prototype.drawGround = function () {
        var _this = this;
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
        loader.load('ts/geometry/grass.js', function (geometry) {
            for (var i = 0; i < 100; i++) {
                var mesh = new THREE.Mesh(geometry, grass_material);
                mesh.scale.addScalar(5);
                mesh.scale.y = 10;

                //mesh.scale.divideScalar(0.5);
                var signx = Math.random() < 0.5 ? 1 : -1;
                var signy = Math.random() < 0.5 ? 1 : -1;
                mesh.position.x = Math.random() * 270 * signx;
                mesh.position.z = Math.random() * 270 * signy;
                _this.scene.add(mesh);
            }
        });
    };
    Main.prototype.animate = function () {
        var _this = this;
        this.renderGame();
        requestAnimationFrame(function () {
            return _this.animate();
        });
    };
    return Main;
})(game.Game);
window.onload = function () {
    var main = new Main(document.body);
    main.setBackgroundColor(new THREE.Color(0xffffff));
    main.drawScenary();
    main.animate();
};
//# sourceMappingURL=main.js.map
