import data from "./dummyData.json"

class LibraryDAO {
    static getPalette(userEmail:string) {
        console.log(JSON.stringify(data.palettes))
        const palettes = data.palettes.filter(p=>p.email === userEmail)
        return palettes
    }
}

export default LibraryDAO