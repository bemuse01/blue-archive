import * as THREE from '../../lib/three.module.js'

export default class{
    constructor(canvas, box){
        this.canvas = canvas
        this.box = box

        this.init()
    }


    // init
    init(){
        this.create()
        this.animate()

        window.addEventListener('resize', () => this.resize(), false)
    }


    // create
    create(){
        const {width, height} = this.box.getBoundingClientRect()
        
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: this.canvas})
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(RATIO)
        this.renderer.setClearColor(0x000000, 0.0)
        this.renderer.setClearAlpha(0.0)
        this.renderer.autoClear = false
    }


    // render
    animate(){
        this.render()

        requestAnimationFrame(() => this.animate())
    }
    render(){
        this.renderer.setScissorTest(false)
        this.renderer.clear(true, true)
        this.renderer.setScissorTest(true)
    }


    // resize
    resize(){
        const {width, height} = this.box.getBoundingClientRect()

        console.log(width, height)

        this.renderer.setSize(width, height)
    }
}