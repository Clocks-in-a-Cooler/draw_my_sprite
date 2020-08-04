function create_sprite(url) {
    var elt = document.createElement("img");
    elt.src = url;
    
    return elt;
}

var sprites = {
    // to be drawn by the player
    // remember that all of the drawn sprites must be scaled down
    // by a factor of 6.67
    "wall": create_sprite("blank.png"),
    "coin": create_sprite("blank.png"),
    "goal": create_sprite("blank.png"),
    "trap": create_sprite("blank.png"),
    "player": create_sprite("blank.png"),
};
/*
var sprites = {
    // for debugging only, so I don't have to redraw the same sprites a whole lotta times
    // remember that all of the drawn sprites must be scaled down
    // by a factor of 10
    "wall": create_sprite("debug/wall.png"),
    "coin": create_sprite("debug/coin.png"),
    "goal": create_sprite("debug/goal.png"),
    "trap": create_sprite("debug/trap.png"),
    "player": create_sprite("debug/player.png"),
};*/

// drawing on the game canvas
var display         = document.getElementById("game-display");
var display_context = display.getContext("2d");

display.width = 550; display.height = 550;

var scale                 = 30;
var sprite_scaling_factor = 3 / 20; // not sure if this will actually be used

var background_colour = "white"; // trusty old colour

var viewport = {
    width: display.width / scale,
    height: display.height / scale,
    x: 0, y: 0, // defines the top left corner
    
    update: function() {
        var player = current_level.player;
        // scrolls the player into view and updates
        var left_margin = this.x + (this.width / 3), right_margin = left_margin + (this.width / 3);
        var top_margin = this.y + (this.height / 3), bottom_margin = top_margin + (this.height / 3);
        
        // figure where to scroll
        if (player.pos.x < left_margin) {
            // scroll left
            this.x -= left_margin - player.pos.x;
        } else if (player.pos.x > right_margin) {
            // scroll right
            this.x += player.pos.x - right_margin;
        }
        
        // scroll up, down, you get the drill
        if (player.pos.y < top_margin) {
            this.y -= top_margin - player.pos.y;
        } else if (player.pos.y > bottom_margin) {
            this.y += player.pos.y - bottom_margin;
        }
    },
    
    draw: function() {
        // determine what to draw, where
        var left = Math.floor(this.x), right  = Math.ceil(this.x + this.width);
        var top  = Math.floor(this.y), bottom = Math.ceil(this.y + this.height);
        
        // get the actors that are currently in view
        var actors_in_view = current_level.actors.filter((a) => {
            return (
                a.pos.x + a.size.x >= left && a.pos.x <= right &&
                a.pos.y + a.size.y >= top  && a.pos.y <= bottom);
        });
        
        // make sure we don't accidentally...
        left = Math.max(left, 0), right = Math.max(current_level.width, right);
        top  = Math.max(top, 0), bottom = Math.max(current_level.height, bottom);
        
        // draw the background colour -- DUH
        display_context.fillStyle = current_level.background_colour;
        display_context.fillRect(0, 0, display.width, display.height);
        
        // draw the static stuff -- walls, traps, blank spaces
        for (var y = top; y < bottom; y++) {
            var gridline = current_level.grid[y];
            if (gridline == null) continue;
            for (var x = left; x < right; x++) {
                var tile = gridline[x];
                if (tile == null) continue;
                var screen_x = (x - this.x) * scale;
                var screen_y = (y - this.y) * scale;
                switch (tile) {
                    case "wall":
                        display_context.drawImage(sprites.wall, screen_x, screen_y, scale, scale);
                        break;
                }
            }
        }
        
        // draw the dynamic stuff -- player, coins, goal
        actors_in_view.forEach(a => {
            var screen_x = (a.pos.x - this.x) * scale, screen_y = (a.pos.y - this.y) * scale;
            
            if (a.type == "player") { // cue korobeiniki
                // for later: draw the player's sprite reversed if the player is moving left (motion.x < 0)
                if (a.facing == "left") {
                    display_context.save();
                    display_context.translate(screen_x, screen_y);
                    display_context.scale(-1, 1);
                    display_context.drawImage(sprites["player"], -a.size.x * scale, 0, a.size.x * scale, a.size.y * scale);
                    display_context.restore();
                } else {
                    display_context.drawImage(sprites["player"], screen_x, screen_y, a.size.x * scale, a.size.y * scale);
                }
            } else if (a.type == "trap") {
                display_context.save();
                display_context.translate(screen_x, screen_y);
                switch (a.rot) {
                    case "up":
                        display_context.drawImage(sprites["trap"], 0, 0, a.size.x * scale, a.size.y * scale);
                        break;
                    // for the rest, gotta reorient the context
                    case "down":
                        display_context.rotate(Math.PI);
                        display_context.drawImage(sprites["trap"], -a.size.x * scale, -a.size.y * scale, a.size.x * scale, a.size.y * scale);
                        break;
                    case "left":
                        display_context.rotate(3 * Math.PI / 2);
                        display_context.drawImage(sprites["trap"], -a.size.y * scale, 0, a.size.y * scale, a.size.x * scale);
                        break;
                    case "right":
                        display_context.rotate(Math.PI / 2);
                        display_context.drawImage(sprites["trap"], 0, -a.size.x * scale, a.size.y * scale, a.size.x * scale);
                        break;
                }
                display_context.restore();
            } else {
                display_context.drawImage(sprites[a.type], screen_x, screen_y, a.size.x * scale, a.size.y * scale);
            }
        });
    },
};

var animation_time = 0;

function draw_frame(step) {
    animation_time += step;
    
    viewport.draw();
}