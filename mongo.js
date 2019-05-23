const mongoose = require('mongoose')

var person = new mongoose.Schema({ name: 'string', number: 'string' });


var password = process.argv[2];

var url = `mongodb+srv://ruja:${password}@cluster0-e5m3f.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSch = new mongoose.Schema({

  name: String,
  number: String

})

const Person = mongoose.model('Person', personSch)

if (process.argv.length == 3) {

var query = Person.find().then(persons => {

persons.forEach(function(person){

console.log(person.name + " " + person.number)

});

mongoose.connection.close();

process.exit(1)

})

} else if (process.argv.length === 5){

const name = process.argv[3]

const number = process.argv[4]

const person = new Person({

name: name,

number: number

})

person.save().then(response => {

console.log(`lisätään ${name} numero ${number} luetteloon`)

mongoose.connection.close();

})

}