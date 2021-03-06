// Constants
Solar = {
  START_HEALTH: 100,
  RADIUS: 10,
  COLOR: "rgba(230,230,0,1)",
  RECYCLE: 50,
  RANGE: 100,
  ENERGY_PRODUCED: 0.3,
  STORAGE: 25,
  COST: 200,
  RADIUS: 10,
/*   SELECTED_COLOR: "880", */
  INACTIVE_COLOR: "rgba(230,230,0,0.5)",
  IS_ENERGY_SOURCE: true,
  DESCRIPTION: "Solar stations generate and distribute energy. Energy is required for other structures to operate. The more structures you have, the more energy you need to generate."
}

// Constructor for each instance
Solar.instance = function(x, y, temporary) {
  this.type = Solar;
  this.x = x;
  this.y = y;
  
  this.active = true;
  this.pulseStateOffset = Math.random() * 100;

  this.health = Solar.START_HEALTH;
  
  if (!temporary) lex.maxEnergy += Solar.STORAGE;
}

// Methods for each instance
Solar.instance.prototype.tick = function() {
  var newEnergy = lex.energy + Solar.ENERGY_PRODUCED;
  lex.energy = Math.min(newEnergy, lex.maxEnergy);
};

Solar.instance.prototype.drawOnContext = function() {
// Link with energy source  
  if (this.energySource) {
    lex.context.lineWidth = 2;
    lex.context.beginPath();
    lex.context.moveTo(this.x, this.y);
    lex.context.lineTo(this.energySource.x, this.energySource.y);
    lex.context.strokeStyle = "rgba(75,75,255," + this.linkAlpha(75) + ")";
    lex.context.stroke();
    lex.context.lineWidth = 1;
  }
  
// Link with target
  if (this.target && this.active) {
    lex.context.lineWidth = 2;
    lex.context.beginPath();
    lex.context.moveTo(this.x, this.y);
    lex.context.lineTo(this.target.x, this.target.y);
    lex.context.strokeStyle = "rgba(255,255,255," + this.linkAlpha(100) + ")";
    lex.context.stroke();
    lex.context.lineWidth = 1;
  }
  
// Building itself
  lex.context.beginPath();  
  lex.context.arc(this.x, this.y, this.type.RADIUS, 0, Math.PI * 2, true);
  
// Border
  if (lex.selectedBuilding == this) {
    lex.context.strokeStyle = "#FFF";
    lex.context.lineWidth = 2;
  } else {
    lex.context.strokeStyle = "#000";
  }
  lex.context.stroke();
  lex.context.closePath();
  
// Fill
  if (this.active)
    lex.context.fillStyle = this.type.COLOR;
  else
    lex.context.fillStyle = this.type.INACTIVE_COLOR;

  lex.context.fill();
  lex.context.lineWidth = 1;
}

Solar.instance.prototype.linkAlpha = function(speed) {
  var pulseState = (lex.pulseState + this.pulseStateOffset) % speed;
  
  var alpha = (pulseState / speed);
  if (alpha > 0.5) {
    alpha = 1-alpha;
  }
  
  var normalisedAlpha = (1 + alpha) / 2;
  return normalisedAlpha;
}

Solar.instance.prototype.takeHit = function(damage) {
  this.health -= damage;
  if (this.health <= 0) {
    var id = lex.buildings.indexOf(this);
    lex.buildings.splice(id, 1);
  }
}