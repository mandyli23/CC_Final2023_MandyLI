// from Sinaa Ascioglu's Multiplay Drawing Sketch with Sockets.io
//https://openprocessing.org/sketch/422520



var socket; /// keep track of my socket connection
var messageInput;
var sendButton;
var receivedMessages = [];
var clickedImages = [];
var squareLocations = [
    { x: 50, y: 50 },
    { x: 300, y: 50 },
    { x: 550, y: 50 },
    { x: 50, y: 300 },
    { x: 300, y: 300 },
    { x: 550, y: 300 },
    { x: 50, y: 550 },
    { x: 300, y: 550 },
    { x: 550, y: 550 },
];


//images
var img1;
var img2;
var img3;

var img4;
var img5;
var img6;

var img7;
var img8;
var img9;

//texts + bkg
var bkgimg;
var font1;
var font2;

//location variables
var l1 = 50; 
var l2 = l1 + 250;
var l3 = l2 + 250;
var s2 = 150; //size variable(for all icons)

//for the screens
var option = 0;

//for the drawGreen function
shouldDraw = false
greenPos = {x:0,y:0} //initializatin


//

function setup() {
    createCanvas(1450, 800);
    background(0);

    x = width / 2;
    y = height / 2;



    //
    messageInput = createInput();   //input box
    messageInput.position(827, 580);

    sendButton = createButton('Send'); //button
    sendButton.position(messageInput.x + messageInput.width, 580);
    sendButton.mousePressed(sendMessage);
    //

    //starting the socket connection to the server
    socket = io.connect('http://localhost:8080');
    // when we get information from the server about the


    socket.on('drawGreen', (index) => {                    //triggered from server side
        console.log("Drawing on all clients ", index);
        greenPos.x = squareLocations[index].x
        greenPos.y = squareLocations[index].y
        shouldDraw = true    
    })

    
    //msg
    socket.on('message',
        function(data) {
            console.log("Received message: " + data.message);
            receivedMessages.push(data.message);
        });

    // index of imgs
    socket.on('idx', function(data) {
        console.log("Got idx: " + data.idx);

        clickedImages.push(data.idx);
    });



} //setup function



function preload() {

    // txtinstructions = loadText('data/');
    // txtclients = loadText('data/');

    img1 = loadImage('icons/carousel.png');
    img2 = loadImage('icons/clapperboard.png');
    img3 = loadImage('icons/clown.png');

    img4 = loadImage('icons/confetti.png');
    img5 = loadImage('icons/popcorn.png');
    img6 = loadImage('icons/money.png');

    img7 = loadImage('icons/paint.png');
    img8 = loadImage('icons/pinwheel.png');
    img9 = loadImage('icons/teddybear.png');

    //background screen 1 images

    bkgimg = loadImage('data/bkgimg.jpg');

    //fonts
    font1 = loadFont('data/Funbox.otf')
    font2 = loadFont('data/LemonMilk.otf')

}


function draw() {

    if (option === 0) {

        background(bkgimg);
        messageInput.hide();
        sendButton.hide();

        strokeWeight(5);
        stroke(225, 180, 225);
        rectMode(CENTER);
        rect(windowWidth / 2, 400, 600, 500, 15);

        noStroke();
        fill(70);
        strokeWeight(2);
        textSize(35);
        textAlign(CENTER);
        textFont(font1);
        text('Player one: \n Select an object & give hints', windowWidth / 2, 350, 400, 200);
        text('Player two: \n Guess and click the correct object. You may ask for hints!', windowWidth / 2, 510, 400, 200);
        fill(225, 180, 225);
        textSize(20);
        text('Press enter to start!', windowWidth / 2, 660, 300, 100)
        fill(255);


    } else if (option === 1) {
        background(255);
        messageInput.show();
        sendButton.show();

        stroke(255, 0, 0);
        strokeWeight(4);
        rectMode(CENTER);
        rect(mouseX, mouseY, 200, 200);

        //images row 1
        image(img1, l1, l1, s2, s2); //carousel
        image(img2, l2, l1, s2, s2); //clapperboard
        image(img3, l3, l1, s2, s2); //clown

        //images row 2
        image(img4, l1, l2, s2, s2); //confetti
        image(img5, l2, l2, s2, s2); //popcorn
        image(img6, l3, l2, s2, s2)  //money

        //images row 3
        image(img7, l1, l3, s2, s2); //paint
        image(img8, l2, l3, s2, s2); //pinwheel
        image(img9, l3, l3, s2, s2); //teddybear

        //textbox
        stroke(0);
        fill(255);
        rect(1080, 300, 500, 500);



        fill(0);
        textSize(16);
        textFont(font2);
        strokeWeight(4);
        stroke(255);
        textAlign(LEFT);
        var msgTxt = receivedMessages.join("\n");  //shows messages in the text box
        text(msgTxt, 1080 + 10, 320 + 10, 500 - 20, 400 - 20);  //(size of original box paddin--> width and height)
        fill(255);

    

        if (shouldDraw) {
            console.log("DRAWING") //check if function is running
            stroke(0, 255, 0);
            strokeWeight(4);
            noFill();
            rectMode(CENTER);
            rect(greenPos.x+80, greenPos.y+80, 200, 200); 
        }
    }
}
//fixhere


function testFunction() {
    console.log("HI")
}

function keyTyped() {
    if (keyCode === ENTER) {
        option++;
    }
}


function mousePressed() {   //sending images to the other person but it doesn't show
    // socket.emit('testFunction',1000)

    //images 1-3
    if (wasClicked(l1, l1, s2, s2)) {
        send_imgindex(1, mouseX, mouseY);
        socket.emit('clickedImageIndex', 0)
    }

    if (wasClicked(l2, l1, s2, s2)) {
        send_imgindex(2, mouseX, mouseY);
        socket.emit('clickedImageIndex', 1)
    }

    if (wasClicked(l3, l1, s2, s2)) {
        send_imgindex(3, mouseX, mouseY);
        socket.emit('clickedImageIndex', 2)
    }

    //images 3-6
    if (wasClicked(l1, l2, s2, s2)) {
        send_imgindex(4, mouseX, mouseY);
        socket.emit('clickedImageIndex', 3)
    }

    if (wasClicked(l2, l2, s2, s2)) {
        send_imgindex(5, mouseX, mouseY);
        socket.emit('clickedImageIndex', 4)
    }

    if (wasClicked(l3, l2, s2, s2)) {
        send_imgindex(6, mouseX, mouseY);
        socket.emit('clickedImageIndex', 5)
    }

    //images 6-9
    if (wasClicked(l1, l3, s2, s2)) {
        send_imgindex(7, mouseX, mouseY);
        socket.emit('clickedImageIndex', 6)
    }

    if (wasClicked(l2, l3, s2, s2)) {
        send_imgindex(8, mouseX, mouseY);
        socket.emit('clickedImageIndex', 7)
    }

    if (wasClicked(l3, l3, s2, s2)) {
        send_imgindex(9, mouseX, mouseY);
        socket.emit('clickedImageIndex', 8)
    }


}


//functions




function wasClicked(x, y, w, h) {          //function to check where mouse was clicked
    if (
        mouseX > x &&
        mouseX < x + w &&
        mouseY > y &&
        mouseY < y + h
    ) {
        return true;
    } else {
        return false;
    }
}



function sendMessage() {                       //function for sending messages
    // Send the text message to the server
    var message = messageInput.value();
    console.log("Sending message:", message);
    var data = {
        message: message
    };
    socket.emit('message', data);
}



function send_imgindex(idx, mouseX, mouseY) {    //function for image locations
    //we are sending:

    var data = {
        idx: idx,
        x: mouseX, // Store the x position
        y: mouseY, // Store the y position

    };


    //send that object to the socket

    socket.emit('idx', data);

    //clickedImages.push({ x: mouseX, y: mouseY });
    console.log("sent img:", JSON.stringify(data)); //breaks apart each part of data
    console.log("sent img: " + data);
    console.log("sent img: " + idx);
}
