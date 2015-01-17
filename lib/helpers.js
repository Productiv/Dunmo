
Date.prototype.toSeconds = function() {
  return Math.round(this.getTime() / 1000);
};

