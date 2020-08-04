// actually makes the game run, handles fizzix and stuff

var paused = false;

var progress = 0;

function start_game() {
    current_level = new Level(GAME_LEVELS[progress]);
    requestAnimationFrame(cycle);
}

function pause_game() {
    paused = true;
}

function resume_game() {
    paused = false;
}

var last_time = null;
function cycle(time) {
    var lapse;
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = time - last_time;
    }
    last_time = time;
    
    if (!paused) current_level.update(lapse);
    
    viewport.update();
    viewport.draw();
    
    requestAnimationFrame(cycle);
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
    });
}

function debug() {
    init();
    current_level = new Level(test_level);
    requestAnimationFrame(cycle);
}

function play_coin_pickup_sound() {
    zzfx(1,.01,1147,0,.03,.23,1,.5,0,0,634,.03,0,0,0,0,0,.71,.07);
}

function play_die_sound() {
    zzfx(1,.05,349,0,.08,.45,0,.5,0,-6.9,0,0,0,.2,.7,.1,.1,.88,.09);
}

function play_next_level_sound() {
    zzfx(.4,.05,3,.1,0,.07,1,0,0,35,0,0,0,0,0,0,0,.4,.13);
}

function play_win_sound() {
    zzfx(1,.05,331,.22,.09,.24,1,1.58,6.9,0,-196,.01,.11,0,.2,0,.13,.84,.07);
}

function play_jump_sound() {
    zzfx(1,.05,314,0,.07,.13,0,.64,0,4.9,0,0,0,0,0,.1,.05,.96,.03);
}