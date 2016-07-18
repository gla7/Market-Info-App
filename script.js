$(document).ready(function () {

	var initialCode = "MSFT"

	function getData (code) {

		document.getElementById("getQuoteInput").value = ""

		$('#name').html("loading...")
        $('#lastPrice').html("loading...")
        $('#changeAndChangePercent').html("loading...")
        $('#lowToHigh').html("loading...")
        $('#open').html("loading...")
        $('#volume').html("loading...")
        $('#marketCap').html("loading...")
        $('#timestamp').html("loading...")

		$.ajax({
		    dataType:'jsonp',
		    url:'http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=' + code,
		    success:function(data) {
		    	console.log("GOT SOMETHING:",data)
		    	if ( !data.Message ) {
			    	if ( Number(data.Change) < 0 && Number(data.ChangePercent) < 0 ) {
			          	document.getElementById("changeAndChangePercent").style.color = "red"
			        } else if ( ( Number(data.Change) < 0 && Number(data.ChangePercent) >= 0 ) || ( data.Change >= 0 && data.ChangePercent < 0 ) ) {
			          	document.getElementById("changeAndChangePercent").style.color = "yellow"
			        } else {
			        	document.getElementById("changeAndChangePercent").style.color = "#008400"
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
		    }
		})

	}

	function numberFormat (num) {

		if ( num < 1000 ) {
		    return num.toFixed(2).toString()
		}

	  	var numArr = num.toLocaleString().split(",")

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

	} 

	function dateFormat (date) {

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

		var today = new Date

		Date.prototype.getYesterday = function () {
			var todayToYesterday = new Date(this.valueOf())
			todayToYesterday.setDate(todayToYesterday.getDate() - 1)
			return todayToYesterday;
		}

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

		if ( date.getDate() === today.getYesterday().getDate() && date.getMonth() === today.getYesterday().getMonth() && date.getYear() === today.getYesterday().getYear() ) {
			return "As of yesterday at " + time(date)
		} else if (  date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getYear() === today.getYear()  ) {
			return "As of " + date.toString().split(" ")[4]
		} else {
			return "As of " + month[date.getMonth()] + " " + date.getDate() + " " + Number(1900 + Number(date.getYear())) + " at " + date.toString().split(" ")[4]
		}

	}

	document.getElementById("getQuoteButton").addEventListener("click", function () {
		if ( document.getElementById("getQuoteInput").value !== "" ) {
			getData(document.getElementById("getQuoteInput").value)
		}
	})

	getData(initialCode)
	
})