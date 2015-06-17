"use strict";
(function() {
    //if the below two lines are not executed the matchstick will think it
    //failed to open the app and return to the default screen after a timeout

    var receiverManager = new ReceiverManager("~MessagePassingDemo"); //create a new ReceiverManager with the same app id used in the sender
    var messageChannel = receiverManager.createMessageChannel("messagePassingDemo");
    var messagesContainer = document.getElementById("messagesContainer");
    var createdAnswe;
    var info = document.getElementById("info");

    messageChannel.on("message", function(senderId, data){
        var message = JSON.parse(data);
        var messageContainer =  document.createElement("div");
        messageContainer.className = "message";
        messageContainer.innerHTML = "Message Received!<br />data: " + message.data + "<br />senderId:" + senderId;
        messagesContainer.appendChild(messageContainer);
        createdAnswer();
        setTimeout(function(){
            info.innerHTML += "<br />" + JSON.stringify(createdAnswe) + "here!";
            messageChannel.send(JSON.stringify(createdAnswe)); //messages must be stringified if json
    },1500);
    });

    function createdAnswer(){
        var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        var configuration = {};
        var options = {};

        var pc = new PeerConnection(configuration,options);

        var channelName = "screenSharingTest";
        var channelOptions = {};

        pc.createDataChannel(channelName,channelOptions);

        var constraints = {
            offerToReceiveAudio:true,
            offerToReceiveVideo:true
        };
        pc.setRemoteDescription(new SessionDescription(JSON.parse('put the offer here')));
        pc.createAnswer(function (answer) {
            pc.setLocalDescription(answer);
            createdAnswe = answer;
        },
        function(error){
            info.innerHTML += "<br />error:" + JSON.stringify(error);
        },
        constraints);
    }

    receiverManager.open();
})();
