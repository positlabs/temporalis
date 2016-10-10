# Temporalis
Slit-scan webcam with canvas

https://positlabs.github.io/temporalis/

Does stuff like this with your webcam: 

![](https://33.media.tumblr.com/20619dd3c6f8c0f6b97e802218017300/tumblr_nw3kg4mTMo1ubdspro1_500.gif)


### Controls

`slices` determines the number of slices used in the time-stack. More slices means they are smaller, and take longer to push out of the stack.

`quality` determines the size of the canvas to draw to. Higher quality will be drawn to a larger canvas, but may make it slower to draw (mo' pixels, mo' time).

`save` will open a new window with a static image. `quality` affects the size of the output image.


### Post-processing

Because the effect becomes slow when using a high number of slices, you might want to record a screencast, then speed it up for a more enjoyable viewing experience. 

Split the original into frames. `-r` specifies the frame rate. e.g. if the original is 30fps, and we use `-r 2`, this would be the equivalent of speeding up by a factor of 15.

`ffmpeg -i temporalis.mov -r 2 tmp/asdf_%04d.png`

Encode the output video, using the frames we created with the previous command.

`ffmpeg -i tmp/asdf_%04d.png out.mp4`


### History

(quoting reddit user [emilhoff](https://www.reddit.com/r/trippy/comments/56jp4g/bending_space_and_time/d8kncfk))

It's a technique called "chronotopic anamorphosis." First used by Zbigniev Rybczynski, it made use of the raster scanning in analog video. The video was shot normally, but then the scan lines would be "staggered" in time.

It's particularly effective with rotating motion, because the shadows and other depth cues are preserved in each scan line, giving the strong illusion of the effect actually taking place in the real space.
Here's Rybczynski's "The Fourth Dimension" showcasing the effect:

http://www.dailymotion.com/video/xjbiop_zbigniew-rybczynski-the-fourth-dimention_shortfilms

It can be done today digitally, of course. In fact, it's an unintended effect of most digital cameras when shooting video of fast motion. Here's Gavin Free with a very good explanation of the effect of shutter speeds:
https://www.youtube.com/watch?v=CmjeCchGRQo

He explains the effect at 4:03, but the whole video is well worth watching.
