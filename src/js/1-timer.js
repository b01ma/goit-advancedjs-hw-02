// Imports
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Get DOM elements
const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const timerDisplay = {
    days: document.querySelector("[data-days]"),
    hours: document.querySelector("[data-hours]"),
    minutes: document.querySelector("[data-minutes]"),
    seconds: document.querySelector("[data-seconds]"),
};

// Global variables
let userSelectedDate = null;
let timerInterval = null;

// Utility functions
function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function updateTimerDisplay(time) {
    timerDisplay.days.textContent = addLeadingZero(time.days);
    timerDisplay.hours.textContent = addLeadingZero(time.hours);
    timerDisplay.minutes.textContent = addLeadingZero(time.minutes);
    timerDisplay.seconds.textContent = addLeadingZero(time.seconds);
}

function startCountdown() {
    // Disable controls
    startButton.disabled = true;
    datetimePicker.disabled = true;

    timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = userSelectedDate - now;

        if (timeLeft <= 0) {
            // Timer finished
            clearInterval(timerInterval);
            updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });

            // Re-enable input for selecting new date
            datetimePicker.disabled = false;
            // Keep start button disabled until new valid date is selected

            iziToast.success({
                title: "Timer finished!",
                message: "Countdown has reached zero.",
                position: "topRight",
            });

            return;
        }

        const time = convertMs(timeLeft);
        updateTimerDisplay(time);
    }, 1000);
}

// Flatpickr options
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate && selectedDate <= new Date()) {
            // Selected date is in the past
            iziToast.error({
                title: "Invalid date",
                message: "Please choose a date in the future",
                position: "topRight",
            });
            startButton.disabled = true;
            userSelectedDate = null;
        } else if (selectedDate) {
            // Valid date selected
            userSelectedDate = selectedDate.getTime();
            startButton.disabled = false;
        }
    },
};

// Initialize flatpickr with debug
flatpickr(datetimePicker, options);

// Initially disable start button
startButton.disabled = true;

// Start button event listener
startButton.addEventListener("click", startCountdown);
