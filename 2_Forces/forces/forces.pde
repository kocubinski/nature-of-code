class Mover {

  PVector location;
  PVector velocity;
  PVector acceleration;

  Mover() {
    location = new PVector(random(width),random(height));
    velocity = new PVector(random(-2,2),random(-2,2));
    acceleration = new PVector(0, 0);
  }

  void update() {
    location.add(velocity);
    velocity.add(acceleration);
    velocity.limit(5);
    acceleration.mult(0);
  }

  void display() {
    stroke(0);
    fill(175);
    ellipse(location.x,location.y,16,16);
  }

  void applyForce(PVector force) {
    acceleration.add(force);
  }

  void checkEdges() {
    if (location.x > width) {
      location.x = 0;
    } else if (location.x < 0) {
      location.x = width;
    }

    if (location.y > height) {
      location.y = 0;
    } else if (location.y < 0) {
      location.y = height;
    }
  }
}

Mover mover;

void setup() {
  size(640, 480);
  mover = new Mover();
}

void draw() {
  if (mousePressed) {
    PVector wind = new PVector(0.5, 0);
    mover.applyForce(wind);
  }
  mover.update();
  mover.display();
}
