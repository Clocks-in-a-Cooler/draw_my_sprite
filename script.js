function conversation(messages, after) {
    //shows the player a series of text in #message
    //after it's done, call the after function
    
    var elt = document.getElementById("message");
    
    var continue_button       = document.createElement("button");
    continue_button.innerHTML = "—>";
    continue_button.className = "continue-conversation";
    
    var index = 0;
    
    function next_message() {
        index++;
        if (index < messages.length) {
            message.innerHTML = messages[index];
            message.appendChild(continue_button);
        } else {
            continue_button.removeEventListener("click", next_message);
            message.innerHTML = "";
            after();
        }
    }
    
    continue_button.addEventListener("click", next_message);
    
    message.innerHTML = messages[index];
    message.appendChild(continue_button);
}

function nothing() {
    // nothing
    return;
}