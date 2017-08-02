
//Read in .csv from server
var xhr = new XMLHttpRequest(),
    method = "GET",
    url = "https://raw.githubusercontent.com/ashleychuikay/animalgame/master/trials.csv";

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

		console.log(allTrials)

		startExperiment(allTrials)
  }
};
xhr.send();


// ---------------- PARAMETERS ------------------

var numTrials = 28;

//amount of white space between trials
var normalpause = 1500;

//pause after picture chosen, to display red border around picture selected
var timeafterClick = 1000;

//length of filler (every time fill2 comes up, add 1sec of time)
var fillerpause = 5000;


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

var wordList = []
var allImages = [];

function startExperiment() {


	//CONTROL FLOW
	//shuffle trials to randomize order, and construct correct answers in wordList
	
	shuffle(allTrials)

	function checkTrials() {
		shuffle(allTrials)
		for(i=0; i<allTrials.length-1; i++) {
			allTrials[i] = check1;
			console.log(check1)
			allTrials[i+1] = check2;
			console.log(check2)
			if(check2.contains(check1[0])) {
				checktrials();
			}
		}
	};



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


	// connect image names to source
	// for critical trials
	var images = new Array();
	for (i = 0; i<allImages.length; i++) {
		images[i] = new Image();
		images[i].src = "animalimages/" + allImages[i] + ".jpg";
	};


	showSlide("instructions");

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
		document.body.style.background = "black";
		$("#prestudy").hide();
		setTimeout(function () {
			experiment.next();
		}, normalpause);
	},

	checkInput: function() {
		//subject ID
  		//if (document.getElementById("subjectID").value.length < 1) {
			//$("#checkMessage").html('<font color="red">You must input a subject ID</font>');
			//return;
		//}
  	experiment.subid = document.getElementById("subjectID").value;


		showSlide("stage");
		experiment.next();
	},


	//the end of the experiment, where the background becomes completely black
    end: function () {
    	setTimeout(function () {
    		$("#stage").fadeOut();
    	}, normalpause);
    	showSlide("finish");
    	document.body.style.background = "black";
    },

    //concatenates all experimental variables into a string which represents one "row" of data in the eventual csv, to live in the server
	processOneRow: function () {
		var dataforRound = experiment.subid; 
		dataforRound += "," + experiment.trialnum + "," + experiment.word;
		dataforRound += "," + experiment.pic1 + "," + experiment.pic2 + "," + experiment.pic3;
		// experiment.pic1type + "," + experiment.pic2type;
		dataforRound += "," + experiment.side + "," + experiment.chosenpic + "," + experiment.response + "," + experiment.trialtype;
		dataforRound += "," + experiment.date + "," + experiment.timestamp + "," + experiment.reactiontime + "\n";
		$.post("http://", {postresult_string : dataforRound});	

		console.log(dataforRound);
		//TODO: add lab server
	},


    // MAIN DISPLAY FUNCTION
  	next: function() {

  		//returns the list of all images to use in the study - list dependent
		//var imageArray = makeImageArray(experiment.order);

		var objects_html = "";
		var counter = 0;



	// Create the object table (tr=table row; td= table data)
		//objects_html = '<table class = "centered" ><tr><td id=word colspan="2">' + wordList[0] + '</td></tr><tr>';;
	    
	   	//HTML for the first object on the left
		leftname = "animalimages/" + allImages[0] + ".jpg";
		objects_html += '<table align = "center" cellpadding="30"><tr></tr><tr><td align="center"><img class="pic" src="' + leftname +  '"alt="' + leftname + '" id= "leftPic"/></td>';

		//HTML for the first object in the middle
		middlename = "animalimages/" + allImages[1] + ".jpg";
		objects_html += '<td align = "center"><img class = "pic" src="' + middlename + '"alt="' + middlename + '" id = "middlePic"/></td>';
	
		//HTML for the first object on the right
		rightname = "animalimages/" + allImages[2] + ".jpg";
   	objects_html += '<td align="center"><img class="pic" src="' + rightname +  '"alt="' + rightname + '" id= "rightPic"/></td>';
	
  	objects_html += '</tr></table>';
    $("#objects").html(objects_html); 

    $("#stage").fadeIn();

    var startTime = (new Date()).getTime();

		var clickDisabled = true;
		setTimeout(function() {clickDisabled = false;},  2000);


		$('.pic').bind('click touchstart', function(event) {

	    	if (clickDisabled) return;
	    	
	    	//disable subsequent clicks once the participant has made their choice
			clickDisabled = true; 

	    	//time the participant clicked - the time the trial began
	    	experiment.reactiontime = (new Date()).getTime() - startTime;

	    	experiment.trialnum = counter;
	    	experiment.word = wordList[experiment.trialnum]
	    	experiment.pic1 = allImages[0];
	    	experiment.pic2 = allImages[1];
	    	experiment.pic3 = allImages[2];

	    	//get whether the left and right pictures were familiar or novel
	    	
	    	//Was the picture clicked on the right or the left?
	    	var picID = $(event.currentTarget).attr('id');

	    	switch(picID) {
	    		case "leftPic":
	    			experiment.side = "L";
	    			experiment.chosenpic = allImages[0];
	    			break;
	    		case "middlePic":
	    			experiment.side = "M";
	    			experiment.chosenpic = allImages[1];
	    			break;
	    		default: // "rightPic"
	    			experiment.side = "R"
	    			experiment.chosenpic = allImages[2];
	    	}

	    	
			
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
	    	counter++;



	    $(document.getElementById(picID)).css('margin', "-8px");
			$(document.getElementById(picID)).css('border', "solid 8px red");
			$(document.getElementById(picID)).animate({'margin-top': '-80px'}, 'slow');

			//remove the pictures from the image array that have been used, and the word from the wordList that has been used
			allImages.splice(0, 3);
			wordList.splice(0, 1);

			setTimeout(experiment.next, 1000)
		});
	},
}


