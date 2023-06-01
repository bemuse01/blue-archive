import { AdditiveBlending } from '../../../lib/three.module.js'
import Plane from '../../objects/plane.js'
import Shader from '../shader/noise.shader.js'

export default class{
    constructor({group, size}){
        this.group = group
        this.size = size

        this.y = 0
        this.velocity = 2.5
        this.height = 0.175
        this.masterOpacity = 0.5
        this.boundStrength = 0.05

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const {w, h} = this.size.obj

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
                blending: AdditiveBlending,
                uniforms: {
                    time: {value: 0},
                    uy: {value: 0},
                    boundStrength: {value: this.boundStrength},
                    height: {value: this.height * this.size.el.h},
                    masterOpacity: {value: this.masterOpacity}
                }
            }
        })

        this.plane.get().scale.set(w, h, 1)

        this.group.add(this.plane.get())
    }


    // resize
    resize(size){
        this.size = size

        this.plane.setUniform('height', this.height * this.size.el.h)

        this.plane.get().scale.set(this.size.obj.w, this.size.obj.h, 1)
    }


    // animate
    animate(){
        const time = window.performance.now()

        const height = this.height * this.size.el.h

        this.y -= this.velocity
        if(this.y < -height) this.y = this.size.el.h + height

        this.plane.setUniform('time', time)
        this.plane.setUniform('uy', this.y)
    }
}