const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator');

mongoose.set('useFindAndModify', false);

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
    console.log('MongoDB yhdistetty')
  })
  .catch((error) => {
    console.log('ongelma yhdistyessä MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {type: String, minlength: 3, required: true},
    number: {type: String, minlength: 8, required: true},
  })

  personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
transform: (document, palautettuObject) => { 
palautettuObject.id = palautettuObject._id
    delete palautettuObject._id
    delete palautettuObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)