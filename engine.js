// actually makes the game run, handles fizzix and stuff

var paused = true;

function start_game() {
    
}

function pause_game() {
    
}

function resume_game() {
    
}

function cycle(time) {
    
}

// level loading and other stuff
var current_level = null;

// keys!
var keys = {
    "up": false,
    "down": false,
    "left": false,
    "right": false,
    "action": false, // whatever the hell this does... I'll see
}

function load_level(plan) {
    current_level = new Level(plan);
}

function init() {
    // sets up some stuff
    addEventListener("keydown", (evt) => {
        switch (evt.keyCode) {
            case 38:
                keys.up = true;
                break;
            case 40:
                keys.down = true;
                break;
            case 37:
                keys.left = true;
                break;
            case 39:
                keys.right = true;
                break;
            case 20: // space bar? i don't know exactly...
                keys.action = true;
                break;
        }
    });
    
    addEventListener("keyup", (evt) => {
        switch (evt.keyCode) {
            case 38:
                keys.up = false;
                break;
            case 40:
                keys.down = false;
                break;
            case 37:
                keys.left = false;
                break;
            case 39:
                keys.right = false;
                break;
            case 20:
                keys.action = false;
                break;
        }
    })
}