import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Attach submit handler
const form = document.querySelector("#promise-form");

if (form) {
    form.addEventListener("submit", onSubmit);
}

function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const delayValue = Number(formData.get("delay"));
    const state = formData.get("state");

    // Basic validation
    if (!Number.isFinite(delayValue) || delayValue < 0) {
        iziToast.error({
            title: "Invalid delay",
            message: "Please enter a non-negative number of milliseconds.",
            position: "topRight",
        });
        return;
    }
    if (!state) {
        iziToast.error({
            title: "Missing state",
            message: "Please choose Fulfilled or Rejected.",
            position: "topRight",
        });
        return;
    }

    createPromise(delayValue, state === "fulfilled")
        .then((delay) => {
            iziToast.success({
                title: "Success",
                message: `✅ Fulfilled promise in ${delay}ms`,
                position: "topRight",
            });
        })
        .catch((delay) => {
            iziToast.error({
                title: "Error",
                message: `❌ Rejected promise in ${delay}ms`,
                position: "topRight",
            });
        });

    // Optionally reset radios or keep user choice
    // form.reset();
}

function createPromise(delay, shouldResolve) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldResolve) {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}
