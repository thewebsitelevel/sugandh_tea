const fs = require('fs');
const path = require('path');


module.exports = class AddReceipt {
    constructor(data, files){
        var filenames = files.map(function(file) {
            return file.filename; // or file.originalname
          });
        this.combine = {...data, ...[filenames]}
    }

    save(){
        const p = path.join(
            path.dirname(process.mainModule.filename), 
            'data' , 
            'receipt.json'
            );
        fs.readFile(p, (err , fileContent) =>{
            let receipt = [];
            if(!err){
                receipt = JSON.parse(fileContent);
            }
            receipt.push(this);
            fs.writeFile(p, JSON.stringify(receipt), (err) =>{
                console.log(err);
            })
        });

    }

    static fetchAll(cb){
        const p = path.join(path.dirname(process.mainModule.filename), 'data' , 'receipt.json');
        fs.readFile(p, (err, fileContent)=>{
            if(err){
               cb([]);
               console.log(fileContent);
            }
            cb(JSON.parse(fileContent));

        })
    }
}