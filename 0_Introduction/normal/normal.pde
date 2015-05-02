import java.util.*;

Random rand;

void setup() {
  size(640, 360);
  rand = new Random();
}

void draw() {
  float sd = 60;

  float meanx = 320;
  float meany = 180;
  float meanc = 125;

  float nx = (float) rand.nextGaussian();
  float ny = (float) rand.nextGaussian();

  float nr = (float) rand.nextGaussian();
  float ng = (float) rand.nextGaussian();
  float nb = (float) rand.nextGaussian();

  float x = sd * nx + meanx;
  float y = sd * ny + meany;

  float sdc = 20;
  int r = constrain(int(sdc * nr + meanc), 0, 255);
  int g = constrain(int(sdc * ng + meanc), 0, 255);
  int b = constrain(int(sdc * nb + meanc), 0, 255);

  noStroke();
  fill(r, g, b, 50);
  ellipse(x, y, 16, 16);
}
