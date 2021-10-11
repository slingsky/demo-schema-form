import { defineComponent, Ref, ref, reactive, watchEffect } from 'vue'

import MonacoEditor from './components/MonacoEditor'

import { createUseStyles } from 'vue-jss'

// 测试数据
import demos from './demos'

// 导入组件库
import SchemaForm from '../lib'

// TODO: 在lib中export
type Schema = any
type UISchema = any

function toJsonString(data: any) {
  return JSON.stringify(data, null, 2)
}

// css in js
const useStyles = createUseStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '1200px',
    margin: '0 auto',
  },
  menu: {
    marginBottom: 20,
  },
  code: {
    width: 700,
    flexShrink: 0,
  },
  codePanel: {
    minHeight: 400,
    marginBottom: 20,
  },
  uiAndValue: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {
      width: '46%',
    },
  },
  content: {
    display: 'flex',
  },
  form: {
    padding: '0 20px',
    flexGrow: 1,
  },
  menuButton: {
    appearance: 'none',
    borderWidth: 0,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'inline-block',
    padding: 15,
    borderRadius: 5,
    '&:hover': {
      background: '#efefef',
    },
  },
  menuSelected: {
    background: '#337ab7',
    color: '#fff',
    '&:hover': {
      background: '#337ab7',
    },
  },
})

interface DemoType {
  schema: Schema | null
  data: any
  uiSchema: UISchema | null
  schemaCode: string
  dataCode: string
  uiSchemaCode: string
  customValidate: ((d: any, e: any) => void) | undefined
}

export default defineComponent({
  setup() {
    // tab switch
    const selectedRef: Ref<number> = ref(0)

    // demo data
    const demo: DemoType = reactive({
      schema: null,
      data: {},
      uiSchema: {},
      schemaCode: '',
      dataCode: '',
      uiSchemaCode: '',
      customValidate: undefined,
    })

    watchEffect(() => {
      const index = selectedRef.value
      const d: any = demos[index]
      demo.schema = d.schema
      demo.data = d.default
      demo.uiSchema = d.uiSchema
      demo.schemaCode = toJsonString(d.schema)
      demo.uiSchemaCode = toJsonString(d.uiSchema)
      demo.dataCode = toJsonString(d.default)
      demo.customValidate = d.customValidate
    })

    function handleCodeChange(
      type: 'schema' | 'data' | 'uiSchema',
      code: string,
    ) {
      try {
        const json = JSON.parse(code)
        demo[type] = json
        ;(demo as any)[`${type}Code`] = code
      } catch (e) {
        console.error(e)
      }
    }

    const handleSchemaChange = (code: string) =>
      handleCodeChange('schema', code)
    const handleUISchemaChange = (code: string) =>
      handleCodeChange('uiSchema', code)
    const handleDataChange = (code: string) => handleCodeChange('data', code)

    const handleChange = (v: any) => {
      console.log(v, 3333)
      demo.data = v
      demo.dataCode = toJsonString(v)
    }

    const classesRef = useStyles()

    return () => {
      const classes = classesRef.value
      const selected = selectedRef.value

      return (
        <div class={classes.container}>
          <div class={classes.menu}>
            <h1>Form</h1>
            <div>
              {demos.map((demo, index) => (
                <button
                  class={{
                    [classes.menuButton]: true,
                    [classes.menuSelected]: index === selected,
                  }}
                  onClick={() => (selectedRef.value = index)}
                >
                  {demo.name}
                </button>
              ))}
            </div>
          </div>{' '}
          {/* /.menu */}
          <div class={classes.content}>
            <div class={classes.code}>
              <MonacoEditor
                code={demo.schemaCode}
                class={classes.codePanel}
                onChange={handleSchemaChange}
                title="Schema"
              />
              <div class={classes.uiAndValue}>
                <MonacoEditor
                  code={demo.uiSchemaCode}
                  class={classes.codePanel}
                  onChange={handleUISchemaChange}
                  title="UISchema"
                />
                <MonacoEditor
                  code={demo.dataCode}
                  class={classes.codePanel}
                  onChange={handleDataChange}
                  title="Value"
                />
              </div>
              {/* /.uiAndValue */}
            </div>
            {/* /.code */}
            <div class={classes.form}>
              <SchemaForm
                schema={demo.schema}
                value={demo.data}
                onChage={handleChange}
              />
            </div>
          </div>
        </div>
      )
    }
  },
})
