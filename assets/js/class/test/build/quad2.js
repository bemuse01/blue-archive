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

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.quad = new Plane({
            width: 10,
            height: 10,
            widthSeg: 1,
            heightSeg: 1,
            materialName: 'MeshBasicMaterial',
            materialOpt: {
                color: 'white',
                transparent: true
            }
        })

        this.group.add(this.quad.get())
    }


    // animate
    animate(){
        const time = window.performance.now()

        this.quad.get().position.x = Math.cos(time * 0.005) * 10;
    }
}