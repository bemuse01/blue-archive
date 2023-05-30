import App from '../../class/app/app.js'

export default {
    template: `
        <div 
            id="canvas-box"
            :style="boxStyle"
            :ref="el => box = el" 
        >
            <canvas 
                :ref="el => canvas = el" 
                :style="canvasStyle"
            />
        </div>
    `,
    setup(){
        const {ref, onMounted} = Vue
        const {useStore} = Vuex


        // store
        const store = useStore()

        
        // box
        const box = ref(null)
        const boxStyle = ref({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
        })


        // canvas
        const canvas = ref(null)
        const canvasStyle = ref({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
        })


        // app
        const createApp = () => {
            store.dispatch('app/setApp', new App(canvas.value, box.value))
        }


        // hook
        onMounted(() => {
            createApp()
        })


        return{
            box,
            canvas,
            boxStyle,
            canvasStyle
        }
    }
}