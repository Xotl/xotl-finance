// Imports
const fs     = require('fs'),
      xml2js = require('xml2js')


// Functions
const 
    parser = new xml2js.Parser(),
    parseXmlFromFile = (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, function(err, data) {
                if (err) {
                    return reject(err)
                }

                parser.parseString(data, function (err, result) {
                    if (err) {
                        return reject(err)
                    }

                    resolve(result)
                })
            })
        })
    },
    parseConceptos = res => {
        let info = res['cfdi:Comprobante']['cfdi:Addenda'][0]['DG:DatosGenerales'][0]['$']
        let conceptos = res['cfdi:Comprobante']['cfdi:Addenda'][0]['DG:DatosGenerales'][0]['DG:Movimientos'][0]['DG:MovimientosDelCliente']

        conceptos = conceptos.map( val => {
            return val['$']
        })

        conceptos = Object.assign({}, info, { movimientos: conceptos })
        return conceptos
    },
    getAllFileNames = folderPath => {
        return new Promise((resolve, reject) => {
            fs.readdir(folderPath, (err, files) => {
                if (err) {
                    return reject(err)
                }

                resolve(files)
            })
        })
    },
    parseAllBankStatementsFromFolder = folderPath => {
        return getAllFileNames(folderPath)
               .then( files => files.map( file => parseXmlFromFile(`${folderPath}/${file}`).then(parseConceptos) ) )
               .then(arr => Promise.all(arr))
    }






module.exports = {
    parseAllBankStatementsFromFolder
}
