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
        const mReq:Request = {body:{
            userId:1
        }} as any
        sandbox.stub(LibraryService, 'getPalette').rejects()
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub(),
            json: sandbox.stub().returnsThis()
        } as any

        LibraryController.getPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.json as sinon.SinonSpy, { status: 'error', data:{error: 'Error'} } )
    })



    it('should respond with service result', async()=>{
        const mReq:Request = {body:{
            userId:1
        }} as any
        sandbox.stub(LibraryService, 'getPalette').resolves([
            'testResult'
        ])
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub(),
            set: sandbox.stub().returnsThis(),
            json: sandbox.stub().returnsThis()
        } as any

        LibraryController.getPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.json as sinon.SinonSpy, {status:'ok', data:['testResult']})
    })
    it('should respond with error', async()=>{
        const mReq:Request = {body:{
            userId:undefined
        }} as any
        sandbox.stub(LibraryService, 'getPalette').resolves([
            'testResult'
        ])
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub(),
            set: sandbox.stub().returnsThis(),
            json: sandbox.stub().returnsThis()
        } as any

        LibraryController.getPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.json as sinon.SinonSpy, {status:'error', data:{error:'Missing User Id'}})
    })

})

describe('getPaletteByUUID test', ()=>{
    var sandbox:any
    beforeEach(function() {
        sandbox = sinon.createSandbox()
    })

    afterEach(function() {
        sandbox.restore();
    })

    it('should respond with service result', async()=>{
        const mReq:Request = {
            params:{
                paletteUUID:2
            },
            body:{
                userId:1,
            }
        } as any
        sandbox.stub(LibraryService, 'getPaletteByUUID').resolves([
            'testResult'
        ])
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub(),
            set: sandbox.stub().returnsThis()
        } as any

        LibraryController.getPaletteByUUID(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {status:'ok', data:['testResult']})
    })


    it('should throw internal server error', async()=>{
        const mReq:Request = {
            params:{
                paletteUUID:2
            },
            body:{
                userId:1,
            }
        } as any
        sandbox.stub(LibraryService, 'getPaletteByUUID').rejects()
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub(),
            set: sandbox.stub().returnsThis()
        } as any

        LibraryController.getPaletteByUUID(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', data:{error: 'Error'} })
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
            palette:'palette',
            name:'PaletteName'
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing userId'}, status:'error'})        
    })

    it('should return error, missing userEmail', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:undefined,
            palette:'palette',
            name:'PaletteName'
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing userEmail'}, status:'error'})        
    })

    it('should return error, missing Palette', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:undefined,
            name:'PaletteName'
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing Palette'}, status:'error'})        
    })
    it('should return error, missing Name', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            name:undefined
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing Name'}, status:'error'})        
    })

    it('should throw error', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            name:'PaletteName'
        }} as any

        sandbox.stub(LibraryService, 'addPalette').rejects({error:'Error'})
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', data:{error:'Internal server error'} } )        
    })

    it('should succeed', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            name:'PaletteName'
        }} as any

        sandbox.stub(LibraryService, 'addPalette').resolves('success')
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.addPalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:'success', status:'ok'})        
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
            paletteUUID:2
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing userId'}, status:'error'})        
    })

    it('should return error, missing userEmail', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:undefined,
            palette:'palette',
            paletteUUID:2
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing userEmail'}, status:'error'})        
    })

    it('should return error, missing Palette', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:undefined,
            paletteUUID:2
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing Palette'}, status:'error'})        
    })
    it('should return error, missing paletteUUID', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            paletteUUID:undefined
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing PaletteUUID'}, status:'error'})        
    })
    it('should return error, missing Name', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            paletteUUID:2,
            name:undefined
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing Name'}, status:'error'})        
    })
    it('should throw error', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            paletteUUID:2,
            name:'Name'
        }} as any

        sandbox.stub(LibraryService, 'updatePalette').rejects({error:'Error'})
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', data:{error: 'Internal server error'} })        
    })

    it('should succeed', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            palette:'palette',
            paletteUUID:2,
            name:'PaletteName'
        }} as any

        sandbox.stub(LibraryService, 'updatePalette').resolves('success')
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.updatePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:'success', status:'ok'})        
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
            paletteUUID:2
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.deletePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing userId'}, status:'error'})        
    })

    it('should return error, missing paletteUUID', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            paletteUUID:undefined
        }} as any

        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.deletePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 400)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:{error:'Missing PaletteUUID'}, status:'error'})        
    })
    it('should throw error', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            paletteUUID:2
        }} as any

        sandbox.stub(LibraryService, 'deletePalette').rejects({error:'Error'})
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.deletePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 500)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, { status: 'error', data:{error:'Internal server error'} })        
    })

    it('should succeed', async()=>{
        const mReq:Request = {body:{
            userId:1,
            userEmail:'test@test.com',
            paletteUUID:2
        }} as any

        sandbox.stub(LibraryService, 'deletePalette').resolves('success')
        const mRes:Response = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        } as any

        LibraryController.deletePalette(mReq, mRes, ()=>true)
        await flushPromises()
        sandbox.assert.calledWith(mRes.status as sinon.SinonSpy, 200)
        sandbox.assert.calledWith(mRes.send as sinon.SinonSpy, {data:'success', status:'ok'})        
    })
})