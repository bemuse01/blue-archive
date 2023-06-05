import * as THREE from '../../../lib/three.module.js'
import Plane from '../../objects/plane.js'
import Shader from '../shader/text.shader.js'
import Text from '../subClass/text.js'

export default class{
    constructor({group, size, rtScene}){
        this.group = group
        this.size = size
        this.rtScene = rtScene

        this.canvas = document.createElement('canvas')
        this.canvas.width = this.size.el.w
        this.canvas.height = this.size.el.h
        this.context = this.canvas.getContext('2d')

        // text
        this.colors = ['#2cfadf', '#f32288']
        this.fontSize = 0.026
        this.count = 30
        this.texts = Array.from({length: this.count}, (_, i) => new Text(this.context, this.size.el, this.fontSize, this.colors[i % this.colors.length]))
        this.masterOpacity = 1.0
        this.shadowOpacity = 0.4
        this.trailThreshold = 0.1
        this.shadowPosition = new THREE.Vector2(0.0025, 0) // uv position
        this.chance = 0.99

        // white line
        this.y = 0
        this.velocity = 1.5
        this.height = 0.15
        this.lineOpacity = 0.8
        this.boundStrength = 0.001 // y 기준 아래쪽 라인 없애는 용도

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

        this.group.add(this.plane.get())
        // this.rtScene.add(this.plane.get())
    }
    createTexture(){
        return new THREE.CanvasTexture(this.canvas)
    }


    // resize
    resize(size){
        this.size = size

        this.canvas.width = this.size.el.w
        this.canvas.height = this.size.el.h

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


    // animate
    animate(){
        const time = window.performance.now()

        this.plane.setUniform('time', time)

        this.drawTexture()
        this.updateUniform()
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
        const {fontSize} = this

        const {w, h} = this.size.el

        // this.context.globalCompositeOperation = 'color-dodge'
        const fs = ~~(fontSize * h)

        this.context.fillStyle = 'rgba(0, 0, 0, 0.05)'
        this.context.fillRect(0, 0, w, h)

        this.context.textAlign = 'center'
        this.context.font = `${fs}px MonomaniacOne`
        this.texts.forEach(text => text.animate())

        const texture = this.plane.getUniform('uTexture')
        texture.needsUpdate = true
    }
}