I found a processing sketch in a defunkt forum. https://processing.org/discourse/beta/num_1213382538.html

```
import processing.video.*;
MovieMaker movie;

boolean rec;
int n;
int varZero;
int prevN;
int prevZero;
int numPixels;
int prevPixels;
int[] prevLines;
Capture video;

void setup(){
  size(320, 240);
  frameRate = 30;
  video = new Capture(this, width, height, 72);
  numPixels = video.width * video.height;
  //Sets the number of pixels to be stored using
  //an algebric progression formula related
  //to the number of lines to be stored.
  prevPixels = ((numPixels*(height+1))/2); 
  //Sets the array to store these pixels.
  prevLines = new int[prevPixels];
  movie = new MovieMaker(this, width, height, "rybczynski.mov",
  72, MovieMaker.ANIMATION, MovieMaker.LOSSLESS);
  //Sets the movie recording function off by default.
  rec=false;
  loadPixels();
  noStroke();
}


void draw(){
  if (video.available()){
    video.read();
    video.loadPixels();
    //For each line of the image:
    for (int y=1; y<height; y++){
	//Declares the value of 'n', which will be used to index
	//to which of the "lines" stored for line 'y' shall the software
	//access to store current frame's line 'y'.
	n=(frameCount%y);
	//Indexes to the begining of the "line" in which to store
	//the current frame's line 'y' using an algebric progression
	//formula based on 'y' var and the indexing gave by 'n' var.
	varZero= round((n*width)+(((sq(y)+y)*width)/2));
	//Declares the value of 'prevN'. This var will
	//index to stored "line" the software shall
	//read to display at current frame's line 'y'.
	prevN=((frameCount-(y-1))%y);
	//Indexes to the begining of the "line" that the software
	//shall read to display currently at line 'y'. Uses the
	//same process of varZero expression, but with other vars.
	prevZero=round((prevN*width) +(((sq(y)+y)*width)/2));
	//For each pixel in line 'y':
	for (int i=1; i<width; i++){
	  //Declares a 'ind' var based on 'y' and 'i'
	  //to index the displayed pixels.
	  int ind=((y*width)+i);
	  //Stores each pixel of line 'y' of current frame
	  //captured from real-time video.
	  prevLines[varZero+i]= video.pixels[ind];
	  //Reads and displays the proper line of pixels from
	  //the data stored.
	  pixels[ind]=prevLines[prevZero+i];
	}
    }
    updatePixels();
    if (rec==true){
	movie.addFrame();
    }
  }
}

void keyPressed (){
  //If SPACE key is pressed and recording is off, turn it on.
  if (key==' ' && rec==false){
    rec=true;
    println("REC");
  }
  //If SPACE key is pressed and recording is on, turn it off.
  else if (key==' ' && rec==true){
    rec=false;
    println("PAUSE");
  }
  //If ESCAPE key is pressed, finish movie.
  else if (key==ESC){
    movie.finish();
    println("STOP");
  }
}
```

I think it needs some work to become compatible with Processing 3. https://github.com/processing/processing/wiki/Changes-in-3.0

