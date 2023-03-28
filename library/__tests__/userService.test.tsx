import { describe } from "node:test"
import {test, expect, it} from '@jest/globals'
import sinon from "sinon"
import UserService from "../services/userService"
import UsersDAO from "../database/usersDAO"
import { User } from "../types/types"
import {Request, Response, NextFunction, Send} from 'express'
import bcrypt from "bcrypt"
const flushPromises = () => new Promise(setImmediate)

describe('Signup test', ()=>{

    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should throw user already exists error', async()=>{
        const email:string = 'test@test.com'
        const password:string = 'password'
        const name:string = 'Tester'

        sandbox.stub(UsersDAO, 'userExists').resolves(true)
        try {
            const result = await UserService.signup(email, password, name)
            expect(result).toBe(undefined)
        }
        catch(e:any) {
            expect(e.message).toBe('User already exists')
        }
    })

    it('should return user', async()=>{
        const email:string = 'test@test.com'
        const password:string = 'password'
        const name:string = 'Tester'

        sandbox.stub(UsersDAO, 'userExists').resolves(false)
        sandbox.stub(UsersDAO, 'signup').resolves({
            id:1,
            email:email,
            name:name
        })

        const expectedResult:User = {
            id:1, 
            email:email,
            name:name
        }

        try {
            const result = await UserService.signup(email, password, name)
            expect(result).toStrictEqual(expectedResult)
        }
        catch(e:any) {
            expect(e.message).toBe(undefined)
        }
    })

})

describe('Login test', ()=>{

    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should throw exception', async()=>{
        const email:string = 'test@test.com'
        const password:string = 'password'
        const name:string = 'Tester'

        sandbox.stub(UsersDAO, 'getOneUser').rejects({message:`error message`})
        try {
            const result = await UserService.login(email, password)
            expect(result).toBe(undefined)
        }
        catch(e:any) {
            console.log(e)
            expect(e.message).toBe(`error message`)
        }        
    })

    it('should throw invalid credentials exception', async()=>{
        const email:string = 'test@test.com'
        const password:string = 'password'
        const name:string = 'Tester'

        sandbox.stub(UsersDAO, 'getOneUser').resolves({
            id:1,
            email:email,
            name:name,
            passwordHash:password
        })
        sandbox.stub(bcrypt, 'compare').resolves(false)
        try {
            const result = await UserService.login(email, password)
            expect(result).toBe(undefined)
        }
        catch(e:any) {
            console.log(e)
            expect(e.message).toBe(`Invalid credentials.`)
        }        
    })


    it('should return user', async()=>{
        const email:string = 'test@test.com'
        const password:string = 'password'
        const name:string = 'Tester'

        const expectedResult:User = {
            id:1,
            email:email,
            name:name,
            passwordHash:undefined
        }

        sandbox.stub(UsersDAO, 'getOneUser').resolves({
            id:1,
            email:email,
            name:name,
            passwordHash:password
        })
        sandbox.stub(bcrypt, 'compare').resolves(true)
        try {
            const result = await UserService.login(email, password)
            expect(result).toStrictEqual(expectedResult)
        }
        catch(e:any) {
            expect(e).toBe(undefined)
        }        
    })
})


describe('GetUser test', ()=>{

    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should throw exception', async()=>{
        const email:string = 'test@test.com'
        const expectedResult:User = {
            id:1, 
            email:email,
            name:'Tester'
        }
        sandbox.stub(UsersDAO, 'getUser').rejects({Error:'Error'})
        try {
            const result = await UserService.getUser(email)
            expect(result).toBe(undefined)
        }
        catch(e) {
            expect(e).toStrictEqual({Error:'Error'})
        }
    })

    it('should return user', async()=>{
        const email:string = 'test@test.com'
        const expectedResult:User = {
            id:1, 
            email:email,
            name:'Tester'
        }
        sandbox.stub(UsersDAO, 'getUser').resolves(expectedResult)
        try {
            const result = await UserService.getUser(email)
            expect(result).toStrictEqual(expectedResult)
        }
        catch(e) {
            expect(e).toBe(undefined)
        }
    })

})