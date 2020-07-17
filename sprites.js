function create_sprite(url) {
    var elt = document.createElement("img");
    elt.src = url;
    
    return elt;
}

var sprites = {
    // to be drawn by the player
    // remember that all of the drawn sprites must be scaled down
    // by a factor of 10
    "wall": create_sprite("blank.png"),
    "coin": create_sprite("blank.png"),
    "goal": create_sprite("blank.png"),
    "trap": create_sprite("blank.png"),
    "player": create_sprite("blank.png"),
};

// drawing on the game canvas
var display = document.getElementById("game-display");
var context = display.getContext("2d");

display.width = 550; display.height = 550;

var scale                 = 20;
var sprite_scaling_factor = 0.1; // not sure if this will actually be used

var viewport = {
    width: display.width / scale,
    height: display.height / scale,
    top: 0, left: 0,
    
    update: function() {
        var player = current_level.player;
        // scrolls the player into view and updates
        var left_margin = this.x + (this.width / 3), right_margin = left_margin + (this.width / 3);
        var top_margin = this.y + (this.height / 3), bottom_margin = top_margin + (this.height / 3);
        
        // figure where to scroll
        if (player.x < left_margin) {
            // scroll left
            this.x -= left_margin - player.x;
        } else if (player.x > right_margin) {
            // scroll right
            this.x += player.x - right_margin;
        }
        
        if (player.y < top_margin) {
            this.y -= top_margin - player.y;
        } else if (player.y > bottom_margin) {
            this.y += player.y - bottom_margin;
        }
    },
    
    get_in_view: function() {
        
    },
};

var animation_time = 0;

var flip_player = false;

function draw(obj) {
    
}

function draw_frame(step) {
    animation_time += step;
    
    
}