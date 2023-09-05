const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })
    
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3, // Minimum name length of 3 characters
    },
    number: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Check if the number matches the specified formats
                return /^\d{2}-\d{7} $| ^\d{3}-\d{8}$/.test(value);
            },
            message: 'Invalid number format. Valid formats are dd-ddddddd or ddd-dddddddd',
        }
    },
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)