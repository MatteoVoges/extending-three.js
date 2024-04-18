# Extending the [Three.js](https://threejs.org/)-Framework - Implementing Superquadrics

<!-- hpi logo -->
[<div style="text-align: right"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/HPI_logo.svg" height="50em"/></div>](https://www.hpi.de)

This project is part of this project-seminar-lecture _3D Computer Graphics: Extending the Three.js Framework_ at the [Hasso-Plattner-Institute](https://hpi.de/en/index.html) (HPI). The goal of this project is introducing superquadrics as a new geometry type in three.js and take care of possible compability issues.

Visit the projects website at [https://hpicgs.github.io/seminar-extending-threejs-2023/](https://hpicgs.github.io/seminar-extending-threejs-2023/)

## What is a superquadric?

Superquadrics are versatile 3D geometric shapes that generalize ellipsoids.

Superquadrics find applications in computer graphics, computer vision, and robotics for modeling and analyzing a variety of 3D objects due to their adaptability in representing different shapes.

Examples for different parametrizations (the two parameters $\epsilon_1$ and $\epsilon_2$ determine the shape of the superquadric):

<img width="500px" heigth="500px" src="https://superquadrics.com/data/superquadrics_all.png">


Their ability to model various shapes with few parameters makes them a natural choice for geometric primitives. [Source: https://superquadrics.com/](https://superquadrics.com/)

## Demo 

Try out the demo locally:

```bash
git clone https://github.com/MatteoVoges/extending-three.js.git
cd extending-three.js
npm install http-server
http-server
```

or visit the [Demo Page](https://matteovoges.github.io/extending-three.js/) hosted by GitHub Pages (https://matteovoges.github.io/extending-three.js/).

## Video


https://github.com/MatteoVoges/extending-three.js/assets/98756476/abde75fc-98d7-4388-babf-c41af78f210e


## State of Integration

* https://github.com/mrdoob/three.js/pull/28036

## License

The Code is released under the MIT License. The License can be found in the LICENSE file.

Copyright (c) 2023-2024 Matteo Voges
