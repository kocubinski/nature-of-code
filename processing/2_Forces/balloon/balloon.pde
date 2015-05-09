class Mover {

  PVector location;
  PVector velocity;
  PVector acceleration;

  int size = 16;

  Mover() {
    location = new PVector(random(width),random(height));
    velocity = new PVector(random(-2,2),random(-2,2));
    acceleration = new PVector(0, 0);
  }

  void update() {
    velocity.add(acceleration);
    velocity.limit(5);
    location.add(velocity);
    acceleration.mult(0);
  }

  void display() {
    stroke(0);
    fill(175);
    ellipse(location.x, location.y, size, size);
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

class Balloon extends Mover {
  void checkWalls() {
    if (location.x  > width) {
      location.x = width;
      applyForce(PVector.mult(velocity, -1.8));
    } else if (location.x < 0) {
      location.x = 0;
      applyForce(PVector.mult(velocity, -1.8));
    }

    if (location.y > height) {
      location.y = height;
      applyForce(PVector.mult(velocity, -1.8));
    } else if (location.y < 0) {
      applyForce(PVector.mult(velocity, -1.8));
      location.y = 0;
    }
  }

  void helium() {
    applyForce(new PVector(0, -0.2));
  }
}

Balloon b;

void setup() {
  size(640, 480);
  b = new Balloon();
}

void draw() {
  background(255);

  if (mousePressed) {
    PVector wind = new PVector(0.5, 0);
    b.applyForce(wind);
  }

  b.helium();
  b.checkWalls();

  b.update();
  b.display();
}
