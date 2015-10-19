# Temporalis
Slit-scan webcam with canvas

https://positlabs.github.io/temporalis/

Does stuff like this with your webcam: 

![](https://33.media.tumblr.com/20619dd3c6f8c0f6b97e802218017300/tumblr_nw3kg4mTMo1ubdspro1_500.gif)

### Controls

`slices` determines the number of slices used in the time-stack. More slices means they are smaller, and take longer to push out of the stack.

`quality` determines the size of the canvas to draw to. Higher quality will be drawn to a larger canvas, but may make it slower to draw (mo' pixels, mo' time).

`save` will open a new window with a static image. `quality` affects the size of the output image.
