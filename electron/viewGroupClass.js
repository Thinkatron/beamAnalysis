const xS = 721;
const yS = 1313;
const THREE = require("./three.min.js");
const OrbitControls = require("three-orbitcontrols");
function viewGroup(elements, file) {
    this.center = null;
    this.view2D = elements.dataView;
    this.viewOrtho = elements.ortho;
    this.view3D = elements.view3D;
    this.dataList = document.getElementById("dataList");
    this.file = file;
    this.ctxOrtho = this.viewOrtho.getContext("2d", {alpha: true});
    this.ctx2D = this.view2D.getContext("2d", {alpha: true});
    this.renderer3D = new THREE.WebGLRenderer( {canvas: this.view3D, antialias: true, alpha: true} );
    this.camera3D = new THREE.PerspectiveCamera( 40, this.view3D.clientWidth / this.view3D.clientHeight, 5, 4000 );
    this.scene3D = new THREE.Scene();
    this.controls = new OrbitControls(this.camera3D, this.view3D);
    this.dataMatrix = null;
    this.total = 0;
    this.maxCount = 0;
    this.orthoDat = new ImageData(yS, xS);
    this.dat2D = new ImageData(yS, xS);
    this.avgDist = 0;
    this.circleFn = () => {
        this.ctx2D.clearRect(0, 0, this.view2D.width, this.view2D.height);
        this.ctx2D.beginPath();
        this.ctx2D.arc((this.view2D.width / 2), (this.view2D.height / 2), (this.view2D.width / 2) - 5, 0, 2 * Math.PI, false);
        this.ctx2D.lineWidth = 2;
        this.ctx2D.strokeStyle = '#ffffff';
        this.ctx2D.stroke();
        this.ctx2D.beginPath();
        this.ctx2D.moveTo((this.view2D.width / 2), (this.view2D.height / 2));
        this.ctx2D.lineTo(this.view2D.width - 5, (this.view2D.height / 2));
        this.ctx2D.stroke();
        this.ctx2D.beginPath();
        this.ctx2D.arc((this.view2D.width / 2), (this.view2D.height / 2), 3, 0, 2 * Math.PI, false);
        this.ctx2D.fillStyle = '#ffffff';
        this.ctx2D.fill();
        this.ctx2D.textAlign = "center";
        this.ctx2D.fillText("r = " + Math.round(this.avgDist), ((this.view2D.width / 2) + ((this.view2D.width / 2 - 5) / 2)), this.view2D.height / 2 - 5, 4 * (this.view2D.width / 2) / 5);
    }
}


module.exports = viewGroup;