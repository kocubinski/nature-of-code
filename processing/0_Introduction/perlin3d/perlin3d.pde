void landscape() {
  size(640, 360, P3D);
  background(0);
  lights();
  translate(0, height - height/6, 0);
  stroke(255);

  rotateX(-PI/8);
  rotateY(PI/16);

  int pLength = 35;
  int pDepth = 35;
  int zSwing = 100;
  float shapeLength = 25.0;
  float noiseStep = 0.1;

  float x = 0;
  float z = 0;
  float y = 0;

  float[] lastYs = new float[pLength];

  for (int i = 0; i < pDepth; i++) {
    beginShape(QUAD_STRIP);

    for (int j = 0; j < pLength; j++) {
      float xoff;
      float zoff;
      x += shapeLength;

      if (i == 0) {
        xoff = map(x, 0, shapeLength * pLength, 0, noiseStep * pLength);
        zoff = map(z, 0, shapeLength * pDepth, 0, noiseStep * pDepth);
        y = map(noise(xoff, zoff), 0, 1, 50, -50);
      } else {
        y = lastYs[j];
      }

      //println("(", x, ",", y, ",", z, ")");
      vertex(x, y, z);

      float z1 = z - shapeLength;
      xoff = map(x, 0, shapeLength * pLength, 0, noiseStep * pLength);
      zoff = map(z1, 0, shapeLength * pDepth, 0, noiseStep * pDepth);
      y = map(noise(xoff, zoff), 0, 1, zSwing, -zSwing);
      lastYs[j] = y;
      //println("(", x, ",", y, ",", z1, ")");
      vertex(x, y, z1);
    }

    endShape();

    x = 0;
    z -= shapeLength;
  }

  endShape();
}

void setup() {
  landscape();
}
