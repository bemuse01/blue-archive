import Plane from '../../objects/plane.js'
import Shader from '../shader/noise2.shader.js'

export default class{
    constructor({group, size}){
        this.group = group
        this.size = size

        this.masterOpacity = 0.075

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
                    time: {value: 0},
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

        this.plane.get().scale.set(this.size.obj.w, this.size.obj.h, 1)
    }


    // animate
    animate(){
        const time = window.performance.now()

        this.plane.setUniform('time', time)
    }
}