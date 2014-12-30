"use strict";
(function() {
    var appid = "~MessagePassingDemo"; //Unique id of your application, must start with a ~
    var matchstickIPAddress = "192.168.1.232"; //IP address of the matchstick
    var receiverAppUrl = "http://192.168.1.182:8080/Matchstick-Message-Passing/Receiver/Receiver.html"; //Url of the page to load on the receiver
    var timeout = -1; //after not communicating with the sender for this many milliseconds return to the default matchstick screen. -1 means don't timeout
    var useInterprocessCommunication = true; //not sure what this means for my application
    var isRunning = false;
    var messageChannel; //used to send messages between sender and receiver
    var senderDaemon = new SenderDaemon(matchstickIPAddress, appid); //comes from the sender api, is the object which will be used to communicate with the matchstick
    var messagesContainer = document.getElementById("messagesContainer");
    
    
    senderDaemon.on("appopened", function (channel) {
        messageChannel = channel;
        
        messageChannel.on("message",function(senderId,data){
            var message = JSON.parse(data);
            alert(message);
            var messageContainer =  document.createElement("div");
            messageContainer.className = "message";
            messageContainer.innerHTML = "Message Received!<br />data: " + message.data;
            messagesContainer.appendChild(messageContainer);
        });
    });

    document.getElementById("toggleAppStatus").onclick  = function(){
        if(isRunning)
        {
            document.getElementById("postMessage").className = "disabled";
            this.innerHTML = "Launch App";
            senderDaemon.closeApp();
        }
        else 
        {
            document.getElementById("postMessage").className = "";
            this.innerHTML = "Close App";
            senderDaemon.openApp(receiverAppUrl, timeout, useInterprocessCommunication);
        }
        
        isRunning = !isRunning;
    };
    document.getElementById("postMessage").onclick = function(){
        if(this.className.indexOf("disabled") >= 0)
        {
            alert("App must be running on receiver before you can send a message.\nPlease click launch app, then try again");
            return;
        }
        
        //messages can be of any type. Including complex josn objects;
        var message = {
            data: 'sender app says hello'
        };
        messageChannel.send(JSON.stringify(message)); //messages must be stringified if json
    };
})();