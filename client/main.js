
var fIn = document.querySelector(".file");
globalFileReader = new FileReader();
var fileRes;
globalFileReader.onload = function(evt) {
    fileRes = globalFileReader.result;
    console.log("Fineshed Reading");
};
fIn.onchange = function(evt) {
    globalFileReader.readAsText(fIn.files[0]);
    console.log("begins Reading");
}
function submit() {
    fetch('/', {
        method: "POST",
        headers: new Headers({
            xs: xsize,
            ys: ysize
        }),
        body: fIn.files[0]
    }).then(function(res) {
        res.blob
    });
}