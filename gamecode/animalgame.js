
// var webAudio= require("webAudio.js")

//Read in .csv from server
var xhr = new XMLHttpRequest(),
    method = "GET",
    url = "https://raw.githubusercontent.com/ashleychuikay/animalgame/master/gamecode/trials.csv";

xhr.open(method, url, true);

xhr.onreadystatechange = function () {
  if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

    trials = $.csv.toArrays(xhr.responseText);

    allTrials = new Array

		for(i=0; i<trials.length; i++){
			newArr = trials[i].slice();	

			for(j=1; j<=3; j++){
				subArr = newArr.slice();
				subArr.push(subArr[j]);
				items = subArr.slice(1,4);
				shuffle(items);
				subArr.splice(1,3,items[0],items[1],items[2]);
				allTrials.push(subArr);
			}
		};

		startExperiment(allTrials)
  }
};
xhr.send();


// ---------------- PARAMETERS ------------------

var numTrials = 36;

//amount of white space between trials
var normalpause = 1500;

//pause after picture chosen, to display red border around picture selected
var timeafterClick = 1000;


// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}


//array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

createDot = function(dotx, doty, i, tag) {
	var dots;
	if (tag === "smiley") {
		dots = ["smiley1", "smiley2", "smiley3", "smiley4", "smiley5"];
	} else {
		dots = [1, 2, 3, 4, 5];
	}

	var dot = document.createElement("img");
	dot.setAttribute("class", "dot");
	dot.id = "dot_" + dots[i];
	if (tag === "smiley") {
		dot.src = "dots/dot_" + "smiley" + ".jpg";
	} else {
		dot.src = "dots/dot_" + dots[i] + ".jpg";
	}

    var x = Math.floor(Math.random()*650);
    var y = Math.floor(Math.random()*540);

    var invalid = "true";

    //make sure dots do not overlap
    while (true) {
    	invalid = "true";
	   	for (j = 0; j < dotx.length ; j++) {
    		if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 250) {
    			var invalid = "false";
    			break; 
    		}
		}
		if (invalid === "true") {
 			dotx.push(x);
  		  	doty.push(y);
  		  	break;	
  	 	}
  	 	x = Math.floor(Math.random()*400);
   		y = Math.floor(Math.random()*400);
	}

    dot.setAttribute("style","position:absolute;left:"+x+"px;top:"+y+"px;");
   	training.appendChild(dot);
   	// $("#allDots").appendChild(dot);
}


//for dot game
var images = new Array();
var dots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", "x", "dot_smiley"];
for (i = 0; i<dots.length; i++) {
	images[i] = new Image();
	images[i].src = "dots/" + dots[i] + ".jpg";
}


var animals = ["bird", "cat", "cow", "dog", "donkey", "duck", "elephant", "fish", "horse", "leopard", "lobster", "peacock", "pig", "raccoon", "rhinoceros", "rooster", "squirrel", "swan"]
var wordList = [];
var allImages = [];
var trialSounds = [];

function chosenAnimal(element){
	return element == experiment.chosenpic
}

function startExperiment() {


	//CONTROL FLOW
	//shuffle trials to randomize order, check to make sure the same set of animals does not appear back to back
	
	shuffle(allTrials)

	function checkTrials() {
		shuffle(allTrials)
		for(i=0; i<allTrials.length-1; i++) {
			// var check1 = allTrials[i];
			// var check2 = allTrials[i+1];
			if(allTrials[i+1].includes(allTrials[i][0])) {
				var temp = allTrials[i+1];
				allTrials[i+1] = allTrials[i+2];
				allTrials[i+2] = temp;

				if(allTrials[i+2].includes(allTrials[i+1][0])) {
				checkTrials(allTrials);
				}
			}
			if(allTrials[allTrials.length-2].includes(allTrials[allTrials.length-1][0])) {
				checkTrials(allTrials);
			}
		}
	};

	checkTrials(allTrials);

	//construct wordList for correct answers

	for(i=0; i<allTrials.length; i++){
		var word = allTrials[i][4]
		wordList.push(word)
	};

	//order image names according to trial order


	for(i=0; i<allTrials.length; i++) {
		subImages = allTrials[i].slice();
		 for(j=1; j<=3; j++) {
		 	newImages = subImages.slice();
		 	allImages.push(newImages[j]);
		 }
	};

	//load all animal sounds and arrange in trial order
  	for (i=0; i < animals.length; i++) {
	    animalSound = new WebAudioAPISound("animalsounds/"+animals[i]);
	    trialSounds.push(animalSound)
	}

	// to start at beginning
	showSlide("instructions");

	//to jump around for de-bugging
	// experiment.preStudy();

}





// MAIN EXPERIMENT
var experiment = {

	subid: "",
		//inputed at beginning of experiment
	trialnum: 0,
		//trial number
	order: 1,
		//whether child received list 1 or list 2
	word: "",
		//word that child is queried on
	pic1: "",
		//the name of the picture on the left
	pic2: "",
		//the name of the picture in the middle
	pic3: "",
		//the name of the picture on the right
	side: "",
		//whether the child picked the left (L) or the right (R) picture
	chosenpic: "",
		//the name of the picture the child picked
	response: "",
		//whether the response was the correct response (Y) or the incorrect response (N)
	date: getCurrentDate(),
		//the date of the experiment
	timestamp: getCurrentTime(),
		//the time that the trial was completed at 
	reactiontime: 0,
		//time between start of trial and response 


	preStudy: function() {
		document.body.style.background = "white";
		$("#prestudy").hide();
		setTimeout(function () {
			experiment.next(0);
		}, normalpause);
	},

	parentStudy: function(){
		$('#prestudy').hide();
		setTimeout(function() {$("#parentstudy").fadeIn(500);}, 1500)
		var parentList = globalGame.correctList.split(',')
		$(".correctWord").html(parentList[globalGame.trialnum]);
	},

	//sets up and allows participants to play "the dot game"
	training: function(dotgame) {

		console.log('TRAINING STARTS')
		var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5", 
						"dot_smiley1", "dot_smiley2", "dot_smiley3", 
						"dot_smiley4", "dot_smiley5"];
		var xcounter = 0;
		var dotCount = 5;

		var dotx = [];
		var doty = [];

		if (dotgame === 0) {
			for (i = 0; i < dotCount; i++) {
				createDot(dotx, doty, i, "");
			}
		} else {
			for (i = 0; i < dotCount; i++) {
				createDot(dotx, doty, i, "smiley");
			}
		}
		showSlide("training");
		$('.dot').bind(' click', function(event) {
	    	var dotID = $(event.currentTarget).attr('id');

	    	//only count towards completion clicks on dots that have not yet been clicked
	    	if (allDots.indexOf(dotID) === -1) {
	    		return;
	    	}
	    	allDots.splice(allDots.indexOf(dotID), 1);
	    	document.getElementById(dotID).src = "dots/x.jpg";
	    	xcounter++
	    	if (xcounter === dotCount) {
   		
		    	if (dotgame != 0) {
	    			globalGame.trainingOver = true;
	    		}
	    		setTimeout(function () {
	    			$("#training").hide();
	    			if (dotgame === 0) {		
	    				//hide old x marks before game begins again
	    				var dotID;
	    				for (i = 1; i <= dotCount; i++) {
	    					dotID = "dot_" + i;
	    					training.removeChild(document.getElementById(dotID));
	    				}
						experiment.training();
						dotgame++; 
					} else {
							showSlide("child");
					}
				}, normalpause);
			}
	    });	   
	},

	checkInput: function() {
		// subject ID
  		if (document.getElementById("subjectID").value.length < 1) {
			$("#checkMessage").html('<font color="red">You must input a subject ID</font>');
			return;
		}
  		experiment.subid = document.getElementById("subjectID").value;

		showSlide("parent");
	},


	//the end of the experiment, where the background becomes completely black
    end: function () {
    	setTimeout(function () {
    		$("#stage").fadeOut();
    	}, normalpause);
    	showSlide("finish");
    },

    //concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function () {
		var dataforRound = experiment.subid; 
		dataforRound += "," + experiment.trialnum + "," + experiment.word;
		dataforRound += "," + experiment.pic1 + "," + experiment.pic2 + "," + experiment.pic3;
		dataforRound += "," + experiment.side + "," + experiment.chosenpic + "," + experiment.response + "," + experiment.trialtype;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.reactiontime + "\n";
		$.post("https://callab.uchicago.edu/experiments/animalgame/gamecode/animalgamesave.php", {postresult_string : dataforRound});	

	},


    // MAIN DISPLAY FUNCTION
  	next: function(counter) {

  		experiment.subid = globalGame.subid;

		var objects_html = "";


	// Create the object table (tr=table row; td= table data)
	    
	   	//HTML for the first object on the left
		leftname = "animalimages/" + allImages[0] + ".png";
		objects_html += '<table align = "center" cellpadding="25"><tr></tr><tr><td align="center"><img class="pic" src="' + leftname +  '"alt="' + leftname + '" id= "leftPic"/></td>';

		//HTML for the first object in the middle
		middlename = "animalimages/" + allImages[1] + ".png";
		objects_html += '<td align = "center"><img class = "pic" src="' + middlename + '"alt="' + middlename + '" id = "middlePic"/></td>';
	
		//HTML for the first object on the right
		rightname = "animalimages/" + allImages[2] + ".png";
   	objects_html += '<td align="center"><img class="pic" src="' + rightname +  '"alt="' + rightname + '" id= "rightPic"/></td>';
	
  	objects_html += '</tr></table>';
    $("#objects").html(objects_html); 

    $("#stage").fadeIn();
    

    var startTime = (new Date()).getTime();

		globalGame.clickDisabled = true;
		clickDisabled = true;
		setTimeout(function() {clickDisabled = false;},  2000);
		



		$('.pic').on('click touchend', function(event) {

	    	if (clickDisabled) return;

	    	globalGame.clickDisabled = false;
	    	
	    	//disable subsequent clicks once the participant has made their choice
			clickDisabled = true; 

	    	//time the participant clicked - the time the trial began
	    	experiment.reactiontime = (new Date()).getTime() - startTime;

	    	experiment.trialnum = counter;
	    	experiment.word = wordList[0]
	    	experiment.pic1 = allImages[0];
	    	experiment.pic2 = allImages[1];
	    	experiment.pic3 = allImages[2];

	    	//Was the picture clicked on the right or the left?
	    	var picID = $(event.currentTarget).attr('id');

	    	switch(picID) {
	    		case "leftPic":
	    			experiment.side = "L";
	    			experiment.chosenpic = allImages[0];
	    			winningSound= trialSounds[animals.findIndex(chosenAnimal)]
	    			break;
	    		case "middlePic":
	    			experiment.side = "M";
	    			experiment.chosenpic = allImages[1];
	    			winningSound= trialSounds[animals.findIndex(chosenAnimal)]

	    			break;
	    		default: // "rightPic"
	    			experiment.side = "R"
	    			experiment.chosenpic = allImages[2];
	    			winningSound= trialSounds[animals.findIndex(chosenAnimal)]
	    	}

	    	//Play animal sound according to chosen picture
		    setTimeout(function() {winningSound.play();}, 100)

		    console.log(experiment.chosenpic)
		    console.log(animals.findIndex(chosenAnimal))
			
			//If the child picked the picture that matched with the word, then they were correct. If they did not, they were not correct.
			if (experiment.chosenpic === experiment.word) {
				experiment.response = "Y";
			} else {
				experiment.response = "N"
			}

			//what kind of trial was this?
			experiment.trialtype = allTrials[experiment.trialnum][0];


			//Add one to the counter and process the data to be saved; the child completed another "round" of the 
			experiment.processOneRow();



	    // $(document.getElementById(picID)).css('margin', "-8px");
			$(document.getElementById(picID)).animate({'margin-top': '-60px'}, 'fast');

			//remove the pictures from the image array that have been used, and the word from the wordList that has been used
			allImages.splice(0, 3);
			wordList.splice(0, 1);


			//hide animals and show only background for 2 seconds
			setTimeout(function() {
				$(".pic").delay().fadeOut(2000);
				counter++; 
				if (counter === numTrials) {
					setTimeout(function() {experiment.end()}, 1000)
					return;
				} else {
					setTimeout(function() {
						experiment.next(counter)
					}, 4000);
				}
			});
		});
	},
}


