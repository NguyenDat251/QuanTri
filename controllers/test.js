const bcrypt = require('bcrypt')
let saltRounds = 10
let myString = '251'
bcrypt.hash(myString, saltRounds, (err, hash)=>{
	if(!err){
		console.log(hash)
	}else{
		console.log('Error', err)
	}
})