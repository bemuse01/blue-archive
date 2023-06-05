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

            <div :style="objectStyle">

                <canvas-box />

                <matrix-box />

            </div>

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
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        })


        // object
        const objectStyle = ref({
            position: 'absolute',
            width: '100%',
            height: '100%',
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
            appStyle,
            objectStyle
        }
    }
}