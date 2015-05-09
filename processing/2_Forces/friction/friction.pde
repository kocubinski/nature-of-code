class Mover {

  PVector location;
  PVector velocity;
  PVector acceleration;

  float mass = 16.0;

  Mover(float mass, float x, float y) {
    location = new PVector(x, y);
    velocity = new PVector(random(0,0),random(0,0));
    acceleration = new PVector(0, 0);
    this.mass = mass;
  }

  void update() {
    velocity.add(acceleration);
    location.add(velocity);
    acceleration.mult(0);
  }

  void display() {
    stroke(0);
    fill(175);
    ellipse(location.x, location.y, mass * 16, mass * 16);
  }

  void applyForce(PVector force) {
    PVector f = PVector.div(force, mass);
    acceleration.add(f);
  }

  void checkEdges() {
    if (location.x  > width) {
      location.x = width;
      velocity.x *= -1;
    } else if (location.x < 0) {
      location.x = 0;
      velocity.x *= -1;
    }

    if (location.y > height) {
      location.y = height;
      velocity.y *= -1;
    } else if (location.y < 0) {
      velocity.y *= -1;
      location.y = 0;
    }
  }

}

Mover[] ms = new Mover[20];

void setup() {
  size(640, 480);

  for (int i = 0; i< ms.length; i++) {
    ms[i] = new Mover(random(0.2, 5.0), 0, 0);
  }
}

void draw() {
  background(255);

  PVector wind = new PVector(0.01, 0);
  PVector gravity = new PVector(0, 0.1);

  for (int i = 0; i < ms.length; i++) {
    float c = 0.05;
    float normal = 1;
    float frictionMag = c * normal;

    Mover m = ms[i];

    // air friction
    PVector friction = m.velocity.get();
    friction.mult(-1);
    friction.normalize();
    friction.mult(frictionMag);

    m.applyForce(wind);
    m.applyForce(PVector.mult(gravity, m.mass));
    m.applyForce(friction);
    m.checkEdges();

    m.update();
    m.display();
  }
}
