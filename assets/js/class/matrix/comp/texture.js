import * as THREE from '../../../lib/three.module.js'
import Plane from '../../objects/plane.js'
import Shader from '../shader/text.shader.js'
import Text from '../subClass/text.js'

export default class{
    constructor({group, size, rtScene, canvas, context, images}){
        this.group = group
        this.size = size
        this.rtScene = rtScene
        this.canvas = canvas
        this.context = context
        this.images = images

        // text
        this.colors = ['#2cfadf', '#f32288']
        this.fontSize = 0.026
        this.minFontSize = 15
        this.maxFontSize = 30
        this.count = 30
        this.texts = Array.from({length: this.count}, (_, i) => new Text({
            context: this.context, 
            size: this.size.el, 
            fontSize: this.fontSize, 
            color: this.colors[i % this.colors.length],
            minFontSize: this.minFontSize,
            maxFontSize: this.maxFontSize,
        }))
        this.masterOpacity = 1.0
        this.shadowOpacity = 0.4
        this.trailThreshold = 0.1
        this.shadowPosition = new THREE.Vector2(0.0025, 0) // uv position
        this.chance = 0.99
        this.textPlay = true

        // emblem
        this.delta = 0.025
        this.countDown = 2
        this.emblemIdx = 0

        this.throttle = {
            emblem: {
                startTime: window.performance.now(),
                delay: 30
            },
            clear: {
                startTime: window.performance.now(),
                delay: 0
            }
        }

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.createObject()
    }
    createObject(){
        const {w, h} = this.size.obj

        const texture = this.createTexture()

        this.plane = new Plane({
            width: 1,
            height: 1,
            widthSeg: 1,
            heightSeg: 1,
            materialName: 'ShaderMaterial',
            materialOpt: {
                vertexShader: Shader.vertex,
                fragmentShader: Shader.fragment,
                transparent: true,
                uniforms: {
                    trailThreshold: {value: this.trailThreshold},
                    masterOpacity: {value: this.masterOpacity},
                    shadowOpacity: {value: this.shadowOpacity},
                    shadowPosition: {value: this.shadowPosition},
                    uTexture: {value: texture},
                    resolution: {value: new THREE.Vector2(this.size.el.w, this.size.el.h)},
                    time: {value: 0},
                    distortion: {value: 0},
                    distortedColor: {value: new THREE.Color(0xf71bff)}
                }
            }
        })

        this.plane.get().scale.set(w, h, 1)

        // this.group.add(this.plane.get())
        this.rtScene.add(this.plane.get())
    }
    createTexture(){
        return new THREE.CanvasTexture(this.canvas)
    }


    // resize
    resize(size){
        this.size = size

        this.resizeTexture()

        this.plane.get().scale.set(this.size.obj.w, this.size.obj.h, 1)
        this.plane.setUniform('resolution', new THREE.Vector2(this.size.el.w, this.size.el.h))

        this.texts.forEach(text => text.resize(this.size.el))
    }
    resizeTexture(){
        const texture = this.plane.getUniform('uTexture')
        texture.dispose()

        this.plane.setUniform('uTexture', this.createTexture())
    }


    // 
    throttleFrame(callback, name){
        const {startTime, delay} = this.throttle[name]

        const currentTime = window.performance.now()

        if(currentTime - startTime > delay){
            callback()
            this.throttle[name].startTime = window.performance.now()
        }
    }


    // animate
    animate(){
        const texture = this.plane.getUniform('uTexture')
        const time = window.performance.now()

        this.plane.setUniform('time', time)

        this.drawTexture()
        this.updateUniform()
        
        texture.needsUpdate = true
    }
    updateUniform(){
        const rand = Math.random()
        if(rand > this.chance){
            this.plane.setUniform('distortion', 1)
        }else{
            this.plane.setUniform('distortion', 0)
        }
    }
    drawTexture(){
        this.throttleFrame(() => this.clearContext(), 'clear')
        this.drawText()
        this.throttleFrame(() => this.drawEmblem(), 'emblem')
    }
    clearContext(){
        const {w, h} = this.size.el
        
        this.context.fillStyle = 'rgba(0, 0, 0, 0.05)'
        this.context.fillRect(0, 0, w, h)
    }
    drawText(){
        if(!this.textPlay) return
        
        const {fontSize} = this
        const {h} = this.size.el

        const fs = ~~(fontSize * h)

        this.context.textAlign = 'center'
        this.context.font = `${fs}px MonomaniacOne`
        this.texts.forEach(text => text.animate())
    }
    drawEmblem(){
        const {w, h} = this.size.el

        this.countDown -= this.delta

        if(this.countDown < 0.75){
            this.textPlay = false

            this.context.fillStyle = `hsla(${180 + Math.random() * 220}, 100%, 30%, 1)`
            this.context.fillRect(0, 0, w, h)

            if(this.countDown > 0.4){
                this.emblemIdx = ~~(Math.random() * this.images.length)
            }

            const img = this.images[this.emblemIdx]
            const width = img.width
            const height = img.height
            const size = ~~(Math.min(w, h) * 0.75)
            const x = w / 2 - size / 2
            const y = h / 2 - size / 2
            this.context.drawImage(img, 0, 0, width, height, x, y, size, size)
        }

        if(this.countDown < 0){
            this.textPlay = true
            this.countDown = Math.random() * 7 + 7
        }
    }
}