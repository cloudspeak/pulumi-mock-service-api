const { readFileSync, writeFileSync, existsSync } = require('fs')

const express = require('express')
const app = express()
app.use(express.json());
const port = (process.argv[2] && parseInt(process.argv[2])) || 3000

const filename = "data.json"

const inputFields = [
    { key: "name", type: "string" },
    { key: "size", type: "number" },
    { key: "readOnly", type: "boolean" }
]

let tables = []

/**
 * Create a table resource.  The JSON body should be:
 * 
 * {
 *      name: string
 *      size: number
 *      readOnly: boolean
 * }
 * 
 * The response will be the created resource, including a string ID field.
 * 
 */
app.post('/table', (req, res) => {
    const table = req.body;
    console.log("POST /table ", table)

    // Validate inputs
    for (let field of inputFields) {
        if (!table.hasOwnProperty(field.key)) {
            error(res, 400, `Missing attribute: ${field.key}`)
            return
        }

        const fieldType = typeof(table[field.key])

        if (fieldType !== field.type) {
            error(res, 400, `Field ${field.key} should be type ${field.type}, received type ${fieldType}`)
            return
        }
    }

    table.id = "" + Math.floor(Math.random() * 1000000)
    table.createdAt = new Date().toISOString()
    table.modifiedAt = table.createdAt
    tables.push(table)
    writeToDisk()
    console.log("Added table:", table)
    res.send(table)
})

/**
 * List all table resources.  The result will be an array of the following objects:
 * 
 * {
 *      id: string
 *      name: string
 *      size: number
 *      readOnly: boolean
 * }
 * 
 */
app.get('/table', (req, res) => {
    console.log("GET /table ")
    res.send(tables)
})

/**
 * Return the table with the given id.  The result will be an object of type:
 * 
 * {
 *      id: string
 *      name: string
 *      size: number
 *      readOnly: boolean
 * }
 * 
 */
app.get('/table/:id', (req, res) => {
    console.log("GET /table/" + req.params.id)
    const table = tables.find(d => d.id === req.params.id)

    if (!table) {
        error(res, 404, "Not found")
    }
    else {
        console.log("Returning table", req.params.id)
        res.send(table)
    }
})

/**
 * Patch (update) the given fields for the table with the given id.  The input should
 * be a JSON object in the form:
 * 
 * {
 *      name?: string
 *      size?: number
 *      readOnly?: boolean
 * }
 * 
 * where only the fields given will be patched onto the table resource.
 * 
 */
app.patch('/table/:id', (req, res) => {
    const update = req.body;
    console.log("PATCH /table/" + req.params.id, update)
    const table = tables.find(d => d.id === req.params.id)

    if (!table) {
        error(res, 404, "Not found")
        return
    }

    inputFields.forEach(field => {

        if (!update.hasOwnProperty(field.key)) {
            return
        }

        const fieldType = typeof(update[field.key])

        if (fieldType !== field.type) {
            error(res, 400, `Field ${field.key} should be type ${field.type}, received type ${fieldType}`)
            return
        }

        table[field.key] = update[field.key]
    })
    table.modifiedAt = new Date().toISOString()
    
    writeToDisk()
    console.log("Patched table", req.params.id)
    res.send(table)
})

/**
 * Delete a table resource.
 */
 app.delete('/table/:id', (req, res) => {
    console.log("DELETE /table/" + req.params.id)
    const table = tables.find(d => d.id === req.params.id)

    if (!table) {
        error(res, 404, "Not found")
    }
    else {
        console.log("Deleting table", req.params.id)
        tables = tables.filter(t => t.id !== req.params.id)
        writeToDisk()
        res.send(table)
    }
})

const readFromDisk = () => {
    if (existsSync(filename)) {
        tables = JSON.parse(readFileSync(filename))
    }
}

const writeToDisk = () => {
    writeFileSync("data.json", JSON.stringify(tables))
}

const error = (res, status, message) => {
    res.statusCode = status
    console.error("Error: " + message)
    res.send(JSON.stringify({
        message
    }))

}

readFromDisk()

app.listen(port, () => {
  console.log(`Mock service API listening at http://localhost:${port}`)
})