import Method from '../../../method/method.js'

export default class{
    constructor({context, size, fontSize, color, minFontSize, maxFontSize}){
        this.context = context
        this.size = size
        this.fontSize = fontSize
        this.color = color
        this.minFontSize = minFontSize
        this.maxFontSize = maxFontSize

        this.chars = [
            ...this.asciiRange(33, 64), // ! - @
            ...this.asciiRange(65, 90), // A - Z
        ]

        const fs = Method.clamp(~~(this.fontSize * this.size.h), this.minFontSize, this.maxFontSize)

        this.x = Math.random() * this.size.w - fs
        this.y = Math.random() * this.size.h - fs

        this.startTime = window.performance.now()
        this.currentTime = window.performance.now()
        this.delay = 30
    }


    // 
    asciiRange(start, end){
        return Array.from({length: end - start}, (_, i) => String.fromCharCode(start + i))
    }

    
    // resize
    resize(size){
        this.size = size
    }


    // animate
    animate(){
        this.interval()
    }
    interval(){
        this.currentTime = window.performance.now()

        if(this.currentTime - this.startTime > this.delay){
            this.draw()
            this.startTime = window.performance.now()
        }
    }
    draw(){
        const {size, fontSize, chars, minFontSize, maxFontSize} = this
        const {w, h} = size

        const fs = Method.clamp(~~(fontSize * h), minFontSize, maxFontSize)

        const char = chars[~~(Math.random() * chars.length)]
        
        this.context.fillStyle = this.color
        this.context.fillText(char, this.x, this.y)

        this.y += fs
        
        if(this.y > h + fs) {
            this.x = ~~(Math.random() * (w - fs))
            this.y = 0
        }
    }
}