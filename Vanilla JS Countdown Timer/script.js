let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]'); //select anything that has data-time attribute

function timer(seconds) {
	/* setInterval(function() {
		seconds--;
	}, 1000); but this function won't work if being scrolled*/
	//clear any existing timers
	clearInterval(countdown);

	const now = Date.now(); // will get us current timestamp in milliseconds
	const then = now + seconds * 1000; // now plus the number of seconds that you wish to run the timer for. now is in milliseconds, but seconds is not, so we need to multiple by 1000 to be in milliseconds as well
	displayTimeLeft(seconds);
	displayEndTime(then);
	//console.log({now,then});

	//need to figure out how much time is left on the clock
 	 countdown = setInterval(() => {
    	const secondsLeft = Math.round((then - Date.now()) / 1000);
		//check if we should stop it
		if(secondsLeft < 0) {
			clearInterval(countdown); // when start a timer, clear existing timers, and it always needs a variable name of a setInterval() to stop it.
			return;
		}
		//display it
		//console.log(secondsLeft);
   	 	displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  	const minutes = Math.floor(seconds / 60);
  	const remainderSeconds = seconds % 60;
  	const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`; //if remainderSeconds is less than 10 then make into 0 otherwise, nothing
  	document.title = display; //document.title updates the title of the webpage (the <title> tag on HTML)
  	timerDisplay.textContent = display; 
	//console.log({minutes, remainderSeconds});
}

function displayEndTime(timestamp) {
	const end = new Date(timestamp); 
	const hour = end.getHours();
	const adjustedHour = hour > 12 ? hour - 12 : hour;
	const minutes = end.getMinutes();
	endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`; //adjust the time format as in 12-hours instead of 24-hours
}

function startTimer() {
	//console.log(this);
	const seconds = parseInt(this.dataset.time); //change the value of data-time attribute (dataset) of an element into a real number (say from "20" into 20) by parseInt()
	timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(e) {
	e.preventDefault();
	const mins = this.minutes.value;
	timer(mins * 60);
	this.reset(); //clear form input value

	/*[NOTICE] we can directly select as document.elementName if an element has a name attribute in the DOM of HTML (in this case is document.customForm, the customForm is a name attribute of <form> element)
	this.reset();: clear form input value (this is the form)*/
})




