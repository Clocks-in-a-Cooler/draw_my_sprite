// various parts of the game

// helper, for storing x-y pairs
function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};

Vector.prototype.times = function(factor) {
    return new Vector(this.x * factor, this.y * factor);
};

// level stuff

// stuff that doesn't move on the level
var tile_key = {
    "#": "wall",
    " ": null, // blank tile
    // traps facing various directions
    "^": "u-trap",
    "V": "d-trap",
    "<": "l-trap",
    ">": "r-trap",
}

// the dynamic parts of the level
var actor_key = {
    "@": Player, //"player",
    "$": Goal, //"goal",
    "o": Coin, //"coin",
}

function Level(plan) {
    this.width  = plan[0].length;
    this.height = plan.length;
    
    this.grid   = [];
    this.actors = []
    
    for (var y = 0; y < plan.length; y++) {
        var line = plan[y], gridline = [];
        for (var x = 0; x < line.length; x++) {
            var character = line[x], tile_type = null;
            
            var Actor = actor_key[character];
            if (Actor) {
                this.actors.push(new Actor(new Vector(x, y)));
            } else {
                tile_type = tile_key[character];
            }
            
            gridline.push(tile_type);
        }
        
        this.grid.push(gridline);
    }
    
    this.player = this.actors.filter((a) => { return a.type == "player"; })[0];
    
    this.status = this.finish_delay = null;
}

// prize to whoever can figure out what this does
function Player(pos) {
    this.pos    = pos.plus(new Vector(0, -1));
    this.size   = new Vector(0.8, 1.8);
    this.motion = new Vector(0, 0);
}

Player.prototype.type = "player";

// coins and goals, heart and story of the game...
function Coin(pos) {
    this.pos    = pos.plus(new Vector(0.125, 0));
    this.size   = new Vector(0.75, 0.75);
    this.wobble = Math.PI * 2 * Math.random();
}

Coin.prototype.type = "coin";

function Goal(pos) {
    this.pos    = pos.plus(new Vector(0.1, 0.1));
    this.size   = new Vector(0.8, 0.8);
    this.wobble = Math.PI * 2 * Math.random();
}

Goal.prototype.type = "goal";