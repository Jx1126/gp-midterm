function setupRedBalls() {

    // Presetting for the first red ball
    var presetX = (table_width / 2 + table_width / 6 - 2 * rails_width + 50 - padding/2 + balls_radius);
    var presetY = (table_width / 4);

    for (var i = 0; i < 6; i++) {

        var x_pos = presetX + i * (balls_diameter - padding/2);

        for (var j = 0; j < i; j++) {

            var y_pos = (presetY - balls_diameter * j);
            y_pos += (i * balls_radius - balls_radius/2);

            // Creating the red balls
            var red_ball = Bodies.circle(x_pos, y_pos, balls_radius, ball_physic);
            // Pushing the red balls into the array
            red_balls.push(red_ball);
            // Adding the red balls to the world
            World.add(engine.world, [red_ball]);

            console.log("Red balls loaded successfully");

        }
    }
}

function drawRedBalls() {

    for (var i = 0; i < red_balls.length; i++) {
        // Push and pop to make sure the colours don't affect other objects
        push();
            fill("#FF0000")
            // Drawing the red balls
            drawVertices(red_balls[i].vertices);
        pop();
    }
}

function setupCueBall() {

    // Creating the cue ball
    cue_ball = Bodies.circle(table_width / 5,
                            table_height / 2 + padding + 3 * rails_width,
                            balls_radius,
                            ball_physic);

    // Adding the cue ball to the world
    World.add(engine.world, [cue_ball]);

}

function drawCueBall() {
    // Push and pop to make sure the colours don't affect other objects
    push();

        if(cue_ball_potted == false) {
            fill("#FFFFFF");
            // Drawing the cue ball
            drawVertices(cue_ball.vertices);
        }
    pop();
}

// Setting up the coloured balls
function setupColouredBalls() {

    var yellow_ball = [
                        // Creating the yellow ball
                        Bodies.circle(
                            table_width / 4,
                            table_height / 2 + padding - (table_height - 4 * rails_width) / 6,
                            balls_radius,
                            ball_physic
                        ),
                        // Saving the x position of the yellow ball into an array
                        table_width / 4,
                        // Saving the y position of the yellow ball into an array
                        table_height / 2 + padding - (table_height - 4 * rails_width) / 6,
                        // Saving the colour of the yellow ball into an array
                        "#FCD12A"
                    ];
    
    var brown_ball = [
                        // Creating the brown ball
                        Bodies.circle(
                            table_width / 4,
                            table_height / 2 + padding,
                            balls_radius,
                            ball_physic
                        ),
                        // Saving the x position of the brown ball into an array
                        table_width / 4,
                        // Saving the y position of the brown ball into an array
                        table_height / 2 + padding,
                        // Saving the colour of the brown ball into an array
                        "#54350D"
                    ];

    var green_ball = [
                        // Creating the green ball
                        Bodies.circle(
                            table_width / 4,
                            table_height / 2 + padding + (table_height - 4 * rails_width) / 6,
                            balls_radius,
                            ball_physic
                        ),
                        // Saving the x position of the green ball into an array
                        table_width / 4,
                        // Saving the y position of the green ball into an array
                        table_height / 2 + padding + (table_height - 4 * rails_width) / 6,
                        // Saving the colour of the green ball into an array
                        "#006400"
                    ];
    
    var blue_ball = [
                        // Creating the blue ball
                        Bodies.circle(
                            table_width / 2,
                            table_height / 2 + padding,
                            balls_radius,
                            ball_physic
                        ),
                        // Saving the x position of the blue ball into an array
                        table_width / 2,
                        // Saving the y position of the blue ball into an array
                        table_height / 2 + padding,
                        // Saving the colour of the blue ball into an array
                        "#0000FF"
                    ];
    
    var pink_ball = [
                        // Creating the pink ball
                        Bodies.circle(
                            table_width / 2 + table_width / 6 - 2 * rails_width + padding + balls_diameter + padding,
                            table_height / 2 + padding,
                            balls_radius,
                            ball_physic
                        ),
                        // Saving the x position of the pink ball into an array
                        table_width / 2 + table_width / 6 - 2 * rails_width + padding + balls_diameter + padding,
                        // Saving the y position of the pink ball into an array
                        table_height / 2 + padding,
                        // Saving the colour of the pink ball into an array
                        "#FE019A"
                   ];
    
    var black_ball = [
                        // Creating the black ball
                        Bodies.circle(
                            table_width - 5 * rails_width - padding,
                            table_height / 2 + padding,
                            balls_radius,
                            ball_physic
                        ),
                        // Saving the x position of the black ball into an array
                        table_width - 5 * rails_width - padding,
                        // Saving the y position of the black ball into an array
                        table_height / 2 + padding,
                        // Saving the colour of the black ball into an array
                        "#000000"
                    ];

    // Pushing all the coloured balls into an array
    coloured_balls.push(yellow_ball, brown_ball, green_ball, blue_ball, pink_ball, black_ball);
    // Adding all the coloured balls to the world
    World.add(engine.world, [yellow_ball[0], brown_ball[0], green_ball[0], blue_ball[0], pink_ball[0], black_ball[0]]);

    console.log("Coloured balls loaded successfully");

}

function drawColouredBalls() {
    for (var i = 0; i < coloured_balls.length; i++) {
        push();
            fill(coloured_balls[i][3]);
            drawVertices(coloured_balls[i][0].vertices);
        pop();
    }
}