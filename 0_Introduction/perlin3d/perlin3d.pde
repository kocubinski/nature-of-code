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

class Shape {
  Point3d[] points;
  int size;
  int i = 0;

  Shape(int size) {
    this.size = size;
    points = new Point3d[size];
  }

  void push(int x, int y, int z) {
    points[i++] = new Point3d(x, y, z);
  }

  void render() {
    beginShape();
    for (int j = 0; j < size; j++) {
      Point3d p = points[j];
      vertex(p.x, p.y, p.z);
    }
    endShape(CLOSE);
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

  Shape p1 = new Shape(4);
  p1.push(  0,   0,   0);
  p1.push(  0,   0, -50);
  p1.push( 50,   0, -50);
  p1.push( 50,   0,   0);

  Shape p2 = new Shape(4);
  p2.push( 50,   0,   0);
  p2.push( 50,   0, -50);
  p2.push(100, -20, -50);
  p2.push(100, -30,   0);

  p1.render();
  p2.render();

  int pLength = 10;
  int pDepth = 10;
  int shapeLength = 50;

  Shape[] row = new Shape[xLen];

  for (int i = 0; i < pLength; i++) {
    Shape s = new Shape(4);
    int x = i > 0 ? row[i - 1].points[3] : 0;
    int z = i > 0 ? row[i - 1].points[2] : 0;
    int y = map(noise(x, z), 0, 1, 50, -50);
  }
}

void setup() {
  //static_shapes();
  //pyramid();
  landscape();
}

void draw() {
}
