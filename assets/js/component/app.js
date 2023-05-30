import CanvasBox from './three/canvasBox.js'
import MatrixBox from './three/matrixBox.js'

export default {
    components: {
        'canvas-box': CanvasBox,
        'matrix-box': MatrixBox
    },
    template: `
        <div 
            id="app"
            :style="appStyle"
        >

            <canvas-box />

            <matrix-box />

        </div>
    `,
    setup(){
        const {ref, onMounted} = Vue


        // style
        const appStyle = ref({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
        })


        // method
        const animate = () => {
            TWEEN.update()

            requestAnimationFrame(animate)
        }


        // hook
        onMounted(() => {
            animate()
        })


        return{
            appStyle
        }
    }
}