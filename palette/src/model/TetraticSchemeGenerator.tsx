import { Point } from "../types/cartesian";
import { HEX, HSV, SchemeOutput } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class TetraticSchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    generateRandomSwatch(rgb: string): HEX[][] {
        //generate 10 random colours within the triangle bounded by the square colours
        const colours:SchemeOutput = this.generateScheme(rgb)

        let errorFound:boolean = false
        const hsvPoints:HSV[][] = []
        colours.schemes.forEach((scheme, index)=>{
            hsvPoints.push([])
            scheme.forEach(colour=>{
                let hsv:HSV|null = this.converter.rgb2hsv(colour) 
                if (hsv === null) {
                    errorFound = true
                }
                else {
                    hsvPoints[index].push(hsv)
                }
            })
        })
        if (errorFound) return [[]]

        //sort hsvPoints by hue in increasing order
        for (let i = 0; i < hsvPoints.length; i++) {
            hsvPoints[i].sort((a,b)=>{
                return a.hue - b.hue
            })
        }
        
        //convert points to cartesian coords
        const cartPoints:Point[][] = hsvPoints.map(points=>{
            return points.map(hsv=>{
                return this.hsv2cartesian(hsv)
            })
        })
        //divide the square into two triangles. The triangle contains the line (hsv[0], hsv[2]) === (cartPoints[0], cartPoints[2])
        const triangles:Point[][][] = []
        for (let i = 0; i < cartPoints.length; i++) {
            triangles.push([[], []])
            triangles[i][0] = [
                cartPoints[i][0],
                cartPoints[i][1],
                cartPoints[i][2]
            ]
    
            triangles[i][1] = [
                cartPoints[i][0],
                cartPoints[i][2],
                cartPoints[i][3]
            ]

        }

        //generate random points within each triangle. All triangles weighted evenly
        let output:HEX[][] = [[]]
        for (let i = 0; i < triangles.length; i++) {
            let temp:HEX[] = []
            //generate random points in each triangle
            for (let j = 0; j < 5; j++) {
                let r1 = Math.random()
                let r2 = Math.random()
    
                let r1sq = Math.sqrt(r1)
                let randomPoint:Point = {
                    x:(1-r1sq)*triangles[i][0][0].x + r1sq*(1-r2)*triangles[i][0][1].x+ r2*r1sq*triangles[i][0][2].x,
                    y:(1-r1sq)*triangles[i][0][0].y + r1sq*(1-r2)*triangles[i][0][1].y+ r2*r1sq*triangles[i][0][2].y
                } 
    
                let rHSV = this.cartesian2hsv(randomPoint)
                rHSV.hue = Math.floor(rHSV.hue)
                rHSV.value = Math.random()
                let rRGB = this.converter.hsv2rgb(rHSV) as HEX
                temp.push(rRGB)
            }     
            
            //generate random points in each triangle
            for (let j = 0; j < 5; j++) {
                let r1 = Math.random()
                let r2 = Math.random()
    
                let r1sq = Math.sqrt(r1)
                let randomPoint:Point = {
                    x:(1-r1sq)*triangles[i][1][0].x + r1sq*(1-r2)*triangles[i][1][1].x+ r2*r1sq*triangles[i][1][2].x,
                    y:(1-r1sq)*triangles[i][1][0].y + r1sq*(1-r2)*triangles[i][1][1].y+ r2*r1sq*triangles[i][1][2].y
                } 
    
                let rHSV = this.cartesian2hsv(randomPoint)
                rHSV.hue = Math.floor(rHSV.hue)
                rHSV.value = Math.random()
                let rRGB = this.converter.hsv2rgb(rHSV) as HEX

                temp.push(rRGB)
            }   
            output[i] = this.sortColoursByHexcode(temp)
        }
        return output
    }
    generateScheme(rgb:HEX):SchemeOutput {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        const output:SchemeOutput = {
            schemes:[[]]
        }
        if (hsv === null) return output

        let angleArray:number[][] = [
            [30, 180, 210],
            [-30, 180, -210]
        ]
        return this.getColoursByHueAngle(rgb, hsv, angleArray)
    } 
    getName():string {
        return "Tetratic Colour Scheme"
    }
}