"use strict";

const SmartCare = (() => {

  /* =========================================================
     EVENT BUS
  ========================================================= */

  const bus = (() => {
    const listeners = new Map();

    return {
      on(event, handler) {
        if (!listeners.has(event)) {
          listeners.set(event, []);
        }

        listeners.get(event).push(handler);
      },

      emit(event, payload) {
        (listeners.get(event) || []).forEach((handler) => {
          handler(payload);
        });
      },
    };
  })();


  /* =========================================================
     HELPERS
  ========================================================= */

  const sanitize = (value) => {
    const holder = document.createElement("div");
    holder.textContent = value ?? "";
    return holder.innerHTML;
  };

  const debounce = (fn, wait = 180) => {
    let timer;

    return (...args) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        fn(...args);
      }, wait);
    };
  };

  const startOfToday = () => {
    const now = new Date();

    now.setHours(0, 0, 0, 0);

    return now;
  };

  const isoDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const weekdayName = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  };

  const rupees = (amount) => {
    return `₹${Math.round(amount).toLocaleString("en-IN")}`;
  };


  /* =========================================================
     BOOKING REFERENCE
  ========================================================= */

  let refSeed = 400;

  const nextRef = (prefix) => {
    return `${prefix}-${(refSeed++).toString(36).toUpperCase()}`;
  };


  /* =========================================================
     DOCTORS / NURSES / AMBULANCES
  ========================================================= */

  const roster = {

    /* =========================
       DOCTORS
    ========================= */

    doctor: [

      {
        name: "Dr. Ananya Sharma",
        specialization: "Cardiologist",
        location: "Kolkata",
        rating: 4.8,
        rate: 900,

        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",

        availableDays: [
          "Monday",
          "Wednesday",
          "Friday"
        ],

        availableTimes: [
          "10:00 AM",
          "1:00 PM",
          "4:00 PM"
        ],
      },

      {
        name: "Dr. Rahul Sen",
        specialization: "Dermatologist",
        location: "Kolkata",
        rating: 4.6,
        rate: 700,

        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",

        availableDays: [
          "Tuesday",
          "Thursday",
          "Saturday"
        ],

        availableTimes: [
          "11:00 AM",
          "2:00 PM",
          "5:00 PM"
        ],
      },

      {
        name: "Dr. Priya Das",
        specialization: "Neurologist",
        location: "Kolkata",
        rating: 4.9,
        rate: 1100,

        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80",

        availableDays: [
          "Monday",
          "Tuesday",
          "Friday"
        ],

        availableTimes: [
          "9:00 AM",
          "1:00 PM",
          "6:00 PM"
        ],
      },

    ],


    /* =========================
       NURSES
    ========================= */

    nurse: [

      {
        name: "RN. Disani Malo",
        specialization: "Registered Nurse",
        location: "Kolkata",
        rating: 5.0,
        rate: 500,

        image:
          "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=600&q=80",

        availableDays: [
          "Monday",
          "Tuesday",
          "Friday"
        ],

        availableTimes: [
          "9:00 AM",
          "1:00 PM",
          "6:00 PM"
        ],
      },

      {
        name: "Nurse Anjali Roy",
        specialization: "Staff Nurse",
        location: "Kolkata",
        rating: 4.8,
        rate: 400,

        image:
          "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80",

        availableDays: [
          "Monday",
          "Tuesday",
          "Friday"
        ],

        availableTimes: [
          "10:00 AM",
          "2:00 PM",
          "5:00 PM"
        ],
      },

      {
        name: "Nurse Sneha Paul",
        specialization: "Critical Care Nurse",
        location: "Kolkata",
        rating: 4.9,
        rate: 650,

        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",

        availableDays: [
          "Tuesday",
          "Thursday",
          "Saturday"
        ],

        availableTimes: [
          "9:00 AM",
          "12:00 PM",
          "4:00 PM"
        ],
      },

    ],


    /* =========================
       AMBULANCES
    ========================= */

    ambulance: [

      {
        name: "Basic Life Support Ambulance",

        specialization:
          "BLS · Oxygen & first aid onboard",

        location: "Kolkata",

        rating: 4.7,

        image:
          "https://images.unsplash.com/photo-1625258111307-3e929842d9b5?fm=jpg&q=80&w=900&auto=format&fit=crop",

        eta: "8-12 min",

        baseFare: 500,

        perKm: 20,

        features: [
          "Oxygen support",
          "First-aid kit",
          "Trained EMT"
        ],
      },


      {
        name: "Advanced Life Support Ambulance",

        specialization:
          "ALS · Ventilator & paramedic onboard",

        location: "Kolkata",

        rating: 4.8,

        image:
          "https://images.unsplash.com/photo-1599700403969-f77b3aa74837?fm=jpg&q=80&w=900&auto=format&fit=crop",

        eta: "10-15 min",

        baseFare: 900,

        perKm: 30,

        features: [
          "Ventilator",
          "Defibrillator",
          "Paramedic onboard"
        ],
      },


      {
        name: "ICU Cardiac Ambulance",

        specialization:
          "ICU · Critical care nurse onboard",

        location: "Kolkata",

        rating: 4.9,

        image:
          "https://images.unsplash.com/photo-1690520760201-e0a37f372b67?fm=jpg&q=80&w=900&auto=format&fit=crop",

        eta: "12-18 min",

        baseFare: 1500,

        perKm: 45,

        features: [
          "ICU setup",
          "Cardiac monitor",
          "Critical care nurse"
        ],
      },

    ],
  };


  /* =========================================================
     FIND DATA
  ========================================================= */

  const findByName = (type, name) => {
    return roster[type].find((entry) => entry.name === name);
  };


  /* =========================================================
     AMBULANCE FARE
  ========================================================= */

  const ambulanceFare = (ambulance, distanceKm) => {

    return (
      ambulance.baseFare +
      ambulance.perKm *
        Math.max(1, Number(distanceKm) || 0)
    );

  };


  /* =========================================================
     APPLICATION STATE
  ========================================================= */

  const state = {

    bookings: [],

    activeBooking: null,

    activeAmbulance: null,

  };


  /* =========================================================
     DOM ELEMENTS
  ========================================================= */

  const el = {};


  /* =========================================================
     ICONS
  ========================================================= */

  const icons = {

    doctor: "👨‍⚕️",

    nurse: "👩‍⚕️",

    ambulance: "🚑",

  };


  /* =========================================================
     DESCRIPTION
  ========================================================= */

  const blurb = {

    doctor:
      "Experienced medical professional dedicated to quality patient care.",

    nurse:
      "Professional nursing care focused on patient comfort and support.",

  };


  /* =========================================================
     PROFESSIONAL CARD
  ========================================================= */

  function professionalCardMarkup(person, type) {

    const availableToday =
      person.availableDays.includes(
        weekdayName(new Date())
      );


    return `

      <div class="professional-image-container">

        <img
          src="${sanitize(person.image)}"
          alt="${sanitize(person.name)}"
          class="professional-image"

          onerror="
            this.onerror=null;
            this.src='https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80';
          "
        >

        <span class="availability-badge ${
          availableToday ? "" : "unavailable"
        }">

          ${
            availableToday
              ? "● Available today"
              : "○ Not available today"
          }

        </span>

      </div>


      <div class="professional-info">

        <div class="professional-top">

          <span class="specialty-badge">
            ${sanitize(person.specialization)}
          </span>

          <span class="rating">
            ⭐ ${sanitize(person.rating)}
          </span>

        </div>


        <h3>
          ${sanitize(person.name)}
        </h3>


        <p class="professional-location">
          📍 ${sanitize(person.location)}
        </p>


        <p class="professional-description">
          ${blurb[type]}
        </p>


        <div class="professional-footer">

          <span class="availability-text">
            🕐 ${sanitize(
              person.availableDays.join(", ")
            )}
          </span>

          <span class="rate-badge">
            💰 ${rupees(person.rate)}
          </span>

        </div>


        <button
          type="button"
          class="book-btn"
          data-book="${sanitize(type)}"
          data-name="${sanitize(person.name)}"
        >

          Book Appointment

        </button>

      </div>

    `;
  }


  /* =========================================================
     AMBULANCE CARD
  ========================================================= */

  function ambulanceCardMarkup(ambulance) {

    return `

      <div class="professional-image-container">

        <img
          src="${sanitize(ambulance.image)}"
          alt="${sanitize(ambulance.name)}"
          class="professional-image"

          onerror="
            this.onerror=null;
            this.src='https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=900&q=80';
          "
        >

        <span class="availability-badge eta-badge">

          ⏱ ETA ${sanitize(ambulance.eta)}

        </span>

      </div>


      <div class="professional-info">

        <div class="professional-top">

          <span class="specialty-badge">

            ${sanitize(ambulance.specialization)}

          </span>

          <span class="rating">

            ⭐ ${sanitize(ambulance.rating)}

          </span>

        </div>


        <h3>

          ${sanitize(ambulance.name)}

        </h3>


        <p class="professional-location">

          📍 ${sanitize(ambulance.location)}

        </p>


        <div class="ambulance-features">

          ${ambulance.features
            .map(
              (feature) => `
                <span class="ambulance-feature-pill">

                  ${sanitize(feature)}

                </span>
              `
            )
            .join("")}

        </div>


        <div class="professional-footer">

          <span class="availability-text">

            Base fare

          </span>

          <span class="rate-badge">

            💰 From ${rupees(ambulance.baseFare)}

          </span>

        </div>


        <button
          type="button"
          class="book-btn"
          data-book="ambulance"
          data-name="${sanitize(ambulance.name)}"
        >

          Book Ambulance

        </button>

      </div>

    `;
  }


  /* =========================================================
     EMPTY STATE
  ========================================================= */

  const emptyStateMarkup = (
    icon,
    title,
    body,
    linkHref,
    linkText
  ) => `

    <div class="no-results">

      <div class="no-results-icon">

        ${icon}

      </div>

      <h3>

        ${title}

      </h3>

      <p>

        ${body}

      </p>

      ${
        linkHref
          ? `
            <a href="${linkHref}">
              ${linkText}
            </a>
          `
          : ""
      }

    </div>

  `;


  /* =========================================================
     BOOKING CARD
  ========================================================= */

  function bookingCardMarkup(booking) {

    if (booking.kind === "ambulance") {

      return `

        <div class="appointment-left">

          <div class="appointment-avatar ambulance-avatar">

            ${icons.ambulance}

          </div>


          <div>

            <span class="appointment-status dispatched">

              Dispatched

            </span>

            <h3>

              ${sanitize(booking.ambulanceName)}

            </h3>

            <p>

              ${sanitize(booking.pickupAddress)}

            </p>

          </div>

        </div>


        <div class="appointment-details">

          <div>

            <span>ETA</span>

            <strong>

              ⏱ ${sanitize(booking.eta)}

            </strong>

          </div>


          <div>

            <span>Fare</span>

            <strong>

              💰 ${rupees(booking.fare)}
              ·
              ${sanitize(booking.paymentMethod)}

            </strong>

          </div>


          <div>

            <span>Patient</span>

            <strong>

              ${sanitize(booking.patientName)}

            </strong>

          </div>

        </div>


        <button
          class="cancel-button"
          type="button"
          data-cancel="${sanitize(booking.ref)}"
        >

          Cancel Dispatch

        </button>

      `;
    }


    return `

      <div class="appointment-left">

        <div class="appointment-avatar">

          ${icons[booking.type]}

        </div>


        <div>

          <span class="appointment-status">

            Confirmed

          </span>

          <h3>

            ${sanitize(booking.name)}

          </h3>

          <p>

            ${sanitize(booking.specialization)}
            ·
            ${sanitize(booking.paymentMethod)}

          </p>

        </div>

      </div>


      <div class="appointment-details">

        <div>

          <span>Date</span>

          <strong>

            📅 ${sanitize(booking.date)}

          </strong>

        </div>


        <div>

          <span>Time</span>

          <strong>

            🕐 ${sanitize(booking.time)}

          </strong>

        </div>


        <div>

          <span>Paid</span>

          <strong>

            💰 ${rupees(booking.fee)}

          </strong>

        </div>

      </div>


      <button
        class="cancel-button"
        type="button"
        data-cancel="${sanitize(booking.ref)}"
      >

        Cancel Appointment

      </button>

    `;
  }


  /* =========================================================
     RENDER DOCTORS / NURSES
  ========================================================= */

  function renderRoster(type) {

    const container =
      type === "doctor"
        ? el.doctorsList
        : el.nursesList;


    if (!container) return;


    const query =
      (
        type === "doctor"
          ? el.doctorSearch?.value
          : el.nurseSearch?.value
      ) || "";


    const matches =
      filterRoster(type, query);


    if (matches.length === 0) {

      container.innerHTML =
        type === "doctor"

          ? emptyStateMarkup(
              "🔍",
              "No doctors found",
              "Try searching for another doctor or specialization."
            )

          : emptyStateMarkup(
              "👩‍⚕️",
              "No nurses found",
              "Try searching for another nurse or specialization."
            );

      return;
    }


    container.innerHTML = matches

      .map(
        (person) => `

          <div class="doctor-card">

            ${professionalCardMarkup(
              person,
              type
            )}

          </div>

        `
      )

      .join("");
  }


  /* =========================================================
     RENDER AMBULANCES
  ========================================================= */

  function renderAmbulances() {

    if (!el.ambulanceList) return;


    el.ambulanceList.innerHTML =
      roster.ambulance

        .map(
          (ambulance) => `

            <div class="doctor-card ambulance-card">

              ${ambulanceCardMarkup(
                ambulance
              )}

            </div>

          `
        )

        .join("");
  }


  /* =========================================================
     RENDER BOOKINGS
  ========================================================= */

  function renderBookings() {

    if (!el.appointmentsList) return;


    if (state.bookings.length === 0) {

      el.appointmentsList.innerHTML =
        emptyStateMarkup(
          "📅",
          "No appointments yet",
          "Your booked appointments will appear here.",
          "#doctors",
          "Find a Doctor"
        );

      return;
    }


    el.appointmentsList.innerHTML =
      state.bookings

        .map((booking) => {

          const cardClass =
            booking.kind === "ambulance"
              ? "appointment-card ambulance-booking"
              : "appointment-card";


          return `

            <div class="${cardClass}">

              ${bookingCardMarkup(
                booking
              )}

            </div>

          `;
        })

        .join("");
  }


  /* =========================================================
     EVENT BUS
  ========================================================= */

  bus.on(
    "booking:created",
    renderBookings
  );

  bus.on(
    "booking:cancelled",
    renderBookings
  );


  /* =========================================================
     FILTER
  ========================================================= */

  function filterRoster(type, rawQuery) {

    const query =
      rawQuery.trim().toLowerCase();


    if (!query) {

      return roster[type];

    }


    return roster[type].filter(
      (person) =>

        [
          person.name,
          person.specialization,
          person.location,
        ].some((field) =>
          field
            .toLowerCase()
            .includes(query)
        )
    );
  }


  /* =========================================================
     CARD CLICK
  ========================================================= */

  function handleRosterClick(event) {

    const button =
      event.target.closest(
        "[data-book]"
      );


    if (!button) return;


    const type =
      button.dataset.book;


    if (type === "ambulance") {

      const ambulance =
        findByName(
          "ambulance",
          button.dataset.name
        );


      if (ambulance) {

        openAmbulanceModal(
          ambulance
        );

      }


      return;
    }


    const person =
      findByName(
        type,
        button.dataset.name
      );


    if (person) {

      openBookingModal(
        person,
        type
      );

    }
  }


  /* =========================================================
     PAYMENT PICKER
  ========================================================= */

  function wirePaymentPicker(container) {

    if (!container) return;


    container
      .querySelectorAll(
        ".payment-option"
      )
      .forEach((option) => {

        option.addEventListener(
          "click",
          () => {

            container
              .querySelectorAll(
                ".payment-option"
              )
              .forEach((node) =>
                node.classList.remove(
                  "selected"
                )
              );


            option.classList.add(
              "selected"
            );

          }
        );

      });
  }


  function selectedPaymentMethod(
    formEl,
    radioName
  ) {

    return (
      formEl.querySelector(
        `input[name="${radioName}"]:checked`
      )?.value || "Cash"
    );

  }


  /* =========================================================
     TIME OPTIONS
  ========================================================= */

  function populateTimeOptions(person) {

    const select =
      document.getElementById(
        "appointmentTime"
      );


    if (!select) return;


    select.innerHTML =
      `<option value="">Select a time</option>`;


    person.availableTimes.forEach(
      (time) => {

        select.append(
          new Option(time, time)
        );

      }
    );
  }


  /* =========================================================
     OPEN APPOINTMENT MODAL
  ========================================================= */

  function openBookingModal(
    person,
    type
  ) {

    if (!el.modal || !el.form) return;


    state.activeBooking = {
      type,
      name: person.name,
    };


    if (el.selectedName) {

      el.selectedName.textContent =
        person.name;

    }


    if (
      el.selectedSpecialization
    ) {

      el.selectedSpecialization.textContent =
        person.specialization;

    }


    if (el.selectedRate) {

      el.selectedRate.textContent =
        `Consultation Fee: ${rupees(
          person.rate
        )}`;

    }


    if (
      el.appointmentFeeDisplay
    ) {

      el.appointmentFeeDisplay.textContent =
        rupees(person.rate);

    }


    el.form.reset();


    populateTimeOptions(person);


    const dateInput =
      document.getElementById(
        "appointmentDate"
      );


    if (dateInput) {

      dateInput.min =
        isoDate(
          startOfToday()
        );

    }


    el.modal.style.display =
      "flex";
  }


  function closeBookingModal() {

    if (el.modal) {

      el.modal.style.display =
        "none";

    }
  }


  /* =========================================================
     AMBULANCE FARE
  ========================================================= */

  function refreshAmbulanceFare() {

    if (
      !state.activeAmbulance ||
      !el.ambulanceFareEstimate
    ) {

      return;

    }


    const fare =
      ambulanceFare(
        state.activeAmbulance,
        el.distanceKm?.value
      );


    el.ambulanceFareEstimate.textContent =
      rupees(fare);
  }


  /* =========================================================
     OPEN AMBULANCE MODAL
  ========================================================= */

  function openAmbulanceModal(
    ambulance
  ) {

    if (
      !el.ambulanceModal ||
      !el.ambulanceForm
    ) {

      return;

    }


    state.activeAmbulance =
      ambulance;


    if (el.selectedAmbulance) {

      el.selectedAmbulance.textContent =
        ambulance.name;

    }


    if (el.selectedAmbulanceInfo) {

      el.selectedAmbulanceInfo.textContent =
        `ETA ${ambulance.eta} · Base fare ${rupees(
          ambulance.baseFare
        )}`;

    }


    el.ambulanceForm.reset();


    if (el.distanceKm) {

      el.distanceKm.value = 5;

    }


    refreshAmbulanceFare();


    el.ambulanceModal.style.display =
      "flex";
  }


  function closeAmbulanceModal() {

    if (el.ambulanceModal) {

      el.ambulanceModal.style.display =
        "none";

    }
  }


  /* =========================================================
     DEFAULT AMBULANCE
  ========================================================= */

  function openDefaultAmbulanceModal() {

    const fastest =
      [...roster.ambulance].sort(
        (a, b) =>
          parseInt(a.eta) -
          parseInt(b.eta)
      )[0];


    if (fastest) {

      openAmbulanceModal(
        fastest
      );

    }
  }


  /* =========================================================
     CONFIRMATION
  ========================================================= */

  function showConfirmation({
    title,
    html,
    emergency,
  }) {

    if (!el.successPanel) return;


    if (el.successTitle) {

      el.successTitle.textContent =
        title;

    }


    if (el.confirmationText) {

      el.confirmationText.innerHTML =
        html;

    }


    if (el.successIcon) {

      el.successIcon.classList.toggle(
        "emergency",
        Boolean(emergency)
      );


      el.successIcon.textContent =
        emergency
          ? "🚑"
          : "✓";

    }


    el.successPanel.style.display =
      "flex";
  }


  /* =========================================================
     APPOINTMENT SUBMIT
  ========================================================= */

  function handleAppointmentSubmit(
    event
  ) {

    event.preventDefault();


    if (!state.activeBooking) return;


    const patientName =
      document
        .getElementById(
          "patientName"
        )
        .value.trim();


    const date =
      document
        .getElementById(
          "appointmentDate"
        )
        .value;


    const time =
      document
        .getElementById(
          "appointmentTime"
        )
        .value;


    if (
      !patientName ||
      !date ||
      !time
    ) {

      alert(
        "Please fill in all fields."
      );

      return;

    }


    const picked =
      new Date(
        `${date}T00:00:00`
      );


    if (
      picked < startOfToday()
    ) {

      alert(
        "Please choose a date that isn't in the past."
      );

      return;

    }


    const formattedDate =
      picked.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );


    const {
      type,
      name,
    } = state.activeBooking;


    const person =
      findByName(
        type,
        name
      );


    if (!person) return;


    const slotTaken =
      state.bookings.some(
        (booking) =>
          booking.name === name &&
          booking.date ===
            formattedDate &&
          booking.time === time
      );


    if (slotTaken) {

      alert(
        "This time slot is already booked. Please select another time."
      );

      return;

    }


    const booking = {

      ref: nextRef("SC"),

      kind: "appointment",

      type,

      name,

      specialization:
        person.specialization,

      patientName,

      date:
        formattedDate,

      time,

      fee:
        person.rate,

      paymentMethod:
        selectedPaymentMethod(
          el.form,
          "appointmentPayment"
        ),

    };


    state.bookings.push(
      booking
    );


    bus.emit(
      "booking:created",
      booking
    );


    closeBookingModal();


    showConfirmation({

      title:
        "Appointment Confirmed",

      emergency:
        false,

      html: `

        <strong>
          ${sanitize(
            booking.name
          )}
        </strong>

        <br>

        ${sanitize(
          booking.specialization
        )}

        <br><br>

        Patient:

        <strong>
          ${sanitize(
            booking.patientName
          )}
        </strong>

        <br>

        Date:

        <strong>
          ${sanitize(
            booking.date
          )}
        </strong>

        <br>

        Time:

        <strong>
          ${sanitize(
            booking.time
          )}
        </strong>

        <br>

        Paid:

        <strong>
          ${rupees(
            booking.fee
          )}
          (${sanitize(
            booking.paymentMethod
          )})
        </strong>

      `,
    });

  }


  /* =========================================================
     AMBULANCE SUBMIT
  ========================================================= */

  function handleAmbulanceSubmit(
    event
  ) {

    event.preventDefault();


    if (
      !state.activeAmbulance
    ) {

      return;

    }


    const patientName =
      document
        .getElementById(
          "ambulancePatientName"
        )
        .value.trim();


    const contact =
      document
        .getElementById(
          "ambulanceContact"
        )
        .value.trim();


    const pickupAddress =
      document
        .getElementById(
          "pickupAddress"
        )
        .value.trim();


    const distanceKm =
      Number(
        el.distanceKm?.value
      ) || 1;


    if (
      !patientName ||
      !contact ||
      !pickupAddress
    ) {

      alert(
        "Please fill in all fields."
      );

      return;

    }


    const ambulance =
      state.activeAmbulance;


    const fare =
      ambulanceFare(
        ambulance,
        distanceKm
      );


    const booking = {

      ref: nextRef("AMB"),

      kind: "ambulance",

      ambulanceName:
        ambulance.name,

      eta:
        ambulance.eta,

      patientName,

      contact,

      pickupAddress,

      distanceKm,

      fare,

      paymentMethod:
        selectedPaymentMethod(
          el.ambulanceForm,
          "ambulancePayment"
        ),

    };


    state.bookings.push(
      booking
    );


    bus.emit(
      "booking:created",
      booking
    );


    closeAmbulanceModal();


    showConfirmation({

      title:
        "Ambulance Dispatched!",

      emergency:
        true,

      html: `

        <strong>
          ${sanitize(
            booking.ambulanceName
          )}
        </strong>

        <br>

        Dispatch ref:

        <strong>
          ${sanitize(
            booking.ref
          )}
        </strong>

        <br><br>

        Pickup:

        <strong>
          ${sanitize(
            booking.pickupAddress
          )}
        </strong>

        <br>

        ETA:

        <strong>
          ${sanitize(
            booking.eta
          )}
        </strong>

        <br>

        Fare:

        <strong>
          ${rupees(
            booking.fare
          )}
          (${sanitize(
            booking.paymentMethod
          )})
        </strong>

        <br><br>

        Stay calm, help is on the way.

      `,
    });

  }


  /* =========================================================
     NAVIGATION SPY
  ========================================================= */

  function initNavSpy() {

    const navLinks =
      [
        ...document.querySelectorAll(
          ".nav-link"
        ),
      ];


    const sections =
      [
        "home",
        "doctors",
        "nurses",
        "appointments",
        "emergency",
      ]

        .map((id) =>
          document.getElementById(
            id
          )
        )

        .filter(Boolean);


    if (!sections.length) return;


    const setActive = (id) => {

      navLinks.forEach(
        (link) => {

          link.classList.toggle(
            "active",

            link.getAttribute(
              "href"
            ) === `#${id}`
          );

        }
      );

    };


    const observer =
      new IntersectionObserver(

        (entries) => {

          const visible =
            entries

              .filter(
                (entry) =>
                  entry.isIntersecting
              )

              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio
              )[0];


          if (visible) {

            setActive(
              visible.target.id
            );

          }

        },

        {
          rootMargin:
            "-40% 0px -55% 0px",

          threshold: [
            0,
            0.25,
            0.5,
            0.75,
            1,
          ],
        }

      );


    sections.forEach(
      (section) =>
        observer.observe(
          section
        )
    );


    navLinks.forEach(
      (link) => {

        link.addEventListener(
          "click",
          () => {

            const href =
              link.getAttribute(
                "href"
              );

            if (href) {

              setActive(
                href.slice(1)
              );

            }

          }
        );

      }
    );

  }


  /* =========================================================
     CACHE DOM ELEMENTS
  ========================================================= */

  function cacheElements() {

    Object.assign(
      el,
      {

        doctorsList:
          document.getElementById(
            "doctorsList"
          ),

        nursesList:
          document.getElementById(
            "nursesList"
          ),

        ambulanceList:
          document.getElementById(
            "ambulanceList"
          ),

        doctorSearch:
          document.getElementById(
            "medicosearch"
          ),

        nurseSearch:
          document.getElementById(
            "nurseSearch"
          ),

        searchButton:
          document.getElementById(
            "searchButton"
          ),

        appointmentsList:
          document.getElementById(
            "appointmentsList"
          ),


        /* Appointment modal */

        modal:
          document.getElementById(
            "appointmentModal"
          ),

        modalClose:
          document.getElementById(
            "closeModal"
          ),

        form:
          document.getElementById(
            "appointmentForm"
          ),

        selectedName:
          document.getElementById(
            "selectedDoctor"
          ),

        selectedSpecialization:
          document.getElementById(
            "selectedSpecialization"
          ),

        selectedRate:
          document.getElementById(
            "selectedRate"
          ),

        appointmentFeeDisplay:
          document.getElementById(
            "appointmentFeeDisplay"
          ),


        /* Ambulance modal */

        ambulanceModal:
          document.getElementById(
            "ambulanceModal"
          ),

        ambulanceModalClose:
          document.getElementById(
            "closeAmbulanceModal"
          ),

        ambulanceForm:
          document.getElementById(
            "ambulanceForm"
          ),

        selectedAmbulance:
          document.getElementById(
            "selectedAmbulance"
          ),

        selectedAmbulanceInfo:
          document.getElementById(
            "selectedAmbulanceInfo"
          ),

        distanceKm:
          document.getElementById(
            "distanceKm"
          ),

        ambulanceFareEstimate:
          document.getElementById(
            "ambulanceFareEstimate"
          ),


        /* Emergency */

        sosButton:
          document.getElementById(
            "sosButton"
          ),

        emergencyFab:
          document.getElementById(
            "emergencyFab"
          ),


        /* Confirmation */

        successPanel:
          document.getElementById(
            "successMessage"
          ),

        successIcon:
          document.getElementById(
            "successIcon"
          ),

        successTitle:
          document.getElementById(
            "successTitle"
          ),

        confirmationText:
          document.getElementById(
            "confirmationText"
          ),

        doneButton:
          document.getElementById(
            "doneButton"
          ),

      }
    );

  }


  /* =========================================================
     EVENTS
  ========================================================= */

  function wireEvents() {


    /* Doctor search */

    el.doctorSearch?.addEventListener(
      "input",
      debounce(() =>
        renderRoster("doctor")
      )
    );


    /* Doctor search button */

    el.searchButton?.addEventListener(
      "click",
      () => {

        renderRoster("doctor");


        document
          .getElementById(
            "doctors"
          )
          ?.scrollIntoView({
            behavior:
              "smooth",
          });

      }
    );


    /* Nurse search */

    el.nurseSearch?.addEventListener(
      "input",
      debounce(() =>
        renderRoster("nurse")
      )
    );


    /* Doctor / Nurse / Ambulance buttons */

    el.doctorsList?.addEventListener(
      "click",
      handleRosterClick
    );

    el.nursesList?.addEventListener(
      "click",
      handleRosterClick
    );

    el.ambulanceList?.addEventListener(
      "click",
      handleRosterClick
    );


    /* Cancel booking */

    el.appointmentsList?.addEventListener(
      "click",
      (event) => {

        const button =
          event.target.closest(
            "[data-cancel]"
          );


        if (!button) return;


        if (
          !confirm(
            "Are you sure you want to cancel this?"
          )
        ) {

          return;

        }


        const ref =
          button.dataset.cancel;


        state.bookings =
          state.bookings.filter(
            (booking) =>
              booking.ref !== ref
          );


        bus.emit(
          "booking:cancelled",
          ref
        );

      }
    );


    /* Payment methods */

    wirePaymentPicker(
      document.getElementById(
        "appointmentPaymentMethods"
      )
    );


    wirePaymentPicker(
      document.getElementById(
        "ambulancePaymentMethods"
      )
    );


    /* Close appointment modal */

    el.modalClose?.addEventListener(
      "click",
      closeBookingModal
    );


    /* Close ambulance modal */

    el.ambulanceModalClose?.addEventListener(
      "click",
      closeAmbulanceModal
    );


    /* Distance */

    el.distanceKm?.addEventListener(
      "input",
      refreshAmbulanceFare
    );


    /* SOS */

    el.sosButton?.addEventListener(
      "click",
      openDefaultAmbulanceModal
    );


    /* Emergency floating button */

    el.emergencyFab?.addEventListener(
      "click",
      openDefaultAmbulanceModal
    );


    /* Click outside modal */

    window.addEventListener(
      "click",
      (event) => {

        if (
          event.target ===
          el.modal
        ) {

          closeBookingModal();

        }


        if (
          event.target ===
          el.ambulanceModal
        ) {

          closeAmbulanceModal();

        }

      }
    );


    /* Forms */

    el.form?.addEventListener(
      "submit",
      handleAppointmentSubmit
    );


    el.ambulanceForm?.addEventListener(
      "submit",
      handleAmbulanceSubmit
    );


    /* Done */

    el.doneButton?.addEventListener(
      "click",
      () => {

        if (
          el.successPanel
        ) {

          el.successPanel.style.display =
            "none";

        }

      }
    );

  }


  /* =========================================================
     INITIALIZE
  ========================================================= */

  function init() {

    cacheElements();

    wireEvents();

    renderRoster("doctor");

    renderRoster("nurse");

    renderAmbulances();

    renderBookings();

    initNavSpy();

  }


  /* =========================================================
     START
  ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }


  /* =========================================================
     PUBLIC API
  ========================================================= */

  return {

    bookAppointment: (name) => {

      const person =
        findByName(
          "doctor",
          name
        );


      if (person) {

        openBookingModal(
          person,
          "doctor"
        );

      }

    },


    bookNurseAppointment: (
      name
    ) => {

      const person =
        findByName(
          "nurse",
          name
        );


      if (person) {

        openBookingModal(
          person,
          "nurse"
        );

      }

    },

  };

})();


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

const bookAppointment =
  SmartCare.bookAppointment;


const bookNurseAppointment =
  SmartCare.bookNurseAppointment;