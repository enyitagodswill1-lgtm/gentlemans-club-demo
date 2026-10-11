// THE GENTLEMAN'S CLUB — website interactions

// Add your real WhatsApp number when you are ready.
// Nigerian example: 2348012345678
const CONFIG = {
    whatsappNumber: "2348000000000",
    demoMode: true
};

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");
    const bookingForm = document.getElementById("bookingForm");
    const serviceSelect = document.getElementById("serviceSelect");
    const bookingDate = document.getElementById("bookingDate");
    const toast = document.getElementById("toast");

    // Display current year in footer.
    document.getElementById("year").textContent = new Date().getFullYear();

    // Prevent booking dates in the past.
    const now = new Date();
    const localDate = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 10);

    bookingDate.min = localDate;

    // Mobile navigation.
    menuToggle.addEventListener("click", function () {
        const opened = nav.classList.toggle("open");

        menuToggle.textContent = opened ? "×" : "☰";
        menuToggle.setAttribute("aria-expanded", String(opened));
    });

    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            nav.classList.remove("open");
            menuToggle.textContent = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    // Display a small message.
    let toastTimer;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 5000);
    }

    // Service buttons select the relevant booking option.
    document.querySelectorAll("[data-service]").forEach(function (button) {
        button.addEventListener("click", function () {
            serviceSelect.value = button.dataset.service;

            document.getElementById("booking").scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // Booking form.
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!bookingForm.reportValidity()) {
            return;
        }

        const form = new FormData(bookingForm);

        const booking = {
            name: String(form.get("name")).trim(),
            phone: String(form.get("phone")).trim(),
            service: String(form.get("service")),
            date: String(form.get("date")),
            time: String(form.get("time")),
            notes: String(form.get("notes") || "").trim()
        };

        // Demo mode: nothing is sent to a business yet.
        if (CONFIG.demoMode) {
            console.log("Demo booking:", booking);

            showToast(
                "Your demo booking was captured! Add your real WhatsApp number in script.js to enable sending."
            );

            return;
        }

        const number = CONFIG.whatsappNumber.replace(/\D/g, "");

        if (!number || number === "2348000000000") {
            showToast("Please add your real WhatsApp number in script.js first.");
            return;
        }

        const message = [
            "Hello! I would like to request an appointment.",
            "",
            "Name: " + booking.name,
            "Phone: " + booking.phone,
            "Service: " + booking.service,
            "Preferred date: " + booking.date,
            "Preferred time: " + booking.time,
            booking.notes ? "Notes: " + booking.notes : ""
        ].filter(Boolean).join("\n");

        const whatsappURL =
            "https://wa.me/" + number + "?text=" + encodeURIComponent(message);

        window.open(whatsappURL, "_blank", "noopener,noreferrer");

        showToast("Opening WhatsApp with your booking request.");
    });

    console.log("Gentleman's Club website loaded successfully.");
});