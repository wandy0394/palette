import { describe } from "node:test"
import {test, expect, it} from '@jest/globals'
import sinon from "sinon"
import LibraryController from "../controllers/libraryController"
import LibraryService from "../services/libraryService"
import { User, Palette, SavedPalette } from "../types/types"
import {Request, Response, NextFunction, Send} from 'express'
import { palette } from "@mui/system"

const flushPromises = () => new Promise(setImmediate)

describe('getPalette test', ()=>{
    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should respond with error, internal server error', async()=>{
        const mReq:Request = {params:{
            userId:1
        }} as any
        sandbox.stub(LibraryService, 'getPalette').rejects()
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.getPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {error:'Internal server error'})
    })



    it('should respond with service result', async()=>{
        const mReq:Request = {params:{
            userId:1
        }} as any
        sandbox.stub(LibraryService, 'getPalette').resolves([
            'testResult'
        ])
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.getPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:['testResult']})
    })
    it('should respond with error', async()=>{
        const mReq:Request = {params:{
            userId:undefined
        }} as any
        sandbox.stub(LibraryService, 'getPalette').resolves([
            'testResult'
        ])
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.getPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {status:'error', response:'Invalid User Id'})
    })

})

describe('getPaletteById test', ()=>{
    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should respond with service result', async()=>{

        const mReq:Request = {params:{
            userId:1,
            paletteId:2
        }} as any
        sandbox.stub(LibraryService, 'getPaletteById').resolves([
            'testResult'
        ])
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.getPaletteById(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:['testResult']})
    })


    it('should throw internal server error', async()=>{
        const mReq:Request = {params:{
            userId:1,
            paletteId:2
        }} as any
        sandbox.stub(LibraryService, 'getPaletteById').rejects()
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.getPaletteById(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {error:'Internal server error'})
    })

})

describe('addPalette test', ()=>{
    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should return error, missing userId', async()=>{
        const mReq:Request = {body:{
            userId:undefined,
            userEmail:'test@test.com',
            palette:'palette'
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing userId', status:'error'})        
    })

    it('should return error, missing userEmail', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:undefined,
            palette:'palette'
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing userEmail', status:'error'})        
    })

    it('should return error, missing Palette', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:undefined
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing Palette', status:'error'})        
    })

    it('should throw error', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette'
        }} as any

        sandbox.stub(LibraryService, 'addPalette').rejects({error:'Error'})
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:{error:'Error'}, status:'error'})        
    })

    it('should succeed', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette'
        }} as any

        sandbox.stub(LibraryService, 'addPalette').resolves('success')
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'success', status:'ok'})        
    })
})

describe('updatePalette test', ()=>{
    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should return error, missing userId', async()=>{
        const mReq:Request = {body:{
            userId:undefined,
            userEmail:'test@test.com',
            palette:'palette',
            paletteId:2
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing userId', status:'error'})        
    })

    it('should return error, missing userEmail', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:undefined,
            palette:'palette',
            paletteId:2
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing userEmail', status:'error'})        
    })

    it('should return error, missing Palette', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:undefined,
            paletteId:2
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing Palette', status:'error'})        
    })
    it('should return error, missing PaletteId', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            paletteId:undefined
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing PaletteId', status:'error'})        
    })
    it('should throw error', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            paletteId:2
        }} as any

        sandbox.stub(LibraryService, 'updatePalette').rejects({error:'Error'})
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:{error:'Error'}, status:'error'})        
    })

    it('should succeed', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            paletteId:2
        }} as any

        sandbox.stub(LibraryService, 'updatePalette').resolves('success')
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'success', status:'ok'})        
    })
})

describe('deletePalette test', ()=>{
    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should return error, missing userId', async()=>{
        const mReq:Request = {body:{
            userId:undefined,
            userEmail:'test@test.com',
            paletteId:2
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.deletePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing userId', status:'error'})        
    })

    it('should return error, missing userEmail', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:undefined,
            paletteId:2
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.deletePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing userEmail', status:'error'})        
    })


    it('should return error, missing PaletteId', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            paletteId:undefined
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.deletePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'Missing PaletteId', status:'error'})        
    })
    it('should throw error', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            paletteId:2
        }} as any

        sandbox.stub(LibraryService, 'deletePalette').rejects({error:'Error'})
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.deletePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:{error:'Error'}, status:'error'})        
    })

    it('should succeed', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            paletteId:2
        }} as any

        sandbox.stub(LibraryService, 'deletePalette').resolves('success')
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.deletePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {response:'success', status:'ok'})        
    })
})