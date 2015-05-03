float noiseScale=0.02;

class Walker {

  float x,y;
  float tx,ty;

  Walker() {
    tx = 0;
    ty = 10000;
  }

  void step() {
    x = map(noise(tx), 0, 1, 0, width);
    y = map(noise(ty), 0, 1, 0, height);

    tx += 0.01;
    ty += 0.01;
  }

  void display() {
    stroke(0);
    point(x, y);
  }
}



void smallGraph() {
  background(0);
  for (int x=0; x < width; x++) {
    float noiseVal = noise((mouseX+x)*noiseScale,
                            mouseY*noiseScale);
    stroke(noiseVal*255);
    line(x, mouseY+noiseVal*80, x, height);
  }
}

float t = 0;

void perlin() {
  float n = noise(t);
  println(n);
  t++;
}

void perlin1d() {
  background(255);
  float xoff = t;
  noFill();
  stroke(0);
  strokeWeight(2);
  beginShape();
  for (int i = 0; i < width; i++) {
    float y = noise(xoff)*height;
    xoff += 0.01;
    vertex(i,y);
  }
  endShape();
  t+= 0.01;
}

void perlin_ellipse() {
  float n= noise(t);
  float x = map(n, 0, 1, 0, width);
  ellipse(x, 180, 16, 16);
  t += 0.01;
}

void setup() {
  size(400, 200);
  smooth();
}

Walker w = new Walker();

void draw() {
  //smallGraph();
  //perlin();
  //perlin1d();
  //perlin_ellipse();
  w.step();
  w.display();
}
