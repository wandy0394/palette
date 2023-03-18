
export type Result<A, B> = Success<A,B> | Fail<A,B>
abstract class IResult<A,B> {

}

class Success<A,B> implements IResult<A,B> {
    public readonly tag:string
    public value:A
    constructor(value:A) {
        this.tag = 'success'
        this.value = value
      
    }
    isError():this is Fail<A,B> {
        return false
    }
    isSuccess():this is Success<A,B> {
        return true
    }
}

class Fail<A,B> implements IResult<A,B> {
    public readonly tag:string
    public error:B
    
    constructor(error:B) {
        this.tag = 'fail'
        this.error = error
    }

    isError():this is Fail<A,B> {
        return true
    }
    isSuccess():this is Success<A,B> {
        return false
    }
}

export function fail<A,B>(error:B):Result<A,B> {
    return new Fail(error)
}
export function success<A,B>(value:A):Result<A,B> {
    return new Success(value)
}

export function isSuccess<A,B>(result:Result<A,B>):result is Success<A,B> {
    return result.tag === 'success'
}

export function isFail<A,B>(result:Result<A,B>):result is Fail<A,B> {
    return result.tag === 'fail'
}
//use custom error type to handle errors
//log errors as close to the source as possible, but handle them higher up