import p5 from "p5"
import { HEX, Palette } from "../../types/colours"


export function extractColours(palette:Palette):HEX[] {
    const colours1 = palette.colourVerticies.map((colour)=>{
        return `#${colour.rgb}`
    })
    const colours2 = palette.supportColours.map((colour)=>{
        return `#${colour.rgb}`
    })

    return [...colours1, ...colours2]
}

// export function randomColourSelect(palette:Palette):HEX {
//     //colours selected should be random but weighted towards the verticies
//     const colours = extractColours(palette)
//     const numVerticies = palette.colourVerticies.length
//     let outputColour:HEX = '000000'
//     /*
//         Approx 70% of the chosen colours should be the colour verticies
//         The other 30% are support colours, chosen at random, uniformly
//         Of the accent colours, 
//             60% shall be the main colour
//             30% shall be accent-colour1
//             10% shall be accent-colour2 or accent-colour3, chosen at random, uniformly
//         
    
//     */
//     let randomNumber:number = Math.floor(Math.random() * 100)
    
//     if (randomNumber > 70) {
//         randomNumber = Math.floor(Math.random() * 100)
//         if (randomNumber > 60) {
//             outputColour = palette.mainColour.rgb
//         }
//         else if (randomNumber <= 60 && randomNumber > 30) {
//             outputColour = palette.accentColours[0].rgb
//         }
//         else {
//             if (palette.accentColours.length > 1) {
//                 let randomIndex = Math.round(Math.random() * (palette.accentColours.length - 2)) + 1 //generate random index between 1 and end of array
//                 outputColour = palette.accentColours[randomIndex].rgb
//             }
//             else {
//                 outputColour = palette.accentColours[0].rgb
//             }
//         }
//     }
//     else {
//         if (palette.supportColours.length >= 1) {
//             let randomIndex = Math.round(Math.random() * (palette.supportColours.length - 1))
//             outputColour = palette.supportColours[randomIndex].rgb
//         }
//     }
//     console.log(outputColour)
//     return `#${outputColour}`
// }
export function randomColourSelect(palette:Palette, percentages:number[] = [60, 30, 10]):HEX {
    //colours selected should be random but weighted towards the verticies
    const colours = extractColours(palette)
    const numVerticies = palette.colourVerticies.length
    let outputColour:HEX = '000000'
    console.log(percentages)
    /*
        Approx 60% of the chosen colours should be the main colour
        The other 30% are accent colours, chosen at random, uniformly
        The remaining 10% are support colours, chosen at random, uniformly   
    */
    let randomNumber:number = Math.floor(Math.random() * 100)
    
    if (randomNumber < percentages[0]) {
        outputColour = palette.mainColour.rgb
    }
    else if (randomNumber >= percentages[0] && randomNumber < (percentages[0] + percentages[1])) {
        let randomIndex = Math.round(Math.random() * (palette.accentColours.length - 1)) 
        outputColour = palette.accentColours[randomIndex].rgb
    }
    else {
        if (palette.supportColours.length >= 1) {
            let randomIndex = Math.round(Math.random() * (palette.supportColours.length - 1))
            outputColour = palette.supportColours[randomIndex].rgb
        }
    }
    return `#${outputColour}`
}