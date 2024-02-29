const elementTimer = document.querySelector('.pomodoro__timer')
const elementPlay = document.querySelector('#play')
const elementReset = document.querySelector('#reset')

const restTimeSound = new Audio('./assets/alarm.mp3')
const focusTimeSound = new Audio('./assets/assobio.mp3')

// Time in millisecond
const FOCUS_TIME = 25 * 60 * 1000
const REST_TIME = 5 * 60 * 1000
const LONG_REST_TIME = 15 * 60 * 1000

updateTimer(FOCUS_TIME)

const timer = {
	totalTimeCounterByType: FOCUS_TIME,
	timeLeft: 0,
	type: 'focus',
	isRunning: false
}

let focusTimeCount = 0

const timerHandler = {
	set (obj, prop, value) {
		if (prop === 'timeLeft' && value <= 0) {
			stopTimer()
			console.log('Tempo terminou')
			console.log(timer)

			focusTimeCount++

			const isLongRest = focusTimeCount % 5 === 0

			if (obj.type === 'focus') {
				// Check which rest type should be seted
				if (isLongRest) {
					obj.type = 'longRest'
					obj.totalTimeCounterByType = LONG_REST_TIME
				} else {
					obj.type = 'rest'
					obj.totalTimeCounterByType = REST_TIME
				}

				restTimeSound.play()
			} else {
				// If it does't focus time then set focus time
				obj.type = 'focus'
				obj.totalTimeCounterByType = FOCUS_TIME
				focusTimeSound.play()
			}

			obj.isRunning = false
			playTimer()

			return true
		}

		obj[prop] = value

		return true
	}
}

const timerProxy = new Proxy(timer, timerHandler)

let intervalID = null

elementPlay.addEventListener('click', () => {
	playTimer()
})

elementReset.addEventListener('click', resetTimer)

function playTimer() {
	if (timerProxy.isRunning) return

	timerProxy.isRunning = true

	// Remove 1 second to first DOM update before interval
	timerProxy.timeLeft = timerProxy.totalTimeCounterByType - 1000
	updateTimer(timerProxy.timeLeft)

	const playedTimer = new Date().getTime()

	// Get interval ID to stop when stop button will be clicked
	intervalID = setInterval(() => {
		const now = new Date().getTime()
		const runningTime = now - playedTimer

		timerProxy.timeLeft = timerProxy.totalTimeCounterByType - runningTime

		updateTimer(timerProxy.timeLeft)
	}, 1000)
}

function stopTimer () {
	
}

function resetTimer () {
	clearInterval(intervalID)

	timer.timeLeft = 0
	timer.totalTimeCounterByType = FOCUS_TIME
	timer.type = 'focus'
	timerProxy.isRunning = false
	
	focusTimeCount = 0

	updateTimer(FOCUS_TIME)
}

function updateTimer (millisecond) {
	const totalSeconds = millisecond / 1000

	const minute = String(Math.floor(totalSeconds / 60))
	const second = String(Math.floor(totalSeconds % 60))

	elementTimer.textContent = `${minute.padStart(2, '0')}:${second.padStart(2, '0')}`
}