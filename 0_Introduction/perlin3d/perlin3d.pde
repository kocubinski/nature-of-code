float x, y, z;

void static_shapes() {
  size(640, 360, P3D);
  background(0);
  lights();

  pushMatrix();
  translate(130, height / 2, 0);
  rotateY(1.25);
  rotateX(-0.4);
  noStroke();
  box(100);
  popMatrix();

  pushMatrix();
  translate(500, height * 0.35, -200);
  noFill();
  stroke(255);
  sphere(280);
  popMatrix();
}

void pyramid() {
  size(640, 360, P3D);
  background(0);

  translate(width/2, height/2, 0);
  stroke(255);
  rotateX(PI/2);
  rotateZ(-PI/6);
  noFill();

  beginShape();

  vertex(-100, -100, -100);
  vertex( 100, -100, -100);
  vertex(   0,    0,  100);

  vertex( 100, -100, -100);
  vertex( 100,  100, -100);
  vertex(   0,    0,  100);

  vertex( 100, 100, -100);
  vertex(-100, 100, -100);
  vertex(   0,   0,  100);

  vertex(-100,  100, -100);
  vertex(-100, -100, -100);
  vertex(   0,    0,  100);
  endShape();
}

class Point3d {
  int x, y, z;

  Point3d(int x, int y, int z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Plane {
  Point3d[] points = new Point3d[3];
  int i = 0;

  void push(int x, int y, int z) {
    points[i] = new Point3d(x, y, z);
    i++;
  }

  void render() {
    //for
  }
}

void landscape() {
  size(640, 360, P3D);
  background(0);
  translate(width/2, height/2, 0);
  stroke(255);
  //rotateX(PI/2);
  //rotateZ(-PI/6);
  noFill();
  rotateX(-PI/6);

  beginShape();

  vertex(   0,    0,    0);
  vertex(   0,    0,  -50);
  vertex(  50,    0,  -50);
  vertex(  50,    0,    0);

  endShape(CLOSE);

  beginShape();

  vertex(  50,    0,    0);
  vertex(  50,    0,  -50);
  vertex( 100,  -20,  -50);
  vertex( 100,  -30,    0);

  endShape(CLOSE);
}

void setup() {
  //static_shapes();
  //pyramid();
  landscape();
}

void draw() {
}
