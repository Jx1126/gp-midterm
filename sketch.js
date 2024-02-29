// COMMENTARY
 /* In my app design, I've chosen to follow the pool table aesthetic shown in the assignment brief. This involves adding yellow railings behind each pocket, which I created by drawing a large yellow rectangle, and then adding brown railings and a green rectangle to cover any excess parts. I've organized them within a class structure which makes troubleshooting and accessibility easier. This class structure contains separate functions that set up individual components of the table and a draw function to draw them all together.

Throughout the code, I've added console.log statements and comments to ensure the clarity of the code. These provide other developers with insights into the code's working, allowing them to understand the functionality of each function without having to test each of them manually. Instead of hardcoding the positionings for all the objects, I used relative positioning to position and resize everything according to the rules. This allows smooth adjustments since modifying one element automatically applies corresponding changes throughout the code. Furthermore, I added text to indicate the various game modes available, along with the corresponding key to access the specific game mode, which enhances user engagement. Upon selecting a specific game mode, the relevant text will turn green, which serves as a visual indicator of the active mode. 

For the cue function, I've opted for moused-based controls to keep the game simple, thus enhancing user experience. In contrast, the keyboard keys are designed to toggle between different game modes as per the rubrics.  During the gameplay, the cue ball serves as an anchor point, with a sighting line drawn from the cue ball to the mouse location to provide guidance. The force applied to the cue ball is relative to the distance between the mouse location and the cue ball. When the cue ball is potted and awaiting user interaction to replace it at the mouse location, I implemented a text beneath the snooker table. The text instructs the users who are unfamiliar with snooker rules and conveys the actions they need to take to proceed. This ensures that users, regardless of their knowledge of snooker, can fully enjoy the game, tus enhancing its overall accessibility.

Extension-wise,  I've added sound effects as the first extension. Playing sound effects when cue ball collides with other balls can enhance the overall user experience. The second extension I've implemented introduces a new game mode other than the three listed in the rubrics. The new mode features randomly placed obstacles of various shapes on the playfield, increasing the game's difficulty significantly for those who want to challenge themself. While considering other extensions, I came up with balls changing colours upon impact with any objects on the table. However, the chance of multiple balls colliding rapidly on the table might cause flashing lights which raises concerns for photosensitive individuals to which I decided not to.*/

var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constrain = Matter.Constraint;
var Collision = Matter.Collision;

var engine;
var cushions;
var pockets;
var cue_ball;
var red_balls;
var coloured_balls;
var ball_physic;
var consecutive;
var cue_ball_potted;
var game_mode;
var obstacles;
var sfx;

let keyWasPressed;


//Table is 12ft x 6ft, 1440px x 720px, so 1ft is equivalent to 120px
var table_width = 1440;
var table_height = 720;
var padding = 10;

//Play field is 11.85ft x 5.85ft, 1422px x 702px
var rails_width = table_width - 11.85 * 120;
var rails_height = table_height - 2 * rails_width;

var balls_diameter = table_width / 36;
var balls_radius = balls_diameter / 2;

var pockets_radius = balls_radius * 1.5;
var pockets_diameter = pockets_radius * 2;

function preload(){
    // Setting the sound format to wav
    soundFormats('mp3', 'wav');
    // Loading the sound effect
    sfx = loadSound("snooker_sfx.wav");
    // Setting the volume of the sound effect
    sfx.setVolume(0.2);
}

function setup() {
	createCanvas(1460, 800);
    
    engine = Engine.create();
    engine.world.gravity.y = 0;

    //Empty arrays to store the objects
	cushions = [];
    pockets = [];
    red_balls = [];
    coloured_balls = [];
    obstacles = [];


    consecutive = false;
    cue_ball_potted = false;

    game_mode = 1;

    keyWasPressed = false;

    // Adding the ball psychics for easy access
    ball_physic = {restitution: 1, friction: 0.5};

    noStroke();

    //Creating snooker table by using class
    snookerTable = new snookerTable(padding, padding, table_width, table_height);
    
    //Generating the snooker table
    snookerTable.setup();

    setupRedBalls();
    setupCueBall();
    setupColouredBalls();

}

function draw() {

    background(100);
    Engine.update(engine);
    
    snookerTable.draw();
    
    drawRedBalls();
    drawCueBall();
    drawColouredBalls();
    
    drawSightingLine();

    checkPots();

    showGameMode();

    cueCollision();

}

function checkBallsStopped() {

    for(var i = 0; i < coloured_balls.length; i++) {
        for(var j = 0; j < red_balls.length; j++) {
            // Check if all the balls have stopped moving
            if(cue_ball.speed < 0.03 
                && coloured_balls[i][0].speed < 0.03
                && red_balls[j].speed < 0.03
                && cue_ball_potted == false) {
                return true;
            }
        }
    }
}

function drawSightingLine() {
    // Push and pop to make sure the stroke don't affect other objects
    push();
        stroke(255);
        strokeWeight(2);

        // Only draw the line if all the balls have stopped moving
        if(checkBallsStopped()) {
            // Drawing a line from the cue ball to the mouse
            line(cue_ball.position.x, cue_ball.position.y, mouseX, mouseY);
        }
    pop();
}

// Function to check the distance between the ball and the pocket
function potCondition(ball, pocket) {

    //  Checking the distance between the ball and the pocket
    var distance = dist(ball.position.x, ball.position.y, pocket[0], pocket[1]);

    // If the distance is less than the radius of the pocket, return true
    if(distance < pockets_radius) {
        return true;        
    }
}

function checkPots() {

    // Reset coloured balls position if they are potted
    for(var i = 0; i < pockets.length; i++) {
        for(var j = 0; j < coloured_balls.length; j++) {

            // Check if the coloured Ball is potted
            if(potCondition(coloured_balls[j][0], pockets[i])) {
                
                console.log("Coloured ball(s) potted");

                consecutive = true;
                // Store the coloured ball into a variable
                var reset_ball = coloured_balls[j];

                // Removing the coloured ball from the world
                World.remove(engine.world, coloured_balls[j]);
                // Removing the coloured ball from the array
                coloured_balls.splice(j, 1);

                // Resetting the coloured ball position
                Body.setPosition(reset_ball[0], {x: reset_ball[1], y: reset_ball[2]});
                // Resetting the coloured ball velocity
                Body.setVelocity(reset_ball[0], {x: 0, y: 0});
                // Pushing the coloured ball with the new position and velocity into the array
                coloured_balls.push(reset_ball);
                // Adding the coloured ball back to the world
                World.add(engine.world, coloured_balls[coloured_balls.length - 1]);
                
            }
        }
    }

    // Remove red balls if they are potted
    for(var i = 0; i < pockets.length; i++) {
        for(var j = 0; j < red_balls.length; j++) {
            
            // Check if the red ball is potted
            if(potCondition(red_balls[j], pockets[i])){

                console.log("Red ball(s) potted");

                // Set the consecutive to false
                consecutive = false;
                // Removing the red ball from the world
                World.remove(engine.world, red_balls[j]);
                // Removing the red ball from the array
                red_balls.splice(j, 1);
            }
        }
    }

    for(var i = 0; i < pockets.length; i++) {
        // Check if the cue ball is potted
        if(potCondition(cue_ball, pockets[i])) {

            // Set the cue ball potted to true if it is potted
            cue_ball_potted = true;

            if(cue_ball_potted) {

                push();

                    fill(70, 20, 20);
                    textSize(20);
                    textStyle(BOLD);
                    textAlign(CENTER);

                    text("Cue ball potted, please click to place the cue ball", table_width/2, table_height + 2 * rails_width + padding/2);

                pop();
                
            }

            // Removing the cue ball from the world
            World.remove(engine.world, cue_ball);

        }
    }
}

function mousePressed(){

    // The force to apply to the cue ball
    var force = 10000;
    // Calculating the force to apply to the cue ball
    var force_x = (cue_ball.position.x - mouseX) / force;
    var force_y = (cue_ball.position.y - mouseY) / force;
    
    // Only apply the force if the cue ball is not moving
    if(checkBallsStopped()) {
        // Playing the sound effect when the user hits the cue ball
        sfx.play();
        // Applying the force to the cue ball
        Body.applyForce(
            cue_ball,
            {x: cue_ball.position.x, y: cue_ball.position.y},
            {x: force_x, y: force_y}
        );
    };
}

function mouseClicked() {

    // If the cue ball is potted
    if(cue_ball_potted) {
        // Resetting cue ball position to the mouse clicked position
        cue_ball = Bodies.circle(mouseX, mouseY, balls_radius, ball_physic)
        // Adding the cue ball back to the world
        World.add(engine.world, cue_ball);
        // Setting the cue ball potted back false
        cue_ball_potted = false;
    }
}

function keyPressed() {

    // Only run the code if the key is not pressed so that the code only run once when pressed then released
    if(keyWasPressed) {
        return;
    }
    // Set the keyWasPressed to true when the key is pressed
    keyWasPressed = true;

    // Game mode 1: Normal mode
    // On key press 1, enter Game mode 1
    if(key == 1) {

        console.log("Game mode 1 selected.");

        game_mode = 1;

        for(var i = 0; i < coloured_balls.length; i++) {
            // Removing the coloured balls from the world
            World.remove(engine.world, coloured_balls[i][0]);
        }

        // Removing the red balls from the world
        World.remove(engine.world, red_balls);

        // Emptying the arrays
        coloured_balls = [];
        red_balls = [];
        obstacles = [];

        // Resetting the balls
        setupRedBalls();
        setupColouredBalls();
    }

    // Game mode 2: Randomize red balls position
    // On key press 2, enter Game mode 2
    if(key == "2") {

        console.log("Game mode 2 selected.");

        game_mode = 2;


        for(var i = 0; i < red_balls.length; i++) {

            // Randomizing the x and y position of the red balls
            var random_x = random(padding + 2 * rails_width + balls_radius, table_width - padding - 2 * rails_width - balls_radius);
            var random_y = random(padding + 2 * rails_width + balls_radius, table_height - padding - 2 * rails_width - balls_radius);

            // Setting the red balls position to the randomized position
            Body.setPosition(red_balls[i], {x: random_x, y: random_y});
        }

        for(var i = 0; i < coloured_balls.length; i++) {
            // Removing the coloured balls from the world
            World.remove(engine.world, coloured_balls[i][0]);
        }
        // Emptying the array
        coloured_balls = [];

        for(var i = 0; i < obstacles.length; i++) {
            // Removing the obstacles from the world
            World.remove(engine.world, obstacles[i]);
        }
        // Emptying the array
        obstacles = [];

        setupColouredBalls();


        console.log("All balls loaded successfully");
    }

    // Game mode 3: Randomize all balls position
    // On key press 3, enter Game mode 3
    if(key == 3) {

        console.log("Game mode 3 selected.");

        game_mode = 3;

        for(var i = 0; i < obstacles.length; i++) {
            // Removing the obstacles from the world
            World.remove(engine.world, obstacles[i]);
        }
        // Emptying the array
        obstacles = [];

        for(var i = 0; i < coloured_balls.length; i++) {

            // Randomizing the x and y position of the coloured balls
            coloured_balls[i][1] = random(padding + 2 * rails_width + balls_radius, table_width - padding - 2 * rails_width - balls_radius);
            coloured_balls[i][2] = random(padding + 2 * rails_width + balls_radius, table_height - padding - 2 * rails_width - balls_radius);

            // Setting the coloured balls position to the randomized position
            Body.setPosition(coloured_balls[i][0], {x: coloured_balls[i][1], y: coloured_balls[i][2]});
        }

        for(var i = 0; i < red_balls.length; i++) {
            
            // Randomizing the x and y position of the red balls
            var random_x = random(padding + 2 * rails_width + balls_radius, table_width - padding - 2 * rails_width - balls_radius);
            var random_y = random(padding + 2 * rails_width + balls_radius, table_height - padding - 2 * rails_width - balls_radius);

            // Setting the red balls position to the randomized position
            Body.setPosition(red_balls[i], {x: random_x, y: random_y});

        }

        console.log("All balls loaded successfully");
    }

    if(key == 4) {

        console.log("Game mode 4 selected.");

        game_mode = 4;

        for(var i = 0; i < coloured_balls.length; i++) {
            // Removing the coloured balls from the world
            World.remove(engine.world, coloured_balls[i][0]);
        }

        // Removing the red balls from the world
        for(var i = 0; i < red_balls.length; i++) {
            // Removing the coloured balls from the world
            World.remove(engine.world, red_balls[i]);
        }
        
        for(var i = 0; i < obstacles.length; i++) {
            World.remove(engine.world, obstacles[i])
        }

        // Emptying the arrays
        coloured_balls = [];
        red_balls = [];
        obstacles = [];

        // Resetting the balls
        setupRedBalls();
        setupColouredBalls();

        // Setting up and drawing the obstacle
        snookerTable.setupObstacles();
        
        console.log("All balls loaded successfully");
        console.log("Obstacles loaded successfully");
    }
}

function keyReleased() {

    // Set the keyWasPressed to false when the key is released
    keyWasPressed = false;

}

function showGameMode() {

    // Push and pop to make sure the styling don't affect other objects
    push();
        // Storing the game mode texts into variables
        const game_mode_1_text = "Press 1: Normal mode";
        const game_mode_2_text = "Press 2: Randomize red balls position";
        const game_mode_3_text = "Press 3: Randomize all balls position";
        const game_mode_4_text = "Press 4: Extension: Obstacle mode";

        // If the game mode is 1, show the game mode 1 text in green
        if(game_mode == 1) {
            fill(20, 50, 20);
            textSize(20);
            textStyle(BOLD);
            textAlign(CENTER);
            text(game_mode_1_text, table_width/11, table_height + 4 * rails_width);
            fill(255);
            text(game_mode_2_text, table_width/3  - padding, table_height + 4 * rails_width);
            text(game_mode_3_text, table_width/2 + table_width/9, table_height + 4 * rails_width);
            text(game_mode_4_text, table_width/2 + table_width/3 + 4 * rails_width, table_height + 4 * rails_width);
        };

        // If the game mode is 2, show the game mode 2 text in green
        if(game_mode == 2) {
            fill(255);
            textSize(20);
            textStyle(BOLD);
            textAlign(CENTER);
            text(game_mode_1_text, table_width/11, table_height + 4 * rails_width);
            fill(20, 50, 20);
            text(game_mode_2_text, table_width/3  - padding, table_height + 4 * rails_width);
            fill(255);
            text(game_mode_3_text, table_width/2 + table_width/9, table_height + 4 * rails_width);
            text(game_mode_4_text, table_width/2 + table_width/3 + 4 * rails_width, table_height + 4 * rails_width);
        };

        // If the game mode is 3, show the game mode 3 text in green
        if(game_mode == 3) {
            fill(255);
            textSize(20);
            textStyle(BOLD);
            textAlign(CENTER);
            text(game_mode_1_text, table_width/11, table_height + 4 * rails_width);
            text(game_mode_2_text, table_width/3  - padding, table_height + 4 * rails_width);
            fill(20, 50, 20);
            text(game_mode_3_text, table_width/2 + table_width/9, table_height + 4 * rails_width);
            fill(255);
            text(game_mode_4_text, table_width/2 + table_width/3 + 4 * rails_width, table_height + 4 * rails_width);
        };

        // If the game mode is 4, show the game mode 4 text in green
        if(game_mode == 4) {
            fill(255);
            textSize(20);
            textStyle(BOLD);
            textAlign(CENTER);
            text(game_mode_1_text, table_width/11, table_height + 4 * rails_width);
            text(game_mode_2_text, table_width/3  - padding, table_height + 4 * rails_width);
            text(game_mode_3_text, table_width/2 + table_width/9, table_height + 4 * rails_width);
            fill(20, 50, 20);
            text(game_mode_4_text, table_width/2 + table_width/3 + 4 * rails_width, table_height + 4 * rails_width);
        }

    pop();
}

function cueCollision() {
    // Check if cue ball collides with coloured ball
    for(var i = 0; i < coloured_balls.length; i++){
        if(checkCollision(cue_ball, coloured_balls[i][0])){
            console.log("Cue ball collided with coloured ball");
        }
    }
    // Check if cue ball collides with red bad
    for(var i = 0; i < red_balls.length; i++){
        if(checkCollision(cue_ball, red_balls[i])){
            console.log("Cue ball collided with red ball");
        }
    }
    // Check if cue ball collides with cushion
    for(var i=0; i < cushions.length; i++){
        if(checkCollision(cue_ball, cushions[i])){
            console.log("Cue ball collided with cushion");
        }
    }
    // Chek if cue ball collides with obstacle
    for(var i=0; i < obstacles.length; i++){
        if(checkCollision(cue_ball, obstacles[i])){
            console.log("Cue ball collided with obstacle");
        }
    }
};

function checkCollision(cue_ball, object) {
    return(Collision.collides(cue_ball, object));
}

//Helper functions
function drawVertices(vertices) {
    beginShape();
    for(var i = 0; i < vertices.length; i++)
    {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}