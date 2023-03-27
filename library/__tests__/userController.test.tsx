import { describe } from "node:test"
import {test, expect, it} from '@jest/globals'
import sinon from "sinon"
import UserController from "../controllers/userController"
import UserService from "../services/userService"
import { User } from "../types/types"
import {Request, Response, NextFunction, Send} from 'express'

const flushPromises = () => new Promise(setImmediate)

describe('Signup Test', ()=>{
    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should respond with error, missing email field', async()=>{
        const mReq:Request = {body:{
            email:'',
            password:'',
            name:''
        }} as any
        // const mRes = {

        // }
        sandbox.stub(UserService, 'signup').resolves({
            id:1,
            name:'Test',
            email:'test@test.com'
        })
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        UserController.signup(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', error: 'Bad request: Missing email field' })
    })

    it('should respond with error, missing password field', async()=>{
        const mReq:Request = {body:{
            email:'test@test.com',
            password:'',
            name:''
        }} as any
        // const mRes = {

        // }
        sandbox.stub(UserService, 'signup').resolves({
            id:1,
            name:'Test',
            email:'test@test.com'
        })
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        UserController.signup(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', error: 'Bad request: Missing password field' })
    })

    it('should respond with error, missing name field', async()=>{
        const mReq:Request = {body:{
            email:'test@test.com',
            password:'password',
            name:''
        }} as any
        // const mRes = {

        // }
        sandbox.stub(UserService, 'signup').resolves({
            id:1,
            name:'Test',
            email:'test@test.com'
        })
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        UserController.signup(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', error: 'Bad request: Missing name field' })
    })

    it('should successfully signup', async()=>{
        const mReq:Request = {body:{
            email:'test@test.com',
            password:'password',
            name:'Test'
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any
        sandbox.stub(UserService, 'signup').resolves({
            id:1,
            name:'Test',
            email:'test@test.com'
        })
        UserController.signup(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'ok', data: { id: 1, name: 'Test', email: 'test@test.com' } })
    })

    it('should not successfully signup', async()=>{
        const mReq:Request = {body:{
            email:'test@test.com',
            password:'password',
            name:'Test'
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any
        sandbox.stub(UserService, 'signup').rejects({
            response:'rejected'
        })
        UserController.signup(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', error:{response:'rejected'} })
    })
    
})

describe('Login Test', ()=>{
    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should respond with error, missing email field', async()=>{
        const mReq:Request = {body:{
            email:'',
            password:'',
        }} as any
        // const mRes = {

        // }
        sandbox.stub(UserService, 'login').resolves({
            id:1,
            name:'Test',
            email:'test@test.com'
        })
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        UserController.login(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', error: 'Bad request: Missing email field' })
    })

    it('should respond with error, missing password field', async()=>{
        const mReq:Request = {body:{
            email:'test@test.com',
            password:'',
        }} as any
        // const mRes = {

        // }
        sandbox.stub(UserService, 'login').resolves({
            id:1,
            name:'Test',
            email:'test@test.com'
        })
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        UserController.login(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', error: 'Bad request: Missing password field' })
    })


    it('should successfully login', async()=>{
        const mReq:Request = {body:{
            email:'test@test.com',
            password:'password',
            name:'Test'
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any
        sandbox.stub(UserService, 'login').resolves({
            id:1,
            name:'Test',
            email:'test@test.com'
        })
        UserController.login(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { user: { id: 1, name: 'Test', email: 'test@test.com' } })
    })

    it('should not successfully login', async()=>{
        const mReq:Request = {body:{
            email:'test@test.com',
            password:'password',
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any
        sandbox.stub(UserService, 'login').throws(new Error("rejected"))
        
        UserController.login(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { error:'Internal server error: Error: rejected' })
    })
    
})


describe('getUser Test', ()=>{
    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should respond with error, missing email field', async()=>{
        const mReq:Request = {body:{
            email:'',
        }} as any
        // const mRes = {

        // }
        sandbox.stub(UserService, 'getUser').resolves({
            id:1,
            name:'Test',
            email:'test@test.com'
        })
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        UserController.getUser(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', error: 'Bad request: Missing email field' })
    })

   

    it('should successfully get user', async()=>{
        const mReq:Request = {body:{
            email:'test@test.com',
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any
        sandbox.stub(UserService, 'getUser').resolves({
            id:1,
            name:'Test',
            email:'test@test.com'
        })
        UserController.getUser(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { user: { id: 1, name: 'Test', email: 'test@test.com' } })
    })

    it('should not successfully get user', async()=>{
        const mReq:Request = {body:{
            email:'test@test.com',
            password:'password',
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any
        sandbox.stub(UserService, 'getUser').rejects('rejected')
        UserController.getUser(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { error:'Internal server error: rejected' })
    })
    
})