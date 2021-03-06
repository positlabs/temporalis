# Temporalis

Slit-scan webcam with canvas

https://temporalis.app

[![temporalis](./src/assets/icon/logo.jpg)](https://temporalis.app)

Does stuff like this with your webcam:

![](https://33.media.tumblr.com/20619dd3c6f8c0f6b97e802218017300/tumblr_nw3kg4mTMo1ubdspro1_500.gif)

Note: This is an experiment. It won't work everywhere. Chrome / desktop will be your best option, but it also works nicely on Android.

### Controls

`slices` slider determines the number of slices used in the time-stack. More slices means they are smaller, and take longer to push out of the stack.

`mode` button determines how the frames are sliced: vertically or horizontally.

`capture` button will take a snapshot when tapped, or record a video when held down (although recording is dependent on browser support)

![](https://media.giphy.com/media/l3vRbHAf89S3nAxTW/giphy.gif)

### Webapp

You can install this app on your phone or desktop. It should prompt you to install on your second visit, but you can manually install by selecing "add to homescreen" (mobile) or clicking the install icon in the address bar (desktop).

### History

http://www.flong.com/texts/lists/slit_scan/

---

(quoting reddit user [emilhoff](https://www.reddit.com/r/trippy/comments/56jp4g/bending_space_and_time/d8kncfk))

> It's a technique called "chronotopic anamorphosis." First used by Zbigniev Rybczynski, it made use of the raster scanning in analog video. The video was shot normally, but then the scan lines would be "staggered" in time.

> It's particularly effective with rotating motion, because the shadows and other depth cues are preserved in each scan line, giving the strong illusion of the effect actually taking place in the real space.
> Here's Rybczynski's "The Fourth Dimension" showcasing the effect:

> https://vimeo.com/186508316 > http://www.dailymotion.com/video/xjbiop_zbigniew-rybczynski-the-fourth-dimention_shortfilms

> It can be done today digitally, of course. In fact, it's an unintended effect of most digital cameras when shooting video of fast motion. Here's Gavin Free with a very good explanation of the effect of shutter speeds:
> https://www.youtube.com/watch?v=CmjeCchGRQo

> He explains the effect at 4:03, but the whole video is well worth watching.

### Post-processing

Because the effect becomes slow when using a high number of slices, you might want to speed it up in post for a more enjoyable viewing experience.

Split the original into frames. `-r` specifies the frame rate. e.g. if the original is 30fps, and we use `-r 2`, this would be the equivalent of speeding up by a factor of 15.

`ffmpeg -i temporalis.mov -r 2 tmp/%04d.png`

Encode the output video, using the frames we created with the previous command.

`ffmpeg -i tmp/%04d.png out.mp4`
