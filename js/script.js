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
    },
    {
        name: "Dr. Disani Malo",
        specialization: "Nurse",
        location: "Kolkata",
        rating: 5
    }
];

const doctorsList = document.getElementById("doctorsList");
const medicosearch = document.getElementById("medicosearch");

function renderDoctors(filteredDoctors) {
    doctorsList.innerHTML = "";

    if (filteredDoctors.length === 0) {
        doctorsList.innerHTML = "<p>No doctors found</p>";
        return;
    }

    filteredDoctors.forEach(function(doctor) {
        const doctorCard = document.createElement("div");
        doctorCard.classList.add("doctor-card");

        doctorCard.innerHTML = `
            <h3>${doctor.name}</h3>
            <p>${doctor.specialization}</p>
            <p>${doctor.location}</p>
            <p>⭐ ${doctor.rating}</p>
            <button>Book Appointment</button>
        `;

        doctorsList.appendChild(doctorCard);
    });
}

function filterDoctors(query) {
    const searchText = query.trim().toLowerCase();

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
            return field.toLowerCase().includes(searchText);
        });
    });
}

medicosearch.addEventListener("input", function(event) {
    const filteredDoctors = filterDoctors(event.target.value);
    renderDoctors(filteredDoctors);
});

renderDoctors(doctors);