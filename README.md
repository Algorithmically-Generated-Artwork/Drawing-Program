# AlgoArt Creator Studio (Simplified Version)

## Introduction
[AlgoArt.org](https://algoart.org/studio.html) is a digital platform that brings together Artists and Technologists to create algorithmically generated visual designs and artworks. This repository contains a simplified and light-weight version of our Creator Studio that you can use to develop your own drawing algorithms and generate your own unique artworks!

*Try out our public demo @* https://algoart.org/studio.html

## Videos and Tutorials

*Artwork Video*

[![Artwork Video](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/video_preview/image1.png)](https://www.youtube.com/watch?v=SGNbv__s0rI)

*Talk & Tutorial*

[![Talk & Tutorial Video](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/video_preview/image2.png)](https://www.youtube.com/watch?v=0Ts7Sa_z69Y&t=46s)

## How Does It Work?

**Drawing Algorithms:** We designed a simple framework for creating drawing algorithms.  These algorithms, coded in JavaScript, are built from procedural processes that draw lines and basic shapes onto an [HTML Canvas](https://www.w3schools.com/html/html5_canvas.asp). Our example procedural processes were inspired by mathematical concepts, natural phenomena, and artistic trends.

**Algorithm Structure:** Each algorithm has two JavaScript files.  One file is for the drawing procedure and the other is for parameter configuration.  The drawing procedure is declared as a dictionary object and includes functions called *start*, *pause*, *reset*, *initialize*, and *drawOneStep*.

**Web Interface:** The web interface is used to run your drawing algorithms.  Using the web interface, a user can start, pause, or reset a drawing algorithm.  In addition, a user can also clear the canvas and save the current state of the digital canvas as an image file.

![Web Interface Screenshot](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/web_interface.png)

## Open Source Algorithms


| Animation | Name | Author | Description |
|-----------|------|--------|-------------|
| ![algDots Animation](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/algDots.gif) | Dots (algDots) | Michael Wehar | This is a sample drawing algorithm that is meant for viewers to understand the programming framework that is used to create a new drawing algorithm.  We encourage you to clone our repo and try modifying this code to build your own drawing algorithm.  If you do so, **please consider sharing your resulting artworks with us** and [submit a pull request](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/pulls)! |
| ![algGP Animation](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/algGP.gif) | [Geometric Patterns](https://michaelwehar.wordpress.com/2022/06/16/algorithmically-generated-visual-designs-geometric-patterns/) (algGP) | Michael Wehar | This drawing program takes in over 30 different parameters representing line length, line thickness, rotation angles, color variations, background color blending, line sparsity, and whether intersecting lines are allowed. Based on these parameters and a random number generator, the drawing program generates different kinds of repeated geometric patterns. All of the generated patterns are drawn line by line on a digital canvas. |
| ![algVines Animation](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/algVines.gif) | [Vines](https://michaelwehar.wordpress.com/2022/07/23/algorithmically-generated-visual-designs-5-vines/) (algVines) | Alyssa Zhang | This algorithm, called "Vines", operates by drawing a variety of shapes across a canvas following certain kinds of paths. These paths that the vines follow are determined by various mathematical formulas. In particular, there are four kinds of paths: a random path, a linear path, a spiral path, and a path determined by a sine function. |
| ![algCS Animation](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/algCS.gif) | [Constellations](https://michaelwehar.wordpress.com/2025/03/11/algoart-15-consellations/) (algCS) | Jhovani Gallardo Moreno | This algorithm, called "Constellations", reminds me of vivid memories of lying on the grass in the front yard, surrounded by my family, and looking up at the night sky. This was fresh in my mind so I decided to try to emulate constellations and create similar patterns. |
| ![algVD Animation](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/algVD.gif) | [Voronoi](https://michaelwehar.wordpress.com/2025/03/12/algoart-16-voronoi/) (algVD) | Jhovani Gallardo Moreno | From a top-down view, a set of plant cells arranged together side-by-side appears like a tiling of a plane. After reading about different methods that can be used to create intriguing patterns / tilings, I discovered Voronoi diagrams which were originally conceptualized by the mathematician Georgy Voronoy. This is what inspired the drawing algorithm called "Voronoi". |
| ![algCL Animation](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/blob/main/readme_images/algCL.gif) | [Collisions](https://michaelwehar.wordpress.com/2025/03/08/algoart-14-collisions/) (algCL) | Omar Khan | I used to play a lot of video games which involved projectiles, and it was up to the player to track their trajectory and move accordingly. I always thought it would be easier if the paths of the ball could be drawn and varied. This motivation led me to develop the Collisions drawing algorithm. |

## Extended List of Algorithms and Blog Posts

- [Wrapping Paper](https://michaelwehar.wordpress.com/2022/06/14/algorithmically-generated-visual-designs-wrapping-paper/) by A. Zhang
- [Geometric Patterns](https://michaelwehar.wordpress.com/2022/06/16/algorithmically-generated-visual-designs-geometric-patterns/) by M. Wehar
- [Overlapping Tiles](https://michaelwehar.wordpress.com/2022/07/07/algorithmically-generated-visual-designs-3-overlapping-tiles/) by M. Wehar
- [Spiderwebs](https://michaelwehar.wordpress.com/2022/07/10/algorithmically-generated-visual-designs-4-spiderwebs/) by M. Newman-Toker
- [Vines](https://michaelwehar.wordpress.com/2022/07/23/algorithmically-generated-visual-designs-5-vines/) by A. Zhang
- [Fractals](https://michaelwehar.wordpress.com/2022/08/10/algorithmically-generated-visual-designs-6-fractals/) by M. Newman-Toker and M. Wehar
- [70's Funk](https://michaelwehar.wordpress.com/2022/08/10/algorithmically-generated-visual-designs-7-70s-funk/) by M. Wehar and A. Zhang
- [Game of Life](https://michaelwehar.wordpress.com/2022/08/10/algorithmically-generated-visual-designs-8-game-of-life/) by J. Mancini and M. Wehar
- [Trees](https://michaelwehar.wordpress.com/2022/08/19/algorithmically-generated-visual-designs-9-trees/) by M. Wehar
- [Spirals](https://michaelwehar.wordpress.com/2024/08/02/algoart-10-spirals/) by L. Suresh
- [Heat Map](https://michaelwehar.wordpress.com/2024/08/02/algoart-11-heat-map/) by V. Sumano
- [Stickers](https://michaelwehar.wordpress.com/2024/10/22/algoart-12-stickers/) by M. Wehar
- [Composition](https://michaelwehar.wordpress.com/2024/10/28/algoart-13-composition/) by X. Dong and M. Wehar
- [Collisions](https://michaelwehar.wordpress.com/2025/03/08/algoart-14-collisions/) by O. Khan
- [Constellations](https://michaelwehar.wordpress.com/2025/03/11/algoart-15-consellations/) by J. Gallardo Moreno
- [Voronoi](https://michaelwehar.wordpress.com/2025/03/12/algoart-16-voronoi/) by J. Gallardo Moreno

## Publications

*Academic Papers & Posters*

- Creating Variation When Building Image Generation Datasets by J. Gallardo Moreno, O. Khan, and M. Wehar (To Appear, Bridges 2025)
- [Students Teaching Students Computer Art and Graphics](https://diglib.eg.org/items/107b62b8-4c4f-4c17-af21-cac792069f21) by M. Wehar (Eurographics 2025)
- [Creating Patterns with Distance Functions & Voronoi Diagrams](https://dl.acm.org/doi/10.1145/3722564.3728384) by J. Gallardo Moreno and M. Wehar (I3D 2025)

*Art Exhibitions*

- [Generative Clothing Designs (GCD) by AlgoArt (2025)](https://aydelotte.swarthmore.edu/publications/generative-clothing-designs-gcd-by-algoart/)
- [AlgoArt @ Ludington Library (2023)](https://www.imaginary.org/event/algoart-exhibit-ludington-library)
- [AlgoArt Exhibition (2023)](https://aydelotte.swarthmore.edu/publications/algoart-exhibition-at-mccabe-library/)

*More Articles & Presentations*

- [Generative Clothing Designs (GCD) by AlgoArt](https://gallery.bridgesmathart.org/exhibitions/2024-bridges-conference-fashion-show/michael-wehar) (Bridges 2024 - Fashion Show)
- [AlgoArt - Nine Drawing Algorithms](https://gallery.bridgesmathart.org/exhibitions/2023-bridges-conference-short-film-festival/michael-wehar) (Bridges 2023 - Short Film Festival)
- [Using Augmented Reality to Show How An Artwork Was Created](https://dac.siggraph.org/sparks/2023-01-spatiality-in-virtual-reality-representation-interpretation-experience/) (SIGGRAPH DAC: SPARKS TALK 2023)
- Algorithmically Generated Visual Design (Lightning Talk @ CCSCNE 2023)
- [Algorithmically Generated Artwork](https://dl.acm.org/doi/10.5555/3580523.3580581) (Poster & Abstract CCSC:EA 2022)
- [A Visualization of Algorithmically Generated Artwork](https://www.youtube.com/watch?v=SGNbv__s0rI) (IFoRE 2022 - STEM Art and Film Festival)
- [AI Generated Digital Painting from Start to Finish](https://www.aiplusinfo.com/blog/ai-generated-digital-painting-from-start-to-finish/) (Artificial Intelligence + Guest Blog)
<!--- - [Algorithmically Generated Visual Art](https://alyssazhang.squarespace.com/work/algorithmically-generated-artwork) by Alyssa Zhang --->

<!--- *More Links* --->
<!--- - [Reviewer Sign-up Form for Computer Generated Artwork](https://docs.google.com/forms/d/e/1FAIpQLSdhmHGGojQslun9Fp3AZL7hCYHlfo9F8SGW5YX-YMTFrR13Dw/viewform) --->

## Contributors

*Project Director*
- Michael Wehar

*Active Contributors*

- Jhovani Gallardo Moreno
- Omar Khan
- Patrick Tone

*Past Contributors*

- Lalith Suresh
- Victor Sumano
- EK Brickner
- Ryan Oet
- Xingyu (Kevin) Dong
- Xinxin Li
- John Mancini
- Maya Newman-Toker
- Alyssa Zhang

*Special thanks to all friends and collaborators who offered help!*

## Collaborations

During Spring 2023, students from [CS410](https://cs410.net) @ UMass Boston forked our repository and contributed to our open source project adding functionality for 3D Drawing Algorithms.

*Project Links*

- Forked Repository: https://github.com/devnamedjean/Drawing-Program
- Public Demo: https://devnamedjean.github.io/Drawing-Program/

*Student Developers*

- Jake Breen
- Jean Gerard
- Prateeksha Bhojaraj
- Richard Chang

*Special thanks D. Haehn, S. Raikar, and to all of those who offered help!*

## Licenses and Libraries

The code in this repository is made available under MIT License.

This platform was developed using the following libraries which are available under MIT License.
- [JQuery](https://github.com/jquery/jquery)
- [Bootstrap](https://github.com/twbs/bootstrap)
- [Bootstrap Icons](https://github.com/twbs/icons)

## Contact Us

We are excited to start collaborations and build new partnerships!

Send an email to [Michael Wehar](http://michaelwehar.com) or [submit a pull request](https://github.com/Algorithmically-Generated-Artwork/Drawing-Program/pulls).
