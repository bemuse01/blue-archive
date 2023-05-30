import * as THREE from '../../../lib/three.module.js'
import Plane from '../../objects/plane.js'

import Shader from '../shader/quad.shader.js'

export default class{
    constructor({
        group,
        size,
    }){
        this.group = group
        this.size = size

        this.img = './assets/src/6.jpg'

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    async create(){
        const {size, img} = this
        const {w, h} = size.obj

        const texture = await this.loadTexture(img)

        this.quad = new Plane({
            width: w / 2,
            height: h / 2,
            widthSeg: 1,
            heightSeg: 1,
            materialName: 'ShaderMaterial',
            materialOpt: {
                vertexShader: Shader.vertex,
                fragmentShader: Shader.fragment,
                transparent: true,
                uniforms: {
                    uTexture: {value: texture},
                    uTime: {value: 0}
                }
            }
        })

        this.group.add(this.quad.get())
    }
    loadTexture(url){
        return new Promise((resolve, reject) => {
            const texture = new THREE.TextureLoader()

            const onLoad = (tex) => resolve(tex)

            texture.load(url, onLoad)
        })
    }


    // animate
    animate(){
        if(!this.quad) return

        const time = window.performance.now()
        
        this.quad.setUniform('uTime', time)
    }
}