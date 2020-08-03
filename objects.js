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
    
    this.coin_count = 0;
    
    this.background_colour = "white";
    
    this.grid   = [];
    this.actors = []; // if you've played minecraft you can think of these as entities. then this.grid would be the blocks.
    
    for (var y = 0; y < plan.length; y++) {
        var line = plan[y], gridline = [];
        for (var x = 0; x < line.length; x++) {
            var character = line[x], tile_type = null;
            
            if (character == "o") {
                this.coin_count++;
            }
            
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

Level.prototype.lose_colour = "firebrick";
Level.prototype.win_colour  = "mediumspringgreen";

Level.prototype.get_obstacle = function(pos, size) {
    var left = Math.floor(pos.x), right  = Math.ceil(pos.x + size.x);
    var top  = Math.floor(pos.y), bottom = Math.ceil(pos.y + size.y);
    
    // return "wall" for the top and sides of the level, and "u-trap" for the bottom
    // this keeps the player inside the level, or kills the player if they fall outside of it
    if (left < 0 || right > this.width || top < 0) {
        return "wall";
    }
    if (bottom > this.height) {
        return "u-trap";
    }
    
    for (var y = top; y < bottom; y++) {
        for (var x = left; x < right; x++) {
            var tile = this.grid[y][x];
            if (tile) { // if there is a wall or a trap tile there, then return. otherwise, keep looping
                return tile;
            }
        }
    }
};

Level.prototype.get_actor = function(actor) {
    for (var c = 0; c < this.actors.length; c++) {
        var other = this.actors[c];
        if (other == actor) continue;
        if (
            other.pos.x + other.size.x > actor.pos.x &&
            actor.pos.x + actor.size.x > other.pos.x &&
            other.pos.y + other.size.y > actor.pos.y &&
            actor.pos.y + actor.size.y > other.pos.y
        ) return other;
    }
};

var max_lapse = 50; // milliseconds, that is

Level.prototype.update = function(lapse) {
    if (this.status != null) {
        this.finish_delay -= lapse;
        if (this.finish_delay <= 0) {
            if (this.status == "lost") {
                // reset
                current_level = new Level(test_level);
            }
        }
    }
    
    while (lapse > 0) {
        var step = Math.min(max_lapse, lapse);
        this.actors = this.actors.filter(a => {
            return a.active;
        });
        
        this.actors.forEach(a => {
            a.update(step, this);
        });
        
        lapse -= step;
    }
};

Level.prototype.touched = function(obj) {
    switch (obj) {
        case "u-trap":
        case "d-trap":
        case "l-trap":
        case "r-trap":
            // you lose!
            this.status            = "lost";
            this.finish_delay      = 2000;
            this.background_colour = this.lose_colour;
    }
};

// prize to whoever can figure out what this does
function Player(pos) {
    this.pos    = pos.plus(new Vector(0, -1));
    this.size   = new Vector(0.8, 1.8);
    this.motion = new Vector(0, 0);
    this.active = true;
}

Player.prototype.type = "player";

// tinker around to find the right values for good gameplay
Player.prototype.speed   = 0.007;
Player.prototype.gravity = 0.00003;
Player.prototype.jump    = 0.017;

Player.prototype.move_x = function(lapse, level) {
    this.motion.x = ((keys.left ? -1 : 0) + (keys.right ? 1 : 0)) * this.speed;
    var new_pos   = this.pos.plus(new Vector(this.motion.x * lapse, 0));
    
    var obstacle = level.get_obstacle(new_pos, this.size);
    if (obstacle) {
        // cancel the motion
        this.motion.x = 0;
        level.touched(obstacle);
    } else {
        this.pos = new_pos;
    }
    
    var actor = level.get_actor(this);
    if (actor) {
        // player has touched a coin or the goal
        actor.collision(level);
    }
};

Player.prototype.move_y = function(lapse, level) {
    this.motion.y += this.gravity * lapse;
    var new_pos    = this.pos.plus(new Vector(0, this.motion.y * lapse));
    
    var obstacle = level.get_obstacle(new_pos, this.size);
    if (obstacle) {
        // cancel the motion, check for jumping
        if (this.motion.y > 0 && keys.up) {
            this.motion.y = -this.jump;
        } else {
            this.motion.y = 0;
        }
        level.touched(obstacle);
    } else {
        this.pos = new_pos;
    }
    
    var actor = level.get_actor(this);
    if (actor) {
        // player has touched a coin or the goal
        actor.collision(level);
    }
};

Player.prototype.update = function(lapse, level) {
    this.move_x(lapse, level);
    this.move_y(lapse, level);
};

// coins and goals, heart and story of the game...
function Coin(pos) {
    this.pos    = this.base_pos = pos.plus(new Vector(0.125, 0));
    this.size   = new Vector(0.75, 0.75);
    this.wobble = Math.PI * 2 * Math.random();
    this.active = true;
}

Coin.prototype.type         = "coin";
Coin.prototype.wobble_speed = 0.008;
Coin.prototype.wobble_dist  = 0.1;

Coin.prototype.update = function(lapse) {
    this.wobble      += this.wobble_speed * lapse;
    var wobble_height = Math.sin(this.wobble) * this.wobble_dist;
    
    this.pos = this.base_pos.plus(new Vector(0, wobble_height));
};

Coin.prototype.collision = function(level) {
    this.active = false;
    level.coin_count--;
};

function Goal(pos) {
    this.pos    = this.base_pos = pos.plus(new Vector(0.1, 0.1));
    this.size   = new Vector(0.8, 0.8);
    this.wobble = Math.PI * 2 * Math.random();
    this.active = true;
}

Goal.prototype.type = "goal";

Goal.prototype.wobble_speed = 0.001;
Goal.prototype.wobble_dist = 0.1;

Goal.prototype.update = function(lapse) {
    this.wobble += this.wobble_speed * lapse;
    var wobble_x = Math.cos(this.wobble) * this.wobble_dist;
    var wobble_y = Math.sin(this.wobble) * this.wobble_dist;
    
    this.pos = this.base_pos.plus(new Vector(wobble_x, wobble_y));
};

Goal.prototype.collision = function(level) {
    if (level.coin_count > 0) {
        // for now
        console.log("get all the coins first.");
        return;
    }
    
    // advance to the next level
    console.log("you win");
}