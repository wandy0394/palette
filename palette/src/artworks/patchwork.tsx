import p5 from "p5";
import { HEX, Palette } from "../types/colours";
import { ArtworkProps } from "./utils/types";
import { extractColours, randomColourSelect } from "./utils/utils";
import ColourScheme from "../sections/ColourScheme";

export default function patchwork(props:ArtworkProps) {
    
    //adaptive from work by Manolov AC as below
    
    //////////////////////////////////////////////////////////////////////////
    //                       //                                             //
    //   -~=Manoylov AC=~-   //           Semi Circle Patchwork             //
    //                       //                                             //
    //////////////////////////////////////////////////////////////////////////
    //                                                                      //
    // Controls:                                                            //
    //    mouse                                                             //
    //      click: generate new patchwork                                   //
    //                                                                      //
    //    keyboard                                                          //
    //       's': save image                                                //
    //       '1': modeFn - semiDual                                         //
    //       '2': modeFn - shark                                            //
    //       '3': modeFn - oneSemi                                          //
    //       '4': modeFn - mess                                             //
    //       '5': modeFn - rotateSemi                                       //
    //       '6': modeFn - pear                                             //
    //       '7': modeFn - chain                                            //
    //////////////////////////////////////////////////////////////////////////
    //                                                                      //
    // Contacts:                                                            //
    //    http://manoylov.tumblr.com/                                       //
    //    https://codepen.io/Manoylov/                                      //
    //    https://www.openprocessing.org/user/23616/                        //
    //    https://www.facebook.com/epistolariy                              //
    //////////////////////////////////////////////////////////////////////////
    const {p, palette, dim, percentages} = props
    
    var countBorder = 10;
    var blockSize = Math.floor(dim[0] / countBorder);
    var wdt = blockSize * countBorder;
    var hgt = blockSize * countBorder;
    var modes = [semiDual, shark, oneSemi, mess, rotateSemi, pear, chain];
    var currModeFn = pear;
    var colorSchemes1 = [
        [ '#152A3B', '#158ca7', '#F5C03E', '#D63826', '#F5F5EB' ],
        [ '#0F4155', '#288791', '#7ec873', '#F04132', '#fcf068' ],
        [ '#E8614F', '#F3F2DB', '#79C3A7', '#668065', '#4B3331' ]
    ];
    // var colorSchemes = [
    //     extractColours(palette)
    // ]
    // var queueNum = [ 0, 1, 2, 3, 4 ];
    const numColours = 12
    
    // var queueNum = [...Array(colorSchemes[0].length).keys()]
    let queueNum = [...Array(numColours).keys()]
    // var clrs = colorSchemes[Math.floor(p.random(colorSchemes.length))];
    let clrs:HEX[] = []
    for (let i = 0; i < numColours; i++) {
        clrs.push(randomColourSelect(palette, percentages))
    }

    

    p.setup = () => {
        p.createCanvas(wdt, hgt);
        p.rectMode(p.CENTER);
        p.noStroke();
        p.noLoop();
    }

    p.draw = () => {
        p.background(25);
        for (var y = blockSize / 2; y < p.height; y+=blockSize) {
            for (var x = blockSize / 2; x < p.width; x+=blockSize) {
                queueNum = shuffleArray([...Array(numColours).keys()]);

                p.fill(clrs[queueNum[0]]);
                p.rect(x, y, blockSize, blockSize);

                p.push();
                p.translate(x, y);
                currModeFn(0, 0, clrs);
                p.pop();
            }
        }
        paper();
    }

    function chain(x:number, y:number, clrs:string[]) {
        p.rotate(p.radians(90 * Math.round(p.random(1, 5))));
        p.fill(clrs[queueNum[1]]);
        p.arc(x - blockSize / 2, y, blockSize, blockSize, p.radians(270), p.radians(450));
        p.fill(clrs[queueNum[2]]);
        p.arc(x + blockSize / 2, y, blockSize, blockSize, p.radians(90),  p.radians(270));

        p.rotate(p.radians(90 * Math.round(p.random(1, 5))));
        p.fill(clrs[queueNum[1]]);
        p.arc(x, y + blockSize / 2, blockSize, blockSize, p.radians(180), p.radians(360));
        p.fill(clrs[queueNum[2]]);
        p.arc(x, y - blockSize / 2, blockSize, blockSize, p.radians(0),   p.radians(180));
    }

    function pear(x:number, y:number, clrs:string[]) {
        p.rotate(p.radians(90 * Math.round(p.random(1, 5))));

        p.fill(clrs[queueNum[1]]);
        p.arc(x - blockSize / 2, y, blockSize, blockSize, p.radians(270), p.radians(450));
        p.fill(clrs[queueNum[2]]);
        p.arc(x + blockSize / 2, y, blockSize, blockSize, p.radians(90),  p.radians(270));

        p.fill(clrs[queueNum[1]]);
        p.arc(x, y + blockSize / 2, blockSize, blockSize, p.radians(180), p.radians(360));
        p.fill(clrs[queueNum[2]]);
        p.arc(x, y - blockSize / 2, blockSize, blockSize, p.radians(0),   p.radians(180));
    }

    function rotateSemi(x:number, y:number, clrs:string[]) {
        p.rotate(p.radians(90 * Math.round(p.random(1, 5))));
        p.fill(clrs[queueNum[1]]);
        p.arc(-blockSize / 2, 0, blockSize, blockSize, p.radians(270), p.radians(450));
    }

    function mess(x:number, y:number, clrs:string[]) {
        p.fill(clrs[queueNum[Math.floor(p.random(queueNum.length))]]);
        p.arc(-blockSize / 2, 0, blockSize, blockSize, p.radians(270), p.radians(450));
        for (var i = 0; i < 3; i++) {
            p.fill(clrs[queueNum[Math.floor(p.random(queueNum.length))]]);
            p.rotate(p.radians(90 * Math.round(p.random(1, 5))));
            p.arc(x, y + blockSize / 2, blockSize, blockSize, p.radians(270), p.radians(450));
        }
    }

    function oneSemi(x:number, y:number, clrs:string[]) {
    if (p.random(1) > .2) {
        p.fill(clrs[queueNum[Math.floor(p.random(queueNum.length))]]);
        p.arc(x - blockSize / 2, y, blockSize, blockSize, p.radians(270), p.radians(450));
    }
    }

    function shark(x:number, y:number, clrs:string[]) {
        if (p.random(1) > .4) {
            p.fill(clrs[queueNum[Math.floor(p.random(queueNum.length))]]);
            p.arc(x, y + blockSize / 2, blockSize, blockSize, p.radians(270), p.radians(450));
        }
    }

    function semiDual(x:number, y:number, clrs:string[]) {
        p.rotate(p.radians(90 * Math.round(p.random(1, 5))));
        if (p.random() > .005) {
            p.fill(clrs[queueNum[1]]);
            p.arc(x - blockSize / 2, y, blockSize, blockSize, p.radians(270), p.radians(450));
            p.fill(clrs[queueNum[2]]);
            p.arc(x + blockSize / 2, y, blockSize, blockSize, p.radians(90),  p.radians(270));
        }
    }

    function shuffleArray(array:any[]) {
        var j, temp;
        for (var i = array.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array;
    }

    // function resetPatchwork(modeFn?:(x: any, y: any, clrs: any) => void) {
    //     currModeFn = modeFn || modes[Math.floor(p.random(modes.length))];
    //     clrs = colorSchemes[Math.floor(p.random(colorSchemes.length))];
    //     p.redraw();
    // }

    // function mousePressed(){
    //     resetPatchwork();
    // }

    // function keyPressed(e:KeyboardEvent){
    //     switch(e.key.toLowerCase()){
    //         case '1': resetPatchwork(semiDual); break;
    //         case '2': resetPatchwork(shark); break;
    //         case '3': resetPatchwork(oneSemi); break;
    //         case '4': resetPatchwork(mess); break;
    //         case '5': resetPatchwork(rotateSemi); break;
    //         case '6': resetPatchwork(pear); break;
    //         case '7': resetPatchwork(chain); break;
    //         case 's': p.save('img_' + ~~p.random(100, 900) + '.jpg'); break;
    //         default: resetPatchwork(); break;
    //     }
    // }

    function paper() {
        p.push();
        p.strokeWeight(1);
        p.noStroke();
        for (var i = 0; i<p.width-1; i+=2) {
            for (var j = 0; j<p.height-1; j+=2) {
            p.fill(p.random(205-40, 205+30), 25);
            p.rect(i, j, 2, 2);
            }
        }

        for (var i = 0; i<30; i++) {
            p.fill(p.random(130, 215), p.random(100, 170));
            p.rect(p.random(0, p.width-2), p.random(0, p.height-2), p.random(1, 3), p.random(1, 3));
        }

        p.pop();
    }
}