# AlgoArt Creator Studio (Simplified Version)

## Introduction
[AlgoArt.org](https://algoart.org/github/) is a digital platform that brings together Artists and Technologists to create algorithmically generated visual designs and artworks. This repository contains a simplified and light-weight version of our Creator Studio that you can use to develop your own drawing algorithms and generate your own unique artworks!

*Try out our public demo @* https://algoart.org/github/

## Videos & Talks

*Artwork Video*

[![Artwork Video](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/video_preview/image1.png)](https://www.youtube.com/watch?v=SGNbv__s0rI)

*Talk & Tutorial*

[![Talk & Tutorial Video](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/video_preview/image2.png)](https://www.youtube.com/watch?v=0Ts7Sa_z69Y&t=46s)

## How Does It Work?

**Drawing Algorithms:** We designed a simple framework for creating drawing algorithms.  These algorithms, coded in JavaScript, are built from procedural processes that draw lines and basic shapes onto an [HTML Canvas](https://www.w3schools.com/html/html5_canvas.asp). Our example procedural processes were inspired by mathematical concepts, natural phenomena, and artistic trends.

**Algorithm Structure:** Each algorithm has two JavaScript files.  One file is for the drawing procedure and the other is for parameter configuration.  The drawing procedure is declared as a dictionary object and includes functions called *start*, *pause*, *reset*, *initialize*, and *drawOneStep*.

**Web Interface:** The web interface is used to run your drawing algorithms.  Using the web interface, a user can start, pause, or reset a drawing algorithm.  In addition, a user can also clear the canvas and save the current state of the digital canvas as an image file.

![Web Interface Screenshot](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/web_interface.png)

## Our Algorithms

### algDots (Simple Example)

This is a sample drawing algorithm that is meant for viewers to understand the programming framework that is used to create a new drawing algorithm.  We encourage you to clone our repo and try modifying this code to build your own drawing algorithm.  If you do so, **please consider sharing your resulting artworks with us** and [submit a pull request](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/pulls)!

Example Drawing:

![algDots Animation](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/algDots.gif)

### algGP (Mike's Geometric Patterns)

This drawing program takes in over 30 different parameters representing line length, line thickness, rotation angles, color variations, background color blending, line sparsity, and whether intersecting lines are allowed. Based on these parameters and a random number generator, the drawing program generates different kinds of repeated geometric patterns. All of the generated patterns are drawn line by line on a digital canvas.

Example Drawing:

![algGP Animation](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/algGP.gif)

Blog Article: https://michaelwehar.wordpress.com/2022/06/16/algorithmically-generated-visual-designs-geometric-patterns/

### algVines (Alyssa's Vines)

This algorithm, called "Vines", operates by drawing a variety of shapes across a canvas following certain kinds of paths. These paths that the vines follow are determined by various mathematical formulas. In particular, there are four kinds of paths: a random path, a linear path, a spiral path, and a path determined by a sine function.

Example Drawing:

![algVines Animation](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/algVines.gif)

Blog Article: https://michaelwehar.wordpress.com/2022/07/23/algorithmically-generated-visual-designs-5-vines/

## Articles & Links

*Blog Articles*

- [Wrapping Paper](https://michaelwehar.wordpress.com/2022/06/14/algorithmically-generated-visual-designs-wrapping-paper/) by Alyssa Zhang
- [Geometric Patterns](https://michaelwehar.wordpress.com/2022/06/16/algorithmically-generated-visual-designs-geometric-patterns/) by Michael Wehar
- [Overlapping Tiles](https://michaelwehar.wordpress.com/2022/07/07/algorithmically-generated-visual-designs-3-overlapping-tiles/) by Michael Wehar
- [Spiderwebs](https://michaelwehar.wordpress.com/2022/07/10/algorithmically-generated-visual-designs-4-spiderwebs/) by Maya Newman-Toker
- [Vines](https://michaelwehar.wordpress.com/2022/07/23/algorithmically-generated-visual-designs-5-vines/) by Alyssa Zhang
- [Fractals](https://michaelwehar.wordpress.com/2022/08/10/algorithmically-generated-visual-designs-6-fractals/) by Maya Newman-Toker and Michael Wehar
- [70's Funk](https://michaelwehar.wordpress.com/2022/08/10/algorithmically-generated-visual-designs-7-70s-funk/) by Michael Wehar and Alyssa Zhang
- [Game of Life](https://michaelwehar.wordpress.com/2022/08/10/algorithmically-generated-visual-designs-8-game-of-life/) by John Mancini and Michael Wehar
- [Trees](https://michaelwehar.wordpress.com/2022/08/19/algorithmically-generated-visual-designs-9-trees/) by Michael Wehar

*More Articles*

<!--- - [Algorithmically Generated Visual Art](https://alyssazhang.squarespace.com/work/algorithmically-generated-artwork) by Alyssa Zhang --->
- [AI Generated Digital Painting from Start to Finish](https://www.aiplusinfo.com/blog/ai-generated-digital-painting-from-start-to-finish/) by Michael Wehar

*More Links*

- [Reviewer Sign-up Form for Computer Generated Artwork](https://docs.google.com/forms/d/e/1FAIpQLSdhmHGGojQslun9Fp3AZL7hCYHlfo9F8SGW5YX-YMTFrR13Dw/viewform)

## Contributors

*Actively Contributing*

- Xingyu (Kevin) Dong
- Michael Wehar
- Xinxin Li

*Past Contributors*

- John Mancini
- Maya Newman-Toker
- Alyssa Zhang

*Special thanks to all friends and collaborators who offered help!*

## License & Libraries

The code in this repository is made available under MIT License.

This platform was developed using the following libraries which are available under MIT License.
- [JQuery](https://github.com/jquery/jquery)
- [Bootstrap](https://github.com/twbs/bootstrap)
- [Bootstrap Icons](https://github.com/twbs/icons)

## Contact Us
We are excited to start collaborations and build new partnerships!

Send an email to [Michael Wehar](http://michaelwehar.com) or [submit a pull request](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/pulls).
