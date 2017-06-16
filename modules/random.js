

exports.randomizer = () =>{
	// have two empty arrays for inser data and two string containers for modification of data. 
		var idN = [];
		var idFirst = "";
		var id = "";
		var StringA = [];
		var alphabetL = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		var alphabetU = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		// first it create 10 random numbers and insert them into idN
		for(var i = 10; i>0; i--){
			idN.push(Math.floor(Math.random() * 99) + 10);
		}

		
	 	// After that it loop 10 times.
		for(var i = 0; i< 10; i++){
			StringA.push(alphabetL[Math.floor(Math.random() * 25) + 0]);// it randomise a number and from the number it ges an letter from the lover case alphabets arrayn. And then we insert them into StringA arrayn.
			StringA.push(idN[Math.floor(Math.random() * 9) +0]); // it takes an random number from the numbers it created and insert it to StringA arrayn.
			StringA.push(alphabetU[Math.floor(Math.random() * 25) + 0]); // it randomise a number and from the number it ges an letter from the Upper case alphabets arrayn. And then we insert them into StringA arrayn.
		}

	 	// every value in the array converts to string element
	 	idFirst = StringA.toString();

	 
	 	// loop all the element in idFirst arrayn and inserts everything but "," in id and then return id.
		for(var i = 0; i < idFirst.length; i++){
			if(idFirst.charAt([i]) !== ","){
				if(id.length < 1){
					id = idFirst.charAt([i]);
				}
				else{
					id = id.concat(idFirst.charAt([i]));
				}
			}		
	}


	return id;
}