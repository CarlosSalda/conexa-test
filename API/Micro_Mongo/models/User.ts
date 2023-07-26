const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
},{
    timestamps: true,
})

userSchema.plugin(mongoosePaginate);

module.exports = model('User', userSchema);