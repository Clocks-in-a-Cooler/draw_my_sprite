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
}

// the dynamic parts of the level
var actor_key = {
    "@": Player, //"player",
    "$": Goal, //"goal",
    "o": Coin, //"coin",
    "^": Trap, //trap facing up
    "V": Trap, //trap facing down
    "<": Trap, //trap facing left
    ">": Trap, //trap facing right
}

function Level(plan) {
    this.width  = plan[0].length;
    this.height = plan.length;
    
    this.background_colour = "white";
    
    this.grid   = [];
    this.actors = []; // if you've played minecraft you can think of these as entities. then this.grid would be the blocks.
    
    for (var y = 0; y < plan.length; y++) {
        var line = plan[y], gridline = [];
        for (var x = 0; x < line.length; x++) {
            var character = line[x], tile_type = null;
            
            var Actor = actor_key[character];
            if (Actor) {
                this.actors.push(new Actor(new Vector(x, y), character));
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
        this.lose();
        return null;
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
                load_level(GAME_LEVELS[progress]);
            } else if (this.status == "won") {
                // advance to the next level
                progress++;
                if (GAME_LEVELS[progress]) {
                    load_level(GAME_LEVELS[progress]);
                } else {
                    conversation(["you've beat the game! Congrats!"], nothing);
                    pause_game();
                    play_win_sound();
                }
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
    
    if (!this.has_coins() && !sprites_drawn["goal"]) {
        pause_game();
        draw_goal_sprite();
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

Level.prototype.has_coins = function() {
    return this.actors.some(a => { return a.type == "coin"; })
};

Level.prototype.lose = function() {
    if (!this.status) {
        // you lose!
        this.status            = "lost";
        this.finish_delay      = 2000;
        this.background_colour = this.lose_colour;
        play_die_sound();
    }
}

Level.prototype.win = function() {
    if (!this.status) {
        // you win!
        this.status = "won";
        this.finish_delay = 2000;
        this.background_colour = this.win_colour;
        play_next_level_sound();
    }
}

// prize to whoever can figure out what this does
function Player(pos) {
    this.pos    = pos.plus(new Vector(0, -1));
    this.size   = new Vector(0.8, 1.8);
    this.motion = new Vector(0, 0);
    this.active = true;
    this.facing = "right";
}

Player.prototype.type = "player";

// tinker around to find the right values for good gameplay
Player.prototype.speed   = 0.007;
Player.prototype.gravity = 0.00003;
Player.prototype.jump    = 0.017;

Player.prototype.move_x = function(lapse, level) {
    this.motion.x = ((keys.left ? -1 : 0) + (keys.right ? 1 : 0)) * this.speed;
    var new_pos   = this.pos.plus(new Vector(this.motion.x * lapse, 0));
    
    if (this.motion.x > 0) {
        this.facing = "right";
    }
    if (this.motion.x < 0) {
        this.facing = "left";
    }
    
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
            play_jump_sound();
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
    if (!sprites_drawn["player"]) {
        pause_game();
        draw_player_sprite();
    }
    
    if (sprites_drawn["player"] && !sprites_drawn["wall"]) {
        pause_game();
        draw_wall_sprite();
    }
    
    this.move_x(lapse, level);
    this.move_y(lapse, level);
};

// it's a trap!
function Trap(pos, char) {
    switch (char) {
        case "^":
            this.pos  = pos.plus(new Vector(0, 0.5));
            this.size = new Vector(1, 0.5);
            this.rot  = "up";
            break;
        case "V":
            this.pos  = pos;
            this.size = new Vector(1, 0.5);
            this.rot  = "down";
            break;
        case "<":
            this.pos  = pos.plus(new Vector(0.5, 0));
            this.size = new Vector(0.5, 1);
            this.rot  = "left";
            break;
        case ">":
            this.pos  = pos;
            this.size = new Vector(0.5, 1);
            this.rot  = "right";
            break;
    }
    
    this.active = true;
    this.type   = "trap";
}

Trap.prototype.update = function(lapse) {
    // do nothing
    return;
};

Trap.prototype.collision = function(level) {
    if (!sprites_drawn["trap"]) {
        pause_game();
        draw_trap_sprite();
    }
    level.lose();
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
    play_coin_pickup_sound();
    this.active = false;
    if (!sprites_drawn["coin"]) {
        pause_game();
        draw_coin_sprite();
    }
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
    if (level.has_coins()) {
        // for now
        conversation(["get all the coins first."], nothing);
        return;
    }
    
    // win the level
    level.win();
}