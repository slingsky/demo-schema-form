import { defineComponent, PropType } from 'vue'
import { Schema } from '../types'

export default defineComponent({
  name: 'StringField',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
  },
  setup() {
    return () => {
      return <div>this is stringField</div>
    }
  },
})
