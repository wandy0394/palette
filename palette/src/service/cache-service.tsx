

export default class CacheService {
    static checkCache(key:string):string|null {
        return localStorage.getItem(key)
    }
    
    static addToCache(key:string, value:string) {
        localStorage.setItem(key, value)
    }

    static clearCache(key:string) {
        localStorage.removeItem(key)
    }
}
