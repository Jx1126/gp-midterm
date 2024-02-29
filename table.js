class snookerTable {

    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    setup() {
        this.setupCushions();
        this.setupPockets();
        console.log("Table loaded successfully.");
    }

    //Drawing different parts of the table
    draw() {
        this.yellowRails();
        this.playField();
        this.drawLine();
        this.brownRails();
        this.drawCushions();
        this.drawPockets();
        this.drawObstacles();
    }

    //Yellow rails behind the pockets
    yellowRails() {
        push();
        fill(245, 233, 77);
        rect(this.x, this.y, this.width, this.height, 20);
        pop();
    }

    //Brown rails to cover up the excess yellow rails
    brownRails() {
        push();

            fill(130, 80, 0);

            //Left rail
            rect(this.x,
                 this.y + 3 * rails_width,
                 rails_width,
                 rails_height - 4 * rails_width);

            //Right rail
            rect(this.width + this.x - rails_width,
                 this.y + 3 * rails_width,
                 rails_width,
                 rails_height - 4 * rails_width);

            //Top left rail
            rect(this.x + 3 * rails_width,
                 this.y,
                 rails_height - 2 * rails_width,
                 rails_width);

            //Top right rail
            rect(this.width / 2 + padding + rails_width,
                 this.y,
                 rails_height - 2 * rails_width,
                 rails_width);
                 
            //Bottom left rail
            rect(this.x + 3 * rails_width,
                 this.height + this.y - rails_width,
                 rails_height - 2 * rails_width,
                 rails_width);

            //Bottom right rail
            rect(this.width / 2 + padding + rails_width,
                 this.height + this.y - rails_width,
                 rails_height - 2 * rails_width,
                 rails_width);
        pop();
    }

    //Green stale/ play field
    playField() {
        push();
            fill(44, 130, 87);
            rect(this.x + rails_width, this.y + rails_width, this.width - 2 * rails_width, this.height - 2 * rails_width, 10)
        pop();
    }
    
    //Drawing the indication line
    drawLine() {
        push();
        
            stroke(255);
            strokeWeight(3);
            noFill();

            //The vertical line
            line(table_width / 4, this.y + 2 * rails_width, table_width / 4, table_height + padding - 2 * rails_width);

            //The half circle line
            arc(table_width / 4,
                table_height / 2 + padding,
                (table_height - 4 * rails_width)/3,
                (table_height - 4 * rails_width)/3,
                HALF_PI,
                PI + HALF_PI);
        pop();
    }
    
    setupCushions() {
        //Bottom left cushion
        var bottom_left_cushion = Bodies.trapezoid(this.x + 3 * rails_width + (rails_height - 2 * rails_width)/2,
                                                   this.height + padding - rails_width - rails_width / 2,
                                                   rails_height - 2 * rails_width,
                                                   rails_width,
                                                   0.09,
                                                   {isStatic: true, friction: 0.01, restitution: 0.1});

        //Bottom right cushion
        var bottom_right_cushion = Bodies.trapezoid(this.x + 3 * rails_width + (rails_height - 2 * rails_width)/2 + rails_height,
                                                    this.height + padding - rails_width - rails_width / 2,
                                                    rails_height - 2 * rails_width,
                                                    rails_width,
                                                    0.09,
                                                    {isStatic: true, friction: 0.01, restitution: 0.1});

        //Top left cushion
        var top_left_cushion = Bodies.trapezoid(this.x + 3 * rails_width + (rails_height - 2 * rails_width)/2,
                                                rails_width + padding + rails_width / 2,
                                                rails_height - 2 * rails_width,
                                                rails_width,
                                                0.09,
                                                {isStatic: true, friction: 0.01, restitution: 0.1, angle: radians(180)});

        //Top right cushion
        var top_right_cushion = Bodies.trapezoid(this.x + 3 * rails_width + (rails_height - 2 * rails_width)/2 + rails_height,
                                                rails_width + padding + rails_width / 2,
                                                rails_height - 2 * rails_width,
                                                rails_width,
                                                0.09,
                                                {isStatic: true, friction: 0.01, restitution: 0.1, angle: radians(180)});

        //Left cushion
        var left_cushion = Bodies.trapezoid(this.x + rails_width + rails_width / 2,
                                            this.y + 2 * rails_width + (rails_height - 2 * rails_width) / 2,
                                            rails_height - 4 * rails_width,
                                            rails_width,
                                            0.09,
                                            {isStatic: true, friction: 0.01, restitution: 0.1, angle: radians(90)});

        //Right cushion
        var right_cushion = Bodies.trapezoid(this.x + this.width - rails_width - rails_width / 2,
                                             this.y + 2 * rails_width + (rails_height - 2 * rails_width) / 2,
                                             rails_height - 4 * rails_width,
                                             rails_width,
                                             0.09,
                                             {isStatic: true, friction: 0.01, restitution: 0.1, angle: radians(270)});
                                                    
        cushions.push(bottom_left_cushion, bottom_right_cushion, top_left_cushion, top_right_cushion, left_cushion, right_cushion);
        World.add(engine.world, cushions);
    }

    //Drawing the cushions
    drawCushions() {
        push();
            fill(4, 90, 47);
            for(var i = 0; i < cushions.length; i++) {
                drawVertices(cushions[i].vertices);
            }
        pop();
    }

    setupPockets() {
        //Center top pocket
        this.drawPockets(table_width/2 + padding,
        this.y + 2 * rails_width,
        pockets_diameter);

        // Center top pocket
        var center_top_pocket = [table_width/2 + padding,
                this.y + 2 * rails_width,
                pockets_diameter];

        //Center bottom pocket
        var center_bottom_pocket = [table_width/2 + padding,
                this.height - 1.5 * rails_width,
                pockets_diameter];

        //Top left pocket
        var top_left_pocket = [this.x + 2 * padding + rails_width,
                this.y + 2 * rails_width,
                pockets_diameter];

        //Bottom left pocket
        var bottom_left_pocket = [this.x + 2 * padding + rails_width,
                this.height - 1.5 * rails_width,
                pockets_diameter];

        //Top right pocket
        var top_right_pocket = [this.width - padding - rails_width,
                this.y + 2 * rails_width,
                pockets_diameter];
                
        //Bottom right pocket
        var bottom_right_pocket = [this.width - padding - rails_width,
                this.height - 1.5 * rails_width,
                pockets_diameter];

        pockets.push(center_top_pocket, center_bottom_pocket, top_left_pocket, bottom_left_pocket, top_right_pocket, bottom_right_pocket)
    }

    drawPockets(x, y, s) {
        for(var i = 0; i < pockets.length; i++) {
            fill(45);
            ellipse(pockets[i][0], pockets[i][1], pockets[i][2])
        }
    }

    setupObstacles() {
        var obstacle_1 = Bodies.circle(random(padding + 2 * rails_width + balls_radius, table_width - padding - 2 * rails_width - balls_radius),
                                       random(padding + 2 * rails_width + balls_radius, table_height - padding - 2 * rails_width - balls_radius),
                                       balls_radius,
                                       {isStatic: true});
        var obstacle_2 = Bodies.circle(random(padding + 2 * rails_width + balls_radius, table_width - padding - 2 * rails_width - balls_radius),
                                       random(padding + 2 * rails_width + balls_radius, table_height - padding - 2 * rails_width - balls_radius),
                                       balls_radius,
                                       {isStatic: true});
        var obstacle_3 = Bodies.circle(random(padding + 2 * rails_width + balls_radius, table_width - padding - 2 * rails_width - balls_radius),
                                       random(padding + 2 * rails_width + balls_radius, table_height - padding - 2 * rails_width - balls_radius),
                                       balls_radius,
                                       {isStatic: true});
        var obstacle_4 = Bodies.rectangle(random(padding + 2 * rails_width + balls_radius, table_width - padding - 2 * rails_width - balls_radius),
                                       random(padding + 2 * rails_width + balls_radius, table_height - padding - 2 * rails_width - balls_radius),
                                       20,
                                       20,
                                       {isStatic: true});
        var obstacle_5 = Bodies.rectangle(random(padding + 2 * rails_width + balls_radius, table_width - padding - 2 * rails_width - balls_radius),
                                       random(padding + 2 * rails_width + balls_radius, table_height - padding - 2 * rails_width - balls_radius),
                                       20,
                                       20,
                                       {isStatic: true});
        var obstacle_6 = Bodies.rectangle(random(padding + 2 * rails_width + balls_radius, table_width - padding - 2 * rails_width - balls_radius),
                                       random(padding + 2 * rails_width + balls_radius, table_height - padding - 2 * rails_width - balls_radius),
                                       20,
                                       20,
                                       {isStatic: true});

        obstacles.push(obstacle_1, obstacle_2, obstacle_3, obstacle_4, obstacle_5, obstacle_6);
        World.add(engine.world, obstacles);

    }

    drawObstacles() {
        push();
            fill(200);
            for(var i = 0; i < obstacles.length; i++) {
                drawVertices(obstacles[i].vertices);
            }
        pop();
    }

}   