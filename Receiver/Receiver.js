"use strict";
(function() {
    //if the below two lines are not executed the matchstick will think it 
    //failed to open the app and return to the default screen after a timeout
    
    var receiverManager = new ReceiverManager("~MessagePassingDemo"); //create a new ReceiverManager with the same app id used in the sender
    var messageChannel = receiverManager.createMessageChannel("messagePassingDemo");    
    var messagesContainer = document.getElementById("messagesContainer");
    
    messageChannel.on("message", function(senderId, data){
        var message = JSON.parse(data);
        var messageContainer =  document.createElement("div");
        messageContainer.className = "message";
        messageContainer.innerHTML = "Message Received!<br />data: " + message.data + "<br />senderId:" + senderId;
        messagesContainer.appendChild(messageContainer);
        
        //messages can be of any type. Including complex josn objects;
        var message = { data: 'receiver app says hello' };

        messageChannel.send(JSON.stringify(message)); //messages must be stringified if json
    });
    
    receiverManager.open();    
})();