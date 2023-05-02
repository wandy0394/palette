import { ArtworkProps } from "./utils/types";
import { extractColours, randomColourSelect } from "./utils/utils";

export default function flowers(props:ArtworkProps) {
    const {p, palette, dim, percentages} = props
    //adapted from work by Keeth Kuwahara
    //https://openprocessing.org/sketch/1891173
    // let colors = [
    //     "#e6302b",
    //     "#fd7800",
    //     "#fbd400",
    //     "#51b72d",
    //     "#2abde4",
    //     "#4e59a4",
    //     "#085a9b",
    //     "#f477c3",
    // ];
    // let colors = palette.colourVerticies.map((colour)=>{
    //     return `#${colour.rgb}`
    // })
    let colors = extractColours(palette)
    const c = 50;
    const minDistance = 100;
    let w;
    let items:Flower[] = [];
    let boff = 0;
    
    p.setup = () => {
        p.createCanvas(dim[0], dim[1]);
        w = p.width / 60;
        p.noStroke();
        // blendMode(HARD_LIGHT);
        
        for (let i = 0; i < c; i++) {
            let tries = 0;
            let x, y, h;
            do {
            x = p.random(w / 2, p.width - w / 2);
            h = p.random(p.height / 4, p.height / 2);
            y = p.random(h / 2, p.height - h / 2);
            tries++;
            } while (!isFarEnough(x, y) && tries < 100);
            items.push(new Flower(x, y, w));
        }
    }
      
    p.draw = () => {
        // background(map(sin(200 + boff), -1, 1, 0, 255));
        p.background(240);
        for (let i = 0; i < items.length; i++) {
            // p.items[i].update();
            items[i].show();
        }
        // boff += 0.1;
        p.noLoop();
    }
      
    class Flower {
        x:number
        y:number
        w:number
        r:number
        v:number
        n:number
        size:number
        color1:string
        color2:string
        rotationSpeed:number
        rotationDirection:number
        constructor(x:number, y:number, w:number) {
            this.x = x;
            this.y = y;
            this.w = p.random(w / 2, w * 2);
            this.r = p.random(p.QUARTER_PI);
            this.v = p.random(10);
            this.n = p.int(p.random(5, 10));
            this.size = p.random(0.5, 2);
            // this.color1 = p.random(colors);
            this.color1 = randomColourSelect(palette, percentages)
            // this.color2 = p.random(colors);
            this.color2 = randomColourSelect(palette, percentages)
            if (this.color1 === this.color2) this.color2 = randomColourSelect(palette, percentages)
            this.rotationSpeed = p.random(0.005, 0.02);
            this.rotationDirection = p.random([1, -1]);
        }
        
        update() {
            this.r = p.map(
            p.sin(p.frameCount * this.rotationSpeed) * this.rotationDirection,
                -1,
                1,
                0,
                p.TAU,
            );
        }
        
        show() {
            p.push();
            p.translate(this.x, this.y);
            p.rotate(this.r);
            for (let i = 0; i < this.n; i++) {
                p.fill(p.lerpColor(p.color(this.color1), p.color(this.color2), i / this.n));
                p.ellipse(1.4 * this.w, 0, 2 * this.w, 0.8 * this.w);
                p.rotate(p.TAU / this.n);
            }
            p.fill(this.color2);
            p.circle(0, 0, this.w * 0.8);
            p.pop();
        }
    }
      
    function isFarEnough(x:number, y:number) {
        for (let i = 0; i < items.length; i++) {
            let flower = items[i];
            let d = p.dist(x, y, flower.x, flower.y);
            if (d < minDistance) {
            return false;
            }
        }
        return true;
    }
}