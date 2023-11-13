# Extending the [Three.js](https://threejs.org/)-Framework - Implementing Superquadrics

<!-- hpi logo -->
[<div style="text-align: right"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/HPI_logo.svg" height="50em"/></div>](https://www.hpi.de)

This project is part of this project-seminar-lecture _3D Computer Graphics: Extending the Three.js Framework_ at the Hasso-Plattner-Institute (HPI). The goal of this project is introducing superquadrics as a new geometry type in three.js and take care of possible compability issues. 

## Overview

* [What is a superquadric?](#what-is-a-superquadric)
    * [Theoretical background](#theoretical-background)
    * [Examples for different parametrizations](#examples-for-different-parametrizations)
* Demo Video (TBD)
* [License](#license)

## What is a superquadric?

### Theoretical background

Superquadrics are versatile 3D geometric shapes that generalize ellipsoids. They are described by the equation:

$$\left(\left(\frac{x}{a}\right)^{\frac{2}{\epsilon_2}} + \left(\frac{y}{b}\right)^{\frac{2}{\epsilon_2}}\right)^{\frac{\epsilon_2}{\epsilon_1}} + \left(\frac{z}{c}\right)^{\frac{2}{\epsilon_1}} = 1$$

Where $a,$ $b,$ and $c$ are scaling factors, and $\epsilon_1$ and $\epsilon_2$ determines the shape.

Superquadrics find applications in computer graphics, computer vision, and robotics for modeling and analyzing a variety of 3D objects due to their adaptability in representing different shapes.

### Examples for different parametrizations
<div style="padding: 10px; text-align: center; background-color: white; color: gray">
<img src="https://superquadrics.com/data/superquadrics_all.png" width="500px" heigth="500px">

Their ability to model various shapes with few parameters makes them a natural choice for geometric primitives. [Source: <a href=https://superquadrics.com/ >superquadrics.com</a>]
</div>

## Demo Video

Superquadrics are not implemented yet. See the latest results and the current progress at the [Demo Page](https://matteovoges.github.io/extending-three.js/).

## License

The Code is released under the MIT License. The License can be found in the LICENSE file.

Copyright (c) 2023 Matteo Voges
