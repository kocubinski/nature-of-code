class Walker {
  float x;
  float y;

  Walker() {
    x = width / 2;
    y = height / 2;
  }

  void display() {
    stroke(0);
    point(x, y);
  }

  void step() {
    float sx;
    float sy;

    // float levy = random(1);

    // if (levy < 0.01) {
    //   sx = random(-100, 100);
    //   sy = random(-100, 100);
    // } else {
    //   sx = random(-1, 1);
    //   sy = random(-1, 1);
    // }

    sx = (10 * montecarlo()) * random(-1, 1);
    sy = (10 * montecarlo()) * random(-1, 1);

    x += sx;
    y += sy;
  }

  float montecarlo() {
    while (true) {
      float r1 = random(1);
      float prob = r1;
      float r2 = random(1);

      if (r2 < prob) { // prefer larger values
      //if (r2 > prob) { // prefer smaller values
        return r1;
      }
    }
  }

}

Walker w;

void setup() {
  size(640, 360);
  w = new Walker();
  background(255);
}

void draw() {
  w.step();
  w.display();
}
