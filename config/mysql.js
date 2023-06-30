const model = require('../models/index');

module.exports = {
    bootstrap: () => {
        model.connection.sync({
            alter:false,
            force:false
        }).then(() => {
            console.log('MYSQL CONNECTED :: SUCCESS');
        }).catch((error) => {
            console.error("Error connecting to database ::" + error);
        });
    },
};