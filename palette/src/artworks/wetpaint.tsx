import p5 from "p5";
import { Palette } from "../types/colours";
import { ArtworkProps } from "./utils/types";
import { extractColours } from "./utils/utils";

export default function wetpaint(props:ArtworkProps) {
    const {p, palette, dim} = props

    //adapted from work by Okazz
    //https://openprocessing.org/sketch/945207
    // let colors = ["#7209b7", "#3a0ca3", "#4361ee", "#4cc9f0", "#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c", "#ffffff"];
    // let colors = palette.colourVerticies.map((colour)=>{
    //     return `#${colour.rgb}`
    // })
    let colors = extractColours(palette)
    p.setup = () => {
        p.createCanvas(dim[0], dim[1]);

        p.rectMode(p.CENTER);

        for (let i = 0; i < 100; i++) {
            let x = p.random(p.width);
            let y = p.random(p.height);
            let w = p.random(p.width);
            let h = p.random(p.height);
            let ang = p.int(p.random(8)) * p.PI * 0.25;
            p.push();
            p.noStroke();
            p.fill(p.random(colors));
            p.translate(x, y);
            p.rotate(ang);
            p.rect(x, y, w, h);
            p.pop();
        }

        for (let i = 0; i < 100; i++) {
            let x = p.random(-0.2, 1.2) * p.width;
            let y = p.random(-0.2, 1.2) * p.height;
            let s = p.random(5, 130);
            dripCircle(x, y, s);
        }

        for (let i = 0; i < 1000; i++) {
            let x = p.random(p.width);
            let y = p.random(p.height);
            let s = p.random(p.random(p.random(20)));
            p.fill(p.random(colors));
            p.noStroke();
            p.circle(x, y, s);
        }
    }

    function dripCircle(x:number, y:number, s:number) {
        let col = p.random(colors);
        let cc = p.int(p.random(5, 30));
        p.push();
        p.translate(x, y);
        p.fill(col);
        p.noStroke();
        p.circle(0, 0, s);
        for (let i = 0; i < cc; i++) {
            let a = p.random(p.TAU);
            let xx = s * 0.45 * p.cos(a) * p.random();
            let yy = s * 0.45 * p.sin(a) * p.random();
            let len = p.random(s * 5);
            if (p.random() < 0.2) {
                p.noStroke();
                myLine(xx, yy, xx, yy + len);
            } else {
                p.stroke(col);
                p.strokeWeight(p.random(s * 0.05));
                p.line(xx, yy, xx, yy + len);
            }
        }
        p.noStroke();
        while (s > 0) {
            let ps = s;
            s -= p.random(30);
            p.fill(p.random(colors));
            p.ellipse(0, 0, s * p.random(0.9, 1), s * p.random(0.9, 1));
        }
        p.pop();
    }

    function myLine(x1:number, y1:number, x2:number, y2:number) {
        let pAng = p.atan((y1 - y2) / (x1 - x2));
        let a1 = -(p.PI * 0.5) + pAng;
        let a2 = (p.PI * 0.5) + pAng;
        let d = p.dist(x1, y1, x2, y2);
        let w = d * 0.1;
        p.beginShape();
        p.vertex(x1, y1);
        p.bezierVertex(x2, y2 - w * 0.5, x2 - w * 0.5, y2 - w * 0.1, x2, y2);
        p.bezierVertex(x2 + w * 0.5, y2 - w * 0.1, x2, y2 - w * 0.5, x1, y1);
        p.endShape();
    }
}