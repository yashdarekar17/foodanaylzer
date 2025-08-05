const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const Userschema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    Password:{
        type: String,
        required:true,
        unique:true,
    },
    Foods:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:'Food'
    }]
})

Userschema.pre('save',async function(next){
    try{
    if(!this.isModified('Password'))next();
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password,salt);
    next(); 
    }catch(err){
        next(err);
        console.log(err);
    }
   
})
Userschema.methods.comparePassword = async function (password){
    try{
         if(!this.Password){
        return console.log('Password not found')
        }
    return await bcrypt.compare(password,this.Password)
    }catch(err){
      console.log(err);
    }   
}
module.exports = mongoose.model('User',Userschema);