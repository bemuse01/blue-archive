import * as THREE from '../../../lib/three.module.js'
import Plane from '../../objects/plane.js'
import Shader from '../shader/screenBurn.shader.js'

export default class{
    constructor({group, size}){
        this.group = group
        this.size = size

        this.strength = 20
        this.color = new THREE.Color(this.strength / 255, this.strength / 255, this.strength / 255)
        this.burnSize = 5

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
                uniforms: {
                    uColor: {value: this.color},
                    burnSize: {value: this.burnSize}
                }
            }
        })

        this.plane.get().scale.set(w, h, 1)

        this.group.add(this.plane.get())
    }


    // resize
    resize(size){
        this.size = size

        this.plane.get().scale.set(this.size.obj.w, this.size.obj.h, 1)
    }
}