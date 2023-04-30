import p5 from "p5";
import { Palette } from "../types/colours";

export default function faces(p:p5, palette:Palette) {

    //adapted from design by takawo
    //https://openprocessing.org/sketch/1223485

    let url = [
        "https://coolors.co/264653-2a9d8f-e9c46a-f4a261-e76f51",
        "https://coolors.co/001219-005f73-0a9396-94d2bd-e9d8a6-ee9b00-ca6702-bb3e03-ae2012-9b2226",
        "https://coolors.co/9b5de5-f15bb5-fee440-00bbf9-00f5d4",
    ];
    let canvasPalette:any;
    let noiseGra:p5.Graphics;
    let sw:number;
    
    p.setup = () => {
        p.createCanvas(800, 800);
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.angleMode(p.DEGREES);
    

        noiseGra = p.createGraphics(p.width, p.height);
        noiseGra.noStroke();
        noiseGra.fill(255, 15 / 100 * 255);
        for (let i = 0; i < p.width * p.height * 0.05; i++) {
            let x = p.random(p.width);
            let y = p.random(p.height);
            let dia = p.noise(x * 0.01, y * 0.01) * 1 + 1; 
            noiseGra.ellipse(x, y, dia, dia);
        }
    }
    
    p.draw = () => {
        canvasPalette = createPalette(p.random(url), 100);
        p.background(0, 0, 0);
        // p.blendMode(p.ADD);
    
        let cells = p.int(p.random(1, 6));
        sw = p.map(cells, 1, 5, 5,1);
        let offset = p.width / 20;
        let margin = offset / 1.5;
        let d = (p.width - offset * 2 - margin * (cells - 1)) / cells;
    
        for (let j = 0; j < cells; j++) {
            for (let i = 0; i < cells; i++) {
                let xMin = offset + i * (d + margin);
                let yMin = offset + j * (d + margin);
                let xMax = xMin + d;
                let yMax = yMin + d;
                drawSepRect(xMin, yMin, xMax, yMax);
            }
        }
    
        // p.image(noiseGra, 0, 0);
    
        // p.frameRate(1 / 2);
        p.noLoop();
    }
    
    function drawSepRect(xMin:number, yMin:number, xMax:number, yMax:number) {
        let w = (xMax - xMin);
        let h = (yMax - yMin);
        p.push();
        p.translate(xMin + w / 2, yMin + h / 2);
        p.scale(p.random() > 0.5 ? -1 : 1,
            p.random() > 0.5 ? -1 : 1
        );
        p.scale(0.85);
        // let rotate_num = int(random(4)) * 360 / 4;
        // if (rotate_num / 90 % 2 == 1) {
        //   let tmp = w;
        //   w = h;
        //   h = tmp;
        // }
        // rotate(rotate_num);
        p.translate(-w / 2, -h / 2);
        let x = 0;
        let y = 0;
        let yStep, xStep;
    
        while (y < h) {
            yStep = p.int(p.random(h / 3));
            if (y + yStep > h) yStep = h - y;
            x = 0;
            while (x < w / 2) {
                xStep = p.int(p.random(w / 2));
                if (x + xStep > w / 2) xStep = w / 2 - x;
                // stroke(0, 0, 50);
                p.noStroke();
                let shape_num = p.int(p.random(6));
                let sep = p.int(p.random(1, 5));
                p.drawingContext.shadowBlur = p.max(w, h) / 30;
                p.drawingContext.shadowColor = p.color(p.random(canvasPalette));
                p.ellipseMode(p.CENTER);
                p.rectMode(p.CENTER);
                let m = p.random(0.5, 10);
                if (p.min(xStep, yStep) > w / 40) {
                    let angle = p.random(90, 270);
                    let counter_angle = angle > 180 ? angle + p.abs(270 - angle) * 2 : angle - p.abs(angle - 90) * 2;
                    let shear_x = p.random(15/2) * (p.random() > 0.5 ? -1:1);
                    let shear_y = p.random(15/2) * (p.random() > 0.5 ? -1:1);
                    let colors = p.shuffle(canvasPalette.concat());
                    p.push();
                    p.translate(x + xStep / 2, y + yStep / 2);
                    let t = 0;
                    let v = 0;
                    for (let i = 1.3; i > 0; i -= 1 / sep) {
                        p.push();
                        p.scale(i);
                        p.strokeWeight(1 / i * sw);
                        p.shearX(shear_x);
                        p.shearY(shear_y);
                        p.rotate(angle);
                        p.translate(-xStep / 2, -yStep / 2);
                        p.stroke(colors[(t + v) % colors.length]);
                        p.noFill();
                        drawRandomShape(0, 0, xStep, yStep, shape_num, m);
                        v++;
                        p.pop();
                    }
                    p.pop();
    
                    p.push();
                    p.translate(w - x - xStep + xStep / 2, y + yStep / 2);
                    p.scale(-1, 1);
                    v = 0;
                    for (let i = 1.3; i > 0; i -= 1 / sep) {
                        p.push();
                        p.scale(i);
                        p.strokeWeight(1 / i * sw);
                        p.shearX(shear_x);
                        p.shearY(shear_y);
                        p.rotate(angle);
                        p.translate(-xStep / 2, -yStep / 2);
                        p.stroke(colors[(t + v) % colors.length]);
                        // p.stroke(colors[[t + v] % colors.length]);
                        p.noFill();
                        drawRandomShape(0, 0, xStep, yStep, shape_num, m);
                        v++;
                        p.pop();
                    }
                    p.pop();
                }
                x += xStep;
            }
            y += yStep;
        }
        p.pop();
    }
    
    function drawRandomShape(x:number, y:number, w:number, h:number, shape_num:number = p.int(p.random(6)), m:number) {
        switch (shape_num) {
            case 0:
                p.ellipse(x + w / 2, y + h / 2, w, h);
                break;
            case 1:
                p.arc(x, y, w * 2, h * 2, 0, 90, p.PIE);
                break;
            case 2:
                p.quad(x, y, x + w / 2, y, x + w, y + h, x + w / 2, y + h);
                break;
            case 3:
                p.circle(x + w / 2, y + h / 2, p.min(w, h));
                break;
            case 4:
                p.rect(x, y, w, h, p.max(w, h));
                break;
            case 5:
                p.triangle(x, y, x + w, y + h, x + w, y);
                break;
            case 6:
                drawSuperEllipes(x + w / 2, y + h / 2, w, h, m);
                break;
        }
    }
    
    function createPalette(_url:string, percent = 100) {
        let slash_index = _url.lastIndexOf('/');
        let pallate_str = _url.slice(slash_index + 1);
        let arr:any = pallate_str.split('-');
        for (let i = 0; i < arr.length; i++) {
            arr[i] = p.color('#' + arr[i] + p.hex(p.int(percent / 100 * 255), 2));
        }
        return arr;
    }
    
    function drawSuperEllipes(x:number, y:number, w:number, h:number, n:number) {
        p.push();
        p.translate(x, y);
        let na = 2 / n;
        p.beginShape();
        for (let angle = 0; angle < 360; angle += 2) {
            let x = p.pow(p.abs(p.cos(angle)), na) * w / 2 * sgn(p.cos(angle));
            let y = p.pow(p.abs(p.sin(angle)), na) * h / 2 * sgn(p.sin(angle));
            p.vertex(x, y);
        }
        p.endShape(p.CLOSE);
        p.pop();
    }
    
    function sgn(val:number) {
        if (val === 0) {
            return 0;
        }
        return val / p.abs(val);
    }
}