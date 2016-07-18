$(document).ready(function () {

	// STOCK CODE INFO TO BE LOADED ON PAGELOAD AND/OR WHEN ERRORS OCCUR
	var initialCode = "MSFT"
	// STOCK CODE INFO TO BE LOADED ON PAGELOAD AND/OR WHEN ERRORS OCCUR


	// FUNCTION THAT RETRIEVES DATA FROM MARKIT'S API GIVEN A STOCK CODE
	function getData (code) {

		// CLEARS THE INPUT BOX
		$('#getQuoteInput').val("") 
		// CLEARS THE INPUT BOX

		// SETS THE VARIABLE FIELDS TO LOADING WHILE RETRIEVING INFO FROM API
		$('#name').html("loading...")
        $('#lastPrice').html("loading...")
        $('#changeAndChangePercent').html("loading...")
        $('#lowToHigh').html("loading...")
        $('#open').html("loading...")
        $('#volume').html("loading...")
        $('#marketCap').html("loading...")
        $('#timestamp').html("loading...")
        // SETS THE VARIABLE FIELDS TO LOADING WHILE RETRIEVING INFO FROM API


        // AJAX CALL TO API RETRIEVING INFO CORRESPONDING TO CODE INPUT AND RETURNING TO MSFT IF NOTHING IS FOUND OR AN ERROR OCCURS
		$.ajax({
		    dataType:'jsonp',
		    url:'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=' + code,
		    success:function(data) {
		    	if ( !data.Message ) {
			    	if ( Number(data.Change) < 0 && Number(data.ChangePercent) < 0 ) {
			          	$('#changeAndChangePercent').css('color', 'red')
			        } else if ( ( Number(data.Change) < 0 && Number(data.ChangePercent) >= 0 ) || ( data.Change >= 0 && data.ChangePercent < 0 ) ) {
			          	$('#changeAndChangePercent').css('color', 'yellow')
			        } else {
			        	$('#changeAndChangePercent').css('color', '#008400')
			        }
			        $('#name').html(data.Name)
			        $('#lastPrice').html(numberFormat(data.LastPrice))
			        $('#changeAndChangePercent').html(numberFormat(data.Change) +" (" + numberFormat(data.ChangePercent) + "%)")
			        $('#lowToHigh').html(numberFormat(data.Low) + " - " + numberFormat(data.High))
			        $('#open').html(numberFormat(data.Open))
			        $('#volume').html(numberFormat(data.Volume))
			        $('#marketCap').html(numberFormat(data.MarketCap))
			        $('#timestamp').html(dateFormat(new Date(data.Timestamp)))
			    } else {
			    	alert(data.Message)
			    	getData(initialCode)
			    }
		    },
		    error: function(error) {
		    	alert("An error occurred. Please try again later.")
		    	getData(initialCode)
		    }
		})
		// AJAX CALL TO API RETRIEVING INFO CORRESPONDING TO CODE INPUT AND RETURNING TO MSFT IF NOTHING IS FOUND OR AN ERROR OCCURS

	}
	// FUNCTION THAT RETRIEVES DATA FROM MARKIT'S API GIVEN A STOCK CODE


	// FUNCTION THAT PRESENTS NUMBERS IN THE MOST SUITABLE AND READABLE WAY TO THE INQUIRER
	function numberFormat (num) {

		// PRESENTS NUMBER AS IS TO 2 DECIMAL PLACES IF UNDER 1000
		if ( num < 1000 ) {
		    return num.toFixed(2).toString()
		}
		// PRESENTS NUMBER AS IS TO 2 DECIMAL PLACES IF UNDER 1000


		// PRESENTS NUMBER AS STRING WITH COMMAS EVERY 3 CIPHERS FROM RIGHT TO LEFT
	  	var numArr = num.toLocaleString().split(",")
	  	// PRESENTS NUMBER AS STRING WITH COMMAS EVERY 3 CIPHERS FROM RIGHT TO LEFT


	  	// REDUCES NUMBER AFTER THE DECIMAL POINT, E.G. 1.00 -> 1, 1.10 -> 1.1, 1.01 -> 1.01
		var numAbb = function () { 
		    if ( numArr[1].split("")[0].toString() !== "0" && numArr[1].split("")[1].toString() !== "0" ) {
		      	return numArr[0] + "." + numArr[1].split("")[0].toString() + numArr[1].split("")[1].toString() 
		    } else if ( numArr[1].split("")[0].toString() !== "0" && numArr[1].split("")[1].toString() === "0" ) {
		      	return numArr[0]+ "." + numArr[1].split("")[0].toString()
		    } else if ( numArr[1].split("")[0].toString() === "0" && numArr[1].split("")[1].toString() !== "0" ) {
		      	return numArr[0]+ "." + numArr[1].split("")[0].toString() + numArr[1].split("")[1].toString() 
		    }else {
		      	return numArr[0]
		    }
		}
		// REDUCES NUMBER AFTER THE DECIMAL POINT, E.G. 1.00 -> 1, 1.10 -> 1.1, 1.01 -> 1.01

		// FINDS WHAT LETTER TO APPEND THE NUMBER WITH: K FOR THOUSANDS, M FOR MILLIONS, B FOR BILLIONS, T FOR TRILLIONS, AND e NOTATION FOR ANYTHING OVER THAT
		if ( numArr.length === 2 ) {
		    return numAbb() + "K"
		} else if ( numArr.length === 3 ) {
		    return numAbb() + "M"
		} else if ( numArr.length === 4 ) {
		    return numAbb() + "B"
		} else if ( numArr.length === 5 ) {
		    return numAbb() + "T"
		} else {
		    return num.toExponential(2).toString()
		}
		// FINDS WHAT LETTER TO APPEND THE NUMBER WITH: K FOR THOUSANDS, M FOR MILLIONS, B FOR BILLIONS, T FOR TRILLIONS, AND e NOTATION FOR ANYTHING OVER THAT

	} 
	// FUNCTION THAT PRESENTS NUMBERS IN THE MOST SUITABLE AND READABLE WAY TO THE INQUIRER


	// FUNCTION THAT PRESENTS DATES AND TIMES IN THE MOST SUITABLE AND READABLE WAY TO THE INQUIRER
	function dateFormat (date) {

		// TO GET THE WHOLE MONTH NAME
	    var month = []
	    month[0] = "January"
	    month[1] = "February"
	    month[2] = "March"
	    month[3] = "April"
	    month[4] = "May"
	    month[5] = "June"
	    month[6] = "July"
	    month[7] = "August"
	    month[8] = "September"
	    month[9] = "October"
	    month[10] = "November"
	    month[11] = "December"
	    // TO GET THE WHOLE MONTH NAME


	    // TODAY'S DATE
		var today = new Date
		// TODAY'S DATE


		// ADDS A METHOD TO THE DATE OBJECT CONSTRUCTOR TO FIND YESTERDAY'S DATE
		Date.prototype.getYesterday = function () {
			var todayToYesterday = new Date(this.valueOf())
			todayToYesterday.setDate(todayToYesterday.getDate() - 1)
			return todayToYesterday;
		}
		// ADDS A METHOD TO THE DATE OBJECT CONSTRUCTOR TO FIND YESTERDAY'S DATE


		// FORMATS IN AM AND PM RATHER THAN 24 HOUR CLOCK
	    var time = function (dateInQuestion) {
	      	var minutes = ("0" + (dateInQuestion.getMinutes())).slice(-2)
	      	var seconds = ("0" + (dateInQuestion.getSeconds())).slice(-2)
	      	if ( Number(dateInQuestion.getHours()) < 13 ) {
	        	if ( Number(dateInQuestion.getHours()) === 0 ) {
	          		return "12:" + minutes + ":" + seconds + " AM"
	        	} else if ( Number(dateInQuestion.getHours()) === 12 ) {
	          		return "12:" + minutes + ":" + seconds + " PM"
	        	} else {
	          		return dateInQuestion.getHours() + ":" + minutes + ":" + seconds + " AM"
	        	}
	      	} else {
	        	return Number(dateInQuestion.getHours() % 12) + ":" + minutes + ":" + seconds + " PM"
	      	}
	    }
	    // FORMATS IN AM AND PM RATHER THAN 24 HOUR CLOCK


	    // FINDS WHETHER TO DISPLAY THE TIME AND DATE, THE TIME TODAY, OR THE TIME YESTERDAY DEPENDING ON THE DATE INPUT
		if ( date.getDate() === today.getYesterday().getDate() && date.getMonth() === today.getYesterday().getMonth() && date.getYear() === today.getYesterday().getYear() ) {
			return "As of yesterday at " + time(date)
		} else if (  date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getYear() === today.getYear()  ) {
			return "As of " + date.toString().split(" ")[4]
		} else {
			return "As of " + month[date.getMonth()] + " " + date.getDate() + " " + Number(1900 + Number(date.getYear())) + " at " + date.toString().split(" ")[4]
		}
		// FINDS WHETHER TO DISPLAY THE TIME AND DATE, THE TIME TODAY, OR THE TIME YESTERDAY DEPENDING ON THE DATE INPUT

	}
	// FUNCTION THAT PRESENTS DATES AND TIMES IN THE MOST SUITABLE AND READABLE WAY TO THE INQUIRER


	// UPON PRESSING ENTER AFTER ENTERING A CODE OR CLICKING THE GET NEW QUOTE BUTTON, THE INQUIRY FUNCTION IS RUN
	$("#getQuote").submit(function( event ) {
		if ( $('#getQuoteInput').val() !== "" ) {
			getData($('#getQuoteInput').val())
		}
		event.preventDefault()
	})
	// UPON PRESSING ENTER AFTER ENTERING A CODE OR CLICKING THE GET NEW QUOTE BUTTON, THE INQUIRY FUNCTION IS RUN


	// INITIAL PAGELOAD INFO RETRIEVAL FROM API
	getData(initialCode)
	// INITIAL PAGELOAD INFO RETRIEVAL FROM API
	
})