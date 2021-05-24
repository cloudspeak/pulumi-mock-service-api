# Cloudspeak mock service API

This project contains a mock service API and an empty Pulumi project used in Cloudspeak's [Pulumi Dynamic Provider video](https://youtu.be/H4nehfvCLm8).  The mock service API maintains a set of "table" records, like a simple cloud database service.

To run the service:

```
cd service-api
npm install
node ./index.js [port]
```

# REST API

## Common Types

### `Table`

```
{
    id: string
    createdAt: string
    modifiedAt: string
    name: string
    readOnly: boolean
    size: number
 }
 ```

## Endpoints

### `GET /table`

Lists the tables.  The response will be a JSON array of `Table` objects.

### `POST /table`

Create a table.  The body should be a JSON object with the structure:
 
 ```
 {
    name: string
    size: number
    readOnly: boolean
 }
 ```

 The response will be a JSON-encoded `Table` object.

### `GET /table/{id}`

Returns the table with the given ID.   The response will be a JSON-encoded `Table` object.

### `PATCH /table/{id}`

Patch (update) the given fields of the table with the given ID.  The body should be a JSON object with the given structure:
 
 ```
 {
    name?: string
    size?: number
    readOnly?: boolean
 }
 ```

 where only the given fields will update the table record.

 The response will be a JSON-encoded `Table` object.

### `DELETE /table/{id}`

Delete the table with the given ID.  The response will be a JSON-encoded `Table` object.