export function modulo(n:number, m:number):number {
    if (!Number.isInteger(n) || !Number.isInteger(m)) return NaN

    return n - (m*Math.floor(n/m))
}