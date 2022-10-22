// 출처 : https://youtu.be/D6EiRSRhsbQ

import { GlowParticle } from './glowparticle.js';

const COLORS = [
  {r:213 , g:88 , b:200}, //#d558c8
  {r:36 , g:210 , b:146}, //#24d292
  {r:151 , g:149 , b:240}, // #9795F0
  {r:251 , g:200 , b:212}, //#FBC8D4
  {r:249 , g:212 , b:35}, //#F9D423
];

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.pixelRatio = (window.devicePixelRatio > 1 ) ? 2 : 1;
    
    this.totalParticles = 15;
    this.particles = [];
    this.maxRadius = 180;
    this.minRadius = 80;

    window.addEventListener('resize', this.resize.bind(this), false) ;
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.ctx.globalCompositeOperation = 'saturation'

    this.createParticles();
  }

  createParticles() {
    let curColor = 0;
    this.particles = [];

    for (let i = 0; i < this.totalParticles; i++) {
      const item = new GlowParticle(
        Math.random() * this.stageWidth,
        Math.random() * this.stageHeight,
        Math.random() * 
        (this.maxRadius - this.minRadius) + this.minRadius,
        COLORS[curColor]
      );

      if (++curColor >= COLORS.length) {
        curColor = 0;
      }

      this.particles[i] =  item;
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    for (let i = 0; i < this.totalParticles; i++) {
      const item = this.particles[i];
      item.animate(this.ctx, this.stageWidth, this.stageHeight);
    }
  }
}

window.onload = () => {
  new App(); 
}