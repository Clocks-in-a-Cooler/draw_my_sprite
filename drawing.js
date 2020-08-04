function create_drawing_canvas(width, height) {
    var canvas = document.createElement("canvas");
    
    canvas.width = width * 200;
    canvas.height = height * 200;
    
    canvas.className += "drawing-canvas";
    
    return canvas;
}

function draw_sprite(width, height, update) {
    //shows the player the canvas for drawing, plus the tools for drawing.
    //when the player is done, call the update function with the base 64 data of the drawn image.
    //update is a callback, given the async nature of this whole thing.
    
    var canvas           = create_drawing_canvas(width, height);
    var done_button      = document.createElement("button"); done_button.innerHTML = "done";
    var drawing_wrapper  = document.getElementById("drawing-wrapper");
    var drawing_controls = document.getElementById("drawing-controls");
    
    drawing_wrapper.style.width  = (width * 200) + 100 + 12 + "px";
    drawing_wrapper.style.height = (height * 200) + 50 + 2 + "px";
    
    drawing_wrapper.appendChild(canvas); drawing_controls.appendChild(done_button);
    drawing_wrapper.style.visibility = "visible";
    
    context = canvas.getContext("2d");
    
    context.lineWidth   = 5;
    context.strokeStyle = "black";
    
    canvas.addEventListener("mousedown", mousedown);
    canvas.addEventListener("mouseup", mouseup);
    canvas.addEventListener("mousemove", mousemove);
    
    done_button.addEventListener("click", () => {
        update(canvas.toDataURL());
        drawing_wrapper.style.visibility = "hidden";
        
        canvas.removeEventListener("mousedown", mousedown);
        canvas.removeEventListener("mouseup", mouseup);
        canvas.removeEventListener("mousemove", mousemove);
        
        drawing_wrapper.removeChild(canvas); drawing_controls.removeChild(done_button);
    });
}

// drawing on the canvas directly
var mouse_is_down = false;
var mouse_pos     = { x: null, y: null };

var context = null;
var tool    = "pencil";
var size    = 10;

function mousedown(evt) {
    mouse_is_down = true;
    mouse_pos.x = evt.offsetX; mouse_pos.y = evt.offsetY;
}

function mousemove(evt) {
    if (!mouse_is_down) {
        return;
    }
    
    if (tool == "pencil") {
        context.lineWidth = size;
        context.beginPath();
        context.arc(mouse_pos.x, mouse_pos.y, size / 2, 0, Math.PI * 2);
        context.closePath();
        context.fill();
        context.beginPath();
        context.moveTo(mouse_pos.x, mouse_pos.y);
        context.lineTo(evt.offsetX, evt.offsetY);
        context.closePath();
        context.stroke();
    }
    
    if (tool == "eraser") {
        context.clearRect(mouse_pos.x - 10, mouse_pos.y - 10, 20, 20);
    }
    
    mouse_pos.x = evt.offsetX; mouse_pos.y = evt.offsetY;
    
}

function mouseup(evt) {
    mouse_is_down = false;
    mouse_pos.x = null; mouse_pos.y = null;
}

var pencil_button = document.getElementById("pencil");
var eraser_button = document.getElementById("eraser");

pencil_button.addEventListener("click", () => {
    eraser_button.className = "";
    pencil_button.className = "selected";
    tool = "pencil";
});

eraser_button.addEventListener("click", () => {
    pencil_button.className = "";
    eraser_button.className = "selected";
    tool = "eraser";
});

pencil_button.click();

var sprites_drawn = {
    "player": false,
    "wall": false,
    "coin": false,
    "trap": false,
    "goal": false,
    
    set_all: function(drawn) {
        this.player = this.wall = this.coin = this.trap = this.goal = drawn;
    },
}

// lots of callback nesting below. proceed if you DARE

function draw_player_sprite() {
    conversation(["hold on...",
        "what the...!?",
        "why can't I see anything?",
        "no sprites!?",
        "what!? budgetary issues? can't afford sprites!?",
        "ugh...",
        "ok, calm down.",
        "I've got an important job for you, player.",
        "you're going to draw my sprite.",
        "the sprite will be as big as my hitbox.",
        "try to fill the whole box, okay?",
    ], function() {
        draw_sprite(0.8, 1.8, function(data) {
            sprites["player"]       = create_sprite(data);
            sprites_drawn["player"] = true;
            conversation(["ahh! that's better.",
                "use left and right arrow keys to move.",
                "up arrow key to jump."
            ], resume_game);
        });
    });
}

function draw_wall_sprite() {
    conversation(["oh, and draw the walls too. thanks.",
        "again, try to fill the entire drawing box."
    ], function() {
        draw_sprite(1, 1, function(data) {
            sprites["wall"]       = create_sprite(data);
            sprites_drawn["wall"] = true;
            resume_game();
        });
    });
}

function draw_coin_sprite() {
    conversation(["oh! there are coins here!",
        "you know what that means: draw!"
    ], function() {
        draw_sprite(0.75, 0.75, function(data) {
            sprites["coin"]       = create_sprite(data);
            sprites_drawn["coin"] = true;
            resume_game();
        });
    });
}

function draw_trap_sprite() {
    conversation(["ouch!",
        "there's something here.",
        "I think it's a trap.",
        "it'd be easier to avoid,",
        "if I could see it.",
        "you know what that means!",
    ], function() {
        draw_sprite(1, 0.5, function(data) {
            sprites["trap"]       = create_sprite(data);
            sprites_drawn["trap"] = true;
            resume_game();
        });
    });
}

function draw_goal_sprite() {
    conversation(["that's the last coin.",
        "now, where do we go next?",
        "if only we can see the level exit..."
    ], function() {
        draw_sprite(0.8, 0.8, function(data) {
            sprites["goal"]       = create_sprite(data);
            sprites_drawn["goal"] = true;
            resume_game();
        });
    });
}