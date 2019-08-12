module.exports = class loadingdiv {
  constructor(elemid) {
    this.containerdiv = document.getElementById(elemid);
    this.numDots = 0;
    this.timer = setInterval(this.updateLoading.bind(this), 200);
  }

  updateLoading() {
    this.containerdiv.innerHTML += '.';
    this.numDots ++;
    if(this.numDots == 4){
      this.containerdiv.innerHTML = "LOADING";
      this.numDots = 0;
    }
  }

  stop() {
    document.body.removeChild( document.getElementById('loading-container') );
    clearInterval(this.timer);
  }
}
