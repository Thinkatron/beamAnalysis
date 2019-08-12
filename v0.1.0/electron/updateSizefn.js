const xS = 721;
const yS = 1313;


function updateSize(vGL) {
    for(var i = 0; i < vGL.length; i++) {
        vGL[i].view2D.width  = window.innerHeight / 4 - 2;
        vGL[i].view2D.height = window.innerHeight * 0.25 - 2;
        vGL[i].view3D.width  = window.innerWidth * 0.5 - 2;
        vGL[i].view3D.height = 0.66 * window.innerHeight - 2;
        vGL[i].viewOrtho.width  = yS;
        vGL[i].viewOrtho.height = xS;
        vGL[i].view2D.style.width = vGL[i].view2D.width + "px";
        vGL[i].view2D.style.height = vGL[i].view2D.height + "px";
        vGL[i].view3D.style.width = vGL[i].view3D.width + "px";
        vGL[i].view3D.style.height = vGL[i].view3D.height + "px";
        vGL[i].view3D.style.width = vGL[i].view3D.width + "px";
        vGL[i].view3D.style.height = vGL[i].view3D.height + "px";
        vGL[i].viewOrtho.style.width = (window.innerWidth / 2 - 2) + "px";
        vGL[i].viewOrtho.style.height = ((window.innerWidth / 2 - 2) * xS / yS) + "px";
        vGL[i].viewOrtho.style.bottom = (((window.innerHeight *  0.41 - 2) - ((window.innerWidth / 2 - 2) * xS / yS) ) / 2) + "px";
        
        vGL[i].camera3D.aspect = vGL[i].view3D.width / vGL[i].view3D.height;
        vGL[i].renderer3D.setSize(vGL[i].view3D.width, vGL[i].view3D.height );
        vGL[i].renderer3D.setViewport(0, 0, vGL[i].view3D.width, vGL[i].view3D.height );
        vGL[i].camera3D.updateProjectionMatrix();

        vGL[i].ctxOrtho.imageSmoothingEnabled = false;
        vGL[i].ctxOrtho.putImageData(vGL[i].orthoDat, 0, 0);
        vGL[i].ctx2D.imageSmoothingEnabled = false;
        vGL[i].circleFn();
    }
}

module.exports = updateSize;