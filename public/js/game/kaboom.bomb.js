function KaboomBomb(position, fuseTimeMs, player, explode) {
  this.position = position;
  this.fuseTimeMs = fuseTimeMs;
  this.droppedBy = player;
  this.range = player.bombPower;
  var me = this;
  this.bombTimer = setTimeout(explode, fuseTimeMs, me);
}

KaboomBomb.prototype = {

};

if (typeof exports == "object") {
  exports.KaboomBomb = KaboomBomb;
}