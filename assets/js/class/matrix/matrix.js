import * as THREE from '../../lib/three.module.js'
import Method from '../../method/method.js'

import Texture from './comp/texture.js'
import ScreenBurn from './comp/screenBurn.js'
import Noise from './comp/noise.js'
// import Noise2 from './comp/noise2.js'

export default class{
    constructor({app, element}){
        this.renderer = app.renderer
        this.element = element

        this.fov = 60
        this.near = 0.1
        this.far = 10000
        this.cameraPosition = [0, 0, 100]
        this.size = {el: {w: 0, h: 0}, obj: {w: 0, h: 0}}
        this.params = [
            {
                module: ScreenBurn
            },
            // {
            //     module: Noise2
            // },
            {
                module: Texture
            },
            {
                module: Noise
            },
            
        ]
        this.groups = []
        this.comps = []
        this.build = new THREE.Group()

        this.canvas = null
        this.context = null

        this.images = []
        this.sources = [
            './assets/src/aby.png',
            './assets/src/ari.png',
            './assets/src/geh.png',
            './assets/src/hya.png',
            './assets/src/mil.png',
            './assets/src/red.png',
            './assets/src/sha.png',
            './assets/src/srt.png',
            './assets/src/tri.png',
            './assets/src/val.png',
        ]

        this.init()
    }


    // init
    async init(){
        this.images = await this.getImages()

        this.create()
        this.animate()

        window.addEventListener('resize', () => this.resize(), false)
    }


    // create
    create(){
        this.createCanvas()
        this.createRenderObject()
        this.createObject()
    }
    createCanvas(){
        const {width, height} = this.element.getBoundingClientRect()

        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height

        this.context = this.canvas.getContext('2d')
    }
    createRenderObject(){
        const {width, height} = this.element.getBoundingClientRect()

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(this.fov, width / height, this.near, this.far)
        this.camera.position.set(...this.cameraPosition)

        this.rtScene = new THREE.Scene()
        this.rtCamera = new THREE.PerspectiveCamera(this.fov, width / height, this.near, this.far)
        this.rtCamera.position.set(...this.cameraPosition)
        this.rtt = new THREE.WebGLRenderTarget(width, height, {format: THREE.RGBAFormat})

        this.size.el.w = width
        this.size.el.h = height
        this.size.obj.w = Method.getVisibleWidth(this.camera, 0)
        this.size.obj.h = Method.getVisibleHeight(this.camera, 0)
    }
    createObject(){
        for(const param of this.params){
            const {module} = param
            const group = new THREE.Group()

            this.comps.push(
                new module({
                    group,
                    size: this.size,
                    renderer: this.renderer,
                    camera: this.camera,
                    comps: this.comps,
                    rtScene: this.rtScene,
                    rtt: this.rtt,
                    canvas: this.canvas,
                    context: this.context,
                    images: this.images,
                    ...param
                })
            )
        }

        for(const {group} of this.comps) this.build.add(group)
        
        this.scene.add(this.build)
    }


    // get
    getTextures(){
        return new Promise((resolve, _) => {
            const manager = new THREE.LoadingManager()
            manager.onLoad = () => resolve(textures)
            
            const loader = new THREE.TextureLoader(manager)
            
            const textures = this.sources.map(file => loader.load(file))
        })
    }
    getImage(urls){
        return urls.map(url => new Promise((resolve, _) => {
            const img = new Image()
            img.src = url

            img.onload = () => resolve(img)
        }))
    }
    getImages(){
        return Promise.all(this.getImage(this.sources))
    }


    // animate
    animate(){
        this.render()
        this.animateObject()

        this.animation = requestAnimationFrame(() => this.animate())
    }
    render(){
        // const rect = this.element.getBoundingClientRect()
        // const width = rect.right - rect.left
        // const height = rect.bottom - rect.top
        // const left = rect.left
        // const bottom = this.renderer.domElement.clientHeight - rect.bottom

        // this.renderer.setScissor(left, bottom, width, height)
        // this.renderer.setViewport(left, bottom, width, height)

        this.camera.lookAt(this.scene.position)
        this.renderer.render(this.scene, this.camera)

        this.renderer.setRenderTarget(this.rtt)
        this.renderer.clear()
        this.renderer.render(this.rtScene, this.rtCamera)
        this.renderer.setRenderTarget(null)
    }
    animateObject(){
        for(const comp of this.comps){
            if(!comp.animate) continue
            comp.animate()
        }
    }


    // resize
    resize(){
        this.resizeRenderObject()
        this.resizeObject()
    }
    resizeRenderObject(){
        const rect = this.element.getBoundingClientRect()
        const width = rect.right - rect.left
        const height = rect.bottom - rect.top

        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        this.rtCamera.aspect = width / height
        this.rtCamera.updateProjectionMatrix()

        this.rtt.setSize(width, height)
        
        this.canvas.width = width
        this.canvas.height = height

        this.size.el.w = width
        this.size.el.h = height
        this.size.obj.w = Method.getVisibleWidth(this.camera, 0)
        this.size.obj.h = Method.getVisibleHeight(this.camera, 0)
    }
    resizeObject(){
        for(const comp of this.comps){
            if(!comp.resize) continue
            comp.resize(this.size)
        }
    }
}