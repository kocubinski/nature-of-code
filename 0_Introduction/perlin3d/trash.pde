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
