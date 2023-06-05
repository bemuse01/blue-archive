import Matrix from '../../class/matrix/matrix.js'

export default {
    template: `
        <div 
            id="matrix-box"
            :style="boxStyle"
            :ref="el => box = el" 
        >
        </div>
    `,
    setup(){
        const {ref, onMounted, computed} = Vue
        const {useStore} = Vuex


        // store
        const store = useStore()


        // app
        const app = computed(() => store.getters['app/getApp'])

        
        // box
        const box = ref(null)
        const boxStyle = ref({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
        })


        // matrix
        let matrix = null
        const createObject = () => {
            matrix = new Matrix({app: app.value, element: box.value})
        }


        // hook
        onMounted(() => {
            createObject()
        })


        return{
            box,
            boxStyle,
        }
    }
}