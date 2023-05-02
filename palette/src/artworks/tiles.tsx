
import { ArtworkProps } from "./utils/types";
import { extractColours, randomColourSelect } from "./utils/utils";

export default function tiles(props:ArtworkProps) {
    const {p, palette, dim, percentages} = props

    //code adapted from '220530a' by Okazz
    //CreativeCommons Attribution NonCommercial ShareAlike
    //original source: https://openprocessing.org/sketch/1588171

    let colors = extractColours(palette)
    let maxSize;
    let SEED = Math.floor(Math.random()*10000);
    
    p.setup = () => {
        p.createCanvas(dim[0], dim[1]);
        p.angleMode(p.DEGREES);
        p.rectMode(p.CENTER);
        generate();
    }
    
    function generate() {
        p.randomSeed(SEED)
        maxSize = p.max(p.width, p.height);
        p.background(0);
        let c = 15;
        let w = maxSize / c;
        p.noStroke();
        for (let i = 0; i < c; i++) {
            for (let j = 0; j < c; j++) {
                let x = i * w + w / 2;
                let y = j * w + w / 2;
                p.shuffle(colors, true);
                randomShape(x, y, w, p.int(p.random(4)) * 90);
            }
        }
    }
    
    function randomShape(x:number, y:number, w:number, a:number) {
        let rnd = p.int(p.random(9));
        let col1 = randomColourSelect(palette, percentages)
        let col2 = randomColourSelect(palette, percentages)
        let col3 = randomColourSelect(palette, percentages)

        p.push();
        p.translate(x, y);
        p.rotate(a);
        p.fill(col1);
        p.rect(0, 0, w, w);
        p.fill(col2);
        p.rect(0, 0, w, w);
        p.fill(col3);
        if (rnd == 0) {
            leaf(w / 4, w / 4, w / 2, -1);
            leaf(w / 4, -w / 4, w / 2, 1);
            leaf(-w / 4, -w / 4, w / 2, -1);
            leaf(-w / 4, w / 4, w / 2, 1);
        } 
        else if (rnd == 1) {
            leaf(w / 4, w / 4, w / 2, 1);
            leaf(w / 4, -w / 4, w / 2, 1);
            leaf(-w / 4, -w / 4, w / 2, -1);
            leaf(-w / 4, w / 4, w / 2, -1);
        } 
        else if (rnd == 2) {
            let c = 4;
            let ww = w / c;
            for (let i = 0; i < c; i++) {
                for (let j = 0; j < c; j++) {
                    if ((i + j) % 2 == 0) p.rect(ww * i + (ww - w) / 2, ww * j + (ww - w) / 2, ww);
                }
            }
        } 
        else if (rnd == 3) {
            p.arc(-w / 2, -w / 2, w, w, 0, 90);
            p.arc(w / 2, w / 2, w, w, 180, 270);
        } 
        else if (rnd == 4) {
            for (let i = 0; i < 3; i++) {
                let pp = p.map(i, 0, 3, 0, w / 2);
                let d = p.map(i, 0, 3, w, 0);
                p.fill(col1);
                if (i % 2 == 0) {
                    p.fill(col2);
                }
                p.circle(0, pp, d);
            }
        } 
        else if (rnd == 5) {
            let c = 4;
            let ww = w / c;
            for (let i = 0; i < c; i++) {
                for (let j = 0; j < c; j++) {
                    let xx = ww * i + (ww - w) / 2;
                    let yy = ww * j + (ww - w) / 2;
                    if ((i) % 2 == 0) p.fill(col1);
                    else p.fill(col2);
                    p.square(xx, yy, ww);
                    if ((i) % 2 == 0) p.fill(col2);
                    else p.fill(col1);
                    if (j % 2 == 0) {
                        p.arc(xx - ww / 2, yy - ww / 2, ww * 2, ww * 2, 0, 90, p.PIE);
                    } else {
                        p.arc(xx + ww / 2, yy + ww / 2, ww * 2, ww * 2, 180, 270, p.PIE);
                    }
                }
            }
        } 
        else if (rnd == 6) {
            p.triangle(-w / 2, -w / 2, w / 2, w / 2, w / 2, -w / 2);
            p.circle(0, 0, w * 0.75);
            p.fill(col1);
            p.arc(0, 0, w * 0.75, w * 0.75, 180 + 45, 360 + 45);
        } 
        else if (rnd == 7) {
            p.circle(w * 0.25, w * 0.25, w * 0.25);
            p.circle(-w * 0.25, -w * 0.25, w * 0.25);
            leaf(0, 0, w * 0.5, 1);
        } 
        else if (rnd == 8) {
            let c = 5;
            let ww = w / c;
            for (let i = 0; i < c; i++) {
                for (let j = 0; j < c; j++) {
                    if ((i + j) % 2 == 0) p.circle(ww * i + (ww - w) / 2, ww * j + (ww - w) / 2, ww * 0.75);
                }
            }
        }
        p.pop();
    }
    
    function leaf(x:number, y:number, w:number, t:number) {
        p.push();
        p.translate(x, y);
        p.scale(t, 1);
        p.beginShape();
        for (let a = 0; a < 90; a++) {
            p.vertex(-(w / 2) + w * p.cos(a), -(w / 2) + w * p.sin(a));
        }
        for (let a = 180; a < 270; a++) {
            p.vertex((w / 2) + w * p.cos(a), (w / 2) + w * p.sin(a));
        }
        p.endShape();
        p.pop();
    }
    
    function windowResized() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        generate();
    }
    
}