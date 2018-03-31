var Ractive  = require("ractive");
window.Ractive = Ractive;
//window.rt = require('ractive-touch');
//Ractive.events.tap = require( 'ractive-events-tap' );


//var anime = require('animejs');

//import Ractive from 'ractive';

//Ractive.defaults.isolated=true;
Ractive.prototype.unset = function(keypath){
    var lastDot = keypath.lastIndexOf( '.' ),
        parent = keypath.substr( 0, lastDot ),
        property = keypath.substring( lastDot + 1 );

    this.set(keypath);
    delete this.get(parent)[property];
    return this.update(keypath);
}

console.log('ke')
/*
window.alertify = require('alertifyjs')
require('ion-sound')
alertify.defaults = {
    notifier:{
        // auto-dismiss wait time (in seconds)  
        delay:5,
        // default position
        position:'top-right',
        // adds a close button to notifier messages
        closeButton: false
    }
};

alertify.notify('Šifra je vec očitana', 'warning', 3);
*/

//  S O C K E T S 
window.socket = io.connect();
socket.on('connect', function (data) {
    ractive.set('mysockid', socket.id)
});

socket.on('signal', function (d) {// data, from
    console.log('signal from sock', d);
    if (peers[d.from]){
        peers[d.from].signal(d.data);
    }
    //socket.emit('my other event', { my: 'data' });
});

socket.on('initP2PWith', function (remoteSockId) {
    console.log('initP2PWith received with ', remoteSockId);
    initP2PWith(remoteSockId, true);
});


//PEERS
var Peer = require('simple-peer');
peers = {};
window.initP2PWith = function (remoteSockId, initiator){
    var peerParams = {
        initiator: initiator,
        trickle: true,
        reconnectTimer: 4000,
        //iceTransportPolicy: 'relay',
        config: {
            //iceTransportPolicy: 'relay',
            iceServers: [
                {"urls":"turn:159.89.1.251:3478", "username":"test", "credential":"test", "credentialType": "password"},
                {"urls":"stun:stun.sipgate.net"},
                {"urls":"stun:217.10.68.152"},
                {"urls":"stun:stun.sipgate.net:10000"},
                {"urls":"stun:217.10.68.152:10000"},
                {"urls":"turn:192.155.84.88","username":"easyRTC","credential":"easyRTC@pass", "credentialType": "password"},
                {"urls":"turn:192.155.84.88?transport=tcp","username":"easyRTC","credential":"easyRTC@pass", "credentialType": "password"},
                {
                  "urls":"turn:192.155.86.24:443",
                  "credential":"easyRTC@pass",
                  "username":"easyRTC",
                  "credentialType": "password"
                },
                {
                  "urls":"turn:192.155.86.24:443?transport=tcp",
                  "credential":"easyRTC@pass",
                  "credentialType": "password",
                  "username":"easyRTC"
                },                
                {urls: 'stun:stun1.l.google.com:19302'},
                {urls: 'stun:stun2.l.google.com:19302'},                
                {
                    urls: "stun:numb.viagenie.ca",
                    username: "pasaseh@ether123.net",
                    credential: "12345678"
                },
                {
                    urls: "turn:numb.viagenie.ca",
                    username: "pasaseh@ether123.net",
                    credential: "12345678"
                }
            ]
        }
    };

    if (initiator) {
        peerParams.initiator = true; peerParams.stream = ractive.stream
    }
    else{
        peerParams.initiator = false ;
    }
    peers[remoteSockId] = new Peer(peerParams)
    
    var p = peers[remoteSockId];
    //p._debug = console.log;


    p.on('error', function (err) { console.log('peer error', remoteSockId, err) })

    // on webrtc discovery, send it to other peer and on other peer call p2.signal(data)
    p.on('signal', function (data) {
        console.log('emiting SIGNAL', data)
        socket.emit('signal', {data:data, to:remoteSockId})
    })
    
    p.on('connect', function () {
        console.log('peer connect')
        p.send('whatever' + Math.random())
    })
    
    p.on('data', function (data) {
        console.log('data: ' + data)
    })

    p.on('stream', function (stream) {
        console.log('got remote video stream')
        // got remote video stream, now let's show it in a video tag
        document.getElementById('video').srcObject = stream;
        document.getElementById('video').play();
        ractive.set('videoIsPlaying',true);
    })
    
}

Ractive.components.Root                    =  require('./Root.html');
Ractive.components.noise                   =  require('./noise.html');
Ractive.components.qrcode                  =  require('./qrcode.html');

var ractive = new Ractive.components.Root({
    el: 'body',
    append: false,
    data:function() {
        return {
        }
    }
});
window.ractive = ractive;

ractive.set('chromeExtensionInstalled', false);
var tryCount=15;
var to = null;
window.checkChromeExtensionStatus = function(){
    if(--tryCount != 0) to = setTimeout(checkChromeExtensionStatus, 1500)
    console.log('checkChromeExtensionStatus', tryCount);
    if (typeof window.getChromeExtensionStatus == 'function')
    window.getChromeExtensionStatus(function(status) {
        if (status === 'installed-enabled') { ractive.set('chromeExtensionInstalled', true); clearTimeout(to); };
        if (status === 'installed-disabled') ractive.set('chromeExtensionInstalled', false);
    });
}
window.checkChromeExtensionStatus();

window.installScreenCaptureExtension = function(){
    if (!!window.chrome && !!chrome.webstore && !!chrome.webstore.install)
        chrome.webstore.install(
            'https://chrome.google.com/webstore/detail/ajhifddimkapgcifgcodmmfdlknahffk', 
            function(){ location.reload(); }, 
            function(error){ alert(error); }
        );
}


