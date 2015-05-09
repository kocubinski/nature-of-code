Mover mover;

void setup() {
  size(640,360);
  mover = new Mover();
}

float t = 0;

void draw() {
  background(255);

  mover.update();
  mover.checkEdges();
  mover.display();
  //steer(mover);
  //perlin(mover);
  accelerateToMouse(mover);
}

void accelerateToMouse(Mover m) {
  PVector a = new PVector(mouseX - m.location.x, mouseY - m.location.y);
  a.normalize();
  a.mult(0.5);
  m.acceleration = a;
}

void perlin(Mover m) {
  m.accelerate(map(noise(t), 0, 1, -1, 1), map(noise(t + 1000), 0, 1, -1, 1));
  t += 0.03;
}

void steer(Mover mover) {
  if (keyPressed) {
    if (key == 'w') {
      mover.accelerate(0, -0.1);
    } else if (key == 'a') {
      mover.accelerate(-0.1, 0);
    } else if (key == 's') {
      mover.accelerate(0, 0.1);
    } else if (key == 'd') {
      mover.accelerate(0.1, 0);
    }
  } else {
    mover.accelerate(0, 0);
  }
}

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
  }

  void display() {
    stroke(0);
    fill(175);
    ellipse(location.x,location.y,16,16);
  }

  void accelerate(float x, float y) {
    acceleration = new PVector(x, y);
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
