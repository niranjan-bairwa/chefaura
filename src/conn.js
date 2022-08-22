const mongoose = require('mongoose')
const url='mongodb+srv://admin:Luv2laf!!@cluster0.73s1h.mongodb.net/db_recipie?retryWrites=true&w=majority'
let con=mongoose.connect(url ,{useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
autoIndex:true})
const conn = mongoose.connection;

module.exports={url,conn};
