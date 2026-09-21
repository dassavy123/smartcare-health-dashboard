const doctors = [
    {
        name: "Dr. Ananya Sharma",
        specialization: "Cardiologist",
        location: "Kolkata",
        rating: 4.8
    },
    {
        name: "Dr. Rahul Sen",
        specialization: "Dermatologist",
        location: "Kolkata",
        rating: 4.6
    },
    {
        name: "Dr. Priya Das",
        specialization: "Neurologist",
        location: "Kolkata",
        rating: 4.9
    }
];


// ===============================
// NURSES DATA
// ===============================

const nurses = [
    {
        name: "RN. Disani Malo",
        specialization: "Registered Nurse",
        location: "Kolkata",
        rating: 5
    },
    {
        name: "Nurse Anjali Roy",
        specialization: "Staff Nurse",
        location: "Kolkata",
        rating: 4.8
    }
];


// ===============================
// APPOINTMENTS DATA
// ===============================

const appointments = [];


// ===============================
// GET HTML ELEMENTS
// ===============================

const doctorsList =
    document.getElementById("doctorsList");

const medicosearch =
    document.getElementById("medicosearch");

const appointmentsList =
    document.getElementById("appointmentsList");

const appointmentModal =
    document.getElementById("appointmentModal");

const closeModal =
    document.getElementById("closeModal");

const appointmentForm =
    document.getElementById("appointmentForm");

const selectedDoctor =
    document.getElementById("selectedDoctor");

const selectedSpecialization =
    document.getElementById("selectedSpecialization");

const successMessage =
    document.getElementById("successMessage");

const confirmationText =
    document.getElementById("confirmationText");

const doneButton =
    document.getElementById("doneButton");


// ===============================
// CURRENT SELECTED MEDICO
// ===============================

let currentDoctor = null;


// ===============================
// DISPLAY DOCTORS
// ===============================

function renderDoctors(filteredDoctors) {

    doctorsList.innerHTML = "";

    if (filteredDoctors.length === 0) {

        doctorsList.innerHTML = `
            <p>No doctors found</p>
        `;

        return;
    }

    filteredDoctors.forEach(function(doctor) {

        const doctorCard =
            document.createElement("div");

        doctorCard.classList.add("doctor-card");

        doctorCard.innerHTML = `
            <h3>${doctor.name}</h3>

            <p>${doctor.specialization}</p>

            <p>${doctor.location}</p>

            <p>⭐ ${doctor.rating}</p>

            <button
                onclick="bookAppointment('${doctor.name}')"
            >
                Book Appointment
            </button>
        `;

        doctorsList.appendChild(doctorCard);
    });
}


// ===============================
// DISPLAY NURSES
// ===============================

function renderNurses() {

    const nursesList =
        document.getElementById("nursesList");

    if (!nursesList) {
        return;
    }

    nursesList.innerHTML = "";

    nurses.forEach(function(nurse) {

        const nurseCard =
            document.createElement("div");

        nurseCard.classList.add("doctor-card");

        nurseCard.innerHTML = `
            <h3>${nurse.name}</h3>

            <p>${nurse.specialization}</p>

            <p>${nurse.location}</p>

            <p>⭐ ${nurse.rating}</p>

            <button
                onclick="bookNurseAppointment('${nurse.name}')"
            >
                Book Appointment
            </button>
        `;

        nursesList.appendChild(nurseCard);
    });
}


// ===============================
// DISPLAY APPOINTMENTS
// ===============================

function renderAppointments() {

    if (!appointmentsList) {
        return;
    }

    appointmentsList.innerHTML = "";

    if (appointments.length === 0) {

        appointmentsList.innerHTML = `
            <p>No appointments yet.</p>
        `;

        return;
    }

    appointments.forEach(function(appointment, index) {

        const appointmentCard =
            document.createElement("div");

        appointmentCard.classList.add(
            "appointment-card"
        );

        appointmentCard.innerHTML = `
            <h3>${appointment.medicoName}</h3>

            <p>
                <strong>
                    ${appointment.specialization}
                </strong>
            </p>

            <p>
                Patient:
                <strong>${appointment.patientName}</strong>
            </p>

            <p>
                Date:
                <strong>${appointment.date}</strong>
            </p>

            <p>
                Time:
                <strong>${appointment.time}</strong>
            </p>

            <button
                onclick="cancelAppointment(${index})"
                class="cancel-button"
            >
                Cancel Appointment
            </button>
        `;

        appointmentsList.appendChild(
            appointmentCard
        );
    });
}


// ===============================
// SEARCH DOCTORS
// ===============================

function filterDoctors(query) {

    const searchText =
        query.trim().toLowerCase();

    if (!searchText) {
        return doctors;
    }

    return doctors.filter(function(doctor) {

        const searchableFields = [
            doctor.name,
            doctor.specialization,
            doctor.location
        ];

        return searchableFields.some(function(field) {

            return field
                .toLowerCase()
                .includes(searchText);
        });
    });
}


// ===============================
// SEARCH EVENT
// ===============================

if (medicosearch) {

    medicosearch.addEventListener(
        "input",
        function(event) {

            const filteredDoctors =
                filterDoctors(event.target.value);

            renderDoctors(filteredDoctors);
        }
    );
}


// ===============================
// BOOK DOCTOR APPOINTMENT
// ===============================

function bookAppointment(doctorName) {

    currentDoctor =
        doctors.find(function(doctor) {

            return doctor.name === doctorName;
        });

    if (!currentDoctor) {
        return;
    }

    selectedDoctor.textContent =
        currentDoctor.name;

    selectedSpecialization.textContent =
        currentDoctor.specialization;

    appointmentForm.reset();

    appointmentModal.style.display = "flex";
}


// ===============================
// BOOK NURSE APPOINTMENT
// ===============================

function bookNurseAppointment(nurseName) {

    currentDoctor =
        nurses.find(function(nurse) {

            return nurse.name === nurseName;
        });

    if (!currentDoctor) {
        return;
    }

    selectedDoctor.textContent =
        currentDoctor.name;

    selectedSpecialization.textContent =
        currentDoctor.specialization;

    appointmentForm.reset();

    appointmentModal.style.display = "flex";
}


// ===============================
// CLOSE APPOINTMENT MODAL
// ===============================

if (closeModal) {

    closeModal.addEventListener(
        "click",
        function() {

            appointmentModal.style.display =
                "none";
        }
    );
}


// ===============================
// CLOSE MODAL OUTSIDE CLICK
// ===============================

window.addEventListener(
    "click",
    function(event) {

        if (event.target === appointmentModal) {

            appointmentModal.style.display =
                "none";
        }
    }
);


// ===============================
// SUBMIT APPOINTMENT
// ===============================

appointmentForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        if (!currentDoctor) {
            return;
        }


        // ===============================
        // GET PATIENT INFORMATION
        // ===============================

        const patientName =
            document.getElementById(
                "patientName"
            ).value;

        const appointmentDate =
            document.getElementById(
                "appointmentDate"
            ).value;

        const appointmentTime =
            document.getElementById(
                "appointmentTime"
            ).value;


        // ===============================
        // FORMAT DATE
        // ===============================

        const formattedDate =
            new Date(
                appointmentDate + "T00:00:00"
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        // ===============================
        // SAVE APPOINTMENT
        // ===============================

        appointments.push({

            medicoName:
                currentDoctor.name,

            specialization:
                currentDoctor.specialization,

            patientName:
                patientName,

            date:
                formattedDate,

            time:
                appointmentTime
        });


        // ===============================
        // UPDATE APPOINTMENTS
        // ===============================

        renderAppointments();


        // ===============================
        // CLOSE APPOINTMENT MODAL
        // ===============================

        appointmentModal.style.display =
            "none";


        // ===============================
        // SHOW CONFIRMATION
        // ===============================

        confirmationText.innerHTML = `
            <strong>${currentDoctor.name}</strong><br>

            ${currentDoctor.specialization}<br><br>

            Patient:
            <strong>${patientName}</strong><br>

            Date:
            <strong>${formattedDate}</strong><br>

            Time:
            <strong>${appointmentTime}</strong>
        `;

        successMessage.style.display =
            "flex";
    }
);


function renderAppointments() {

    if (!appointmentsList) {
        return;
    }

    appointmentsList.innerHTML = "";

    if (appointments.length === 0) {

        appointmentsList.innerHTML = `
            <p>No appointments yet.</p>
        `;

        return;
    }

    appointments.forEach(function(appointment, index) {

        const appointmentCard =
            document.createElement("div");

        appointmentCard.classList.add(
            "appointment-card"
        );

        appointmentCard.innerHTML = `
            <h3>${appointment.medicoName}</h3>

            <p>
                <strong>
                    ${appointment.specialization}
                </strong>
            </p>

            <p>
                Patient:
                <strong>${appointment.patientName}</strong>
            </p>

            <p>
                Date:
                <strong>${appointment.date}</strong>
            </p>

            <p>
                Time:
                <strong>${appointment.time}</strong>
            </p>

            <button
                class="cancel-button"
                type="button"
            >
                Cancel Appointment
            </button>
        `;

        // Get cancel button
        const cancelButton =
            appointmentCard.querySelector(
                ".cancel-button"
            );

        // Cancel appointment
        cancelButton.addEventListener(
            "click",
            function() {

                const confirmCancel =
                    confirm(
                        "Are you sure you want to cancel this appointment?"
                    );

                if (!confirmCancel) {
                    return;
                }

                appointments.splice(index, 1);

                renderAppointments();

            }
        );

        appointmentsList.appendChild(
            appointmentCard
        );
    });
}

// ===============================
// DONE BUTTON
// ===============================

if (doneButton) {

    doneButton.addEventListener(
        "click",
        function() {

            successMessage.style.display =
                "none";
        }
    );
}


// ===============================
// INITIAL DISPLAY
// ===============================

renderDoctors(doctors);

renderNurses();

renderAppointments();
// ===============================
// ACTIVE NAVBAR LINK
// ===============================

const navLinks =
    document.querySelectorAll(".nav-link");

const sections =
    document.querySelectorAll("main section");


function updateActiveNav() {

    let currentSection = "home";

    const scrollPosition =
        window.scrollY + 150;


    sections.forEach(function(section) {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition <
                sectionTop + sectionHeight
        ) {

            currentSection =
                section.id;
        }
    });


    navLinks.forEach(function(link) {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {

            link.classList.add("active");
        }
    });
}


// Update while scrolling

window.addEventListener(
    "scroll",
    updateActiveNav
);


// Update when clicking

navLinks.forEach(function(link) {

    link.addEventListener(
        "click",
        function() {

            navLinks.forEach(function(item) {
                item.classList.remove("active");
            });

            link.classList.add("active");
        }
    );
});


// Initial state

updateActiveNav();