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
var size    = 5;

function mousedown(evt) {
    mouse_is_down = true;
    mouse_pos.x = evt.offsetX; mouse_pos.y = evt.offsetY;
}

function mousemove(evt) {
    if (!mouse_is_down) {
        return;
    }
    
    if (tool == "pencil") {
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
