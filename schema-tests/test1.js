const Ajv = require("ajv")
const ajv = new Ajv()
// options can be passed, e.g. {allErrors: true}

const schema = {
  type: 'string',
  test: false
}

ajv.addFormat('test', (schema) => {
  return schema === 'haha'
})

ajv.addKeyword('test', {
  validate(schema, data) {
    console.log(schema, data)
    if(schema) return true
    return data === 'haha'
  }
})

const validate = ajv.compile(schema)

const valid = validate('haha3')
if (!valid) console.log(validate.errors)