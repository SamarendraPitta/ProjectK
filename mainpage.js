

const glowingText = (() => {
    const startGlowing = () => {
        const textElement = document.getElementById('glowing_text');
        let coloredText;
        let index = 0;

        setInterval(() => {
            const letters = textElement.textContent.split('');
            if (letters[index] == ' ') {
                index++;
            }
            letters[
                index
            ] = `<span style="color: var(--glowColor); text-shadow: var(--shadowColor);">${letters[index]}</span>`;
            coloredText = letters.join('');
            textElement.innerHTML = coloredText;
            index = (index + 1) % letters.length;
        }, 500);
    };

    return startGlowing;
})();

document.addEventListener('DOMContentLoaded', glowingText);


document.addEventListener("DOMContentLoaded", function () {

    var timelineData = [
        {
            step: "1",
            title: "Get in Touch",
            description: "Reach out to us either by filling out the form or giving us a call to initiate the conversation.\nLet's plan your dream vacation together.\nOur dedicated team is ready to assist you at every step."
        },
        {
            step: "2",
            title: "Select Your Vehicle",
            description: "Specify your preferences and requirements.\nStep 1: Choose your desired car.\nStep 2: Indicate your Pick-Up and Drop-Off locations along with your travel dates.\nWe'll assist you in finding the perfect vehicle."
        },
        {
            step: "3",
            title: "Customize Your Trip",
            description: "We'll collaborate with you to tailor your travel experience according to your needs and desires.\nPersonalize your itinerary with our expert guidance.\nExplore our range of customizable options to make your trip truly unforgettable."
        },
        {
            step: "4",
            title: "Booking Confirmed!😊",
            description: "Your booking process is now complete!\nSit back, relax, and get ready for a delightful vacation ahead.\nFeel free to contact us for any further assistance.\nWe're here to ensure your journey is seamless and enjoyable."
        }
    ];


    function createTimelineItem(step, title, description) {
        var mainTimeline = document.querySelector('.main-timeline');
        var timelineDiv = document.createElement('div');
        timelineDiv.className = 'timeline';

        var timelineContent = `
            <div class="timeline-icon"><span class="step">${step}</span></div>
            <div class="timeline-content">
                <h3 class="title">${title}</h3>
                <p class="description">${description}</p>
            </div>
        `;
        timelineDiv.innerHTML = timelineContent;
        mainTimeline.appendChild(timelineDiv);
    }

    timelineData.forEach(function (item) {
        createTimelineItem(item.step, item.title, item.description);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var submitForm = document.getElementById('submitForm');
    var submitBtn = document.getElementById('submitBtn');
    var submitMessage = document.getElementById('submitMessage');

    submitMessage.addEventListener('submit', function (event) {

        event.preventDefault();

        setTimeout(function () {
            submitMessage.style.display = 'block';
        }, 1000);
    });
});

function toggleNav() {
    var overlay = document.getElementById("myNav");
    var navButton = document.getElementById("hamIcon");
    if (overlay.style.height === "100%") {
        overlay.style.height = "0%";
        navButton.classList.remove('active');
    } else {
        overlay.style.height = "100%";
        navButton.classList.add('active');
    }
}


function submitformmodal() {

    var name = document.getElementById("name").value;
    var phoneNumber = document.getElementById("phonenumber").value;
    var dojdate = document.getElementById("dojdate").value;
    var dropdate = document.getElementById("dropdate").value;
    var carType = document.getElementById("car_type").value;
    var passengerCount = document.getElementById("passenger_count").value;
    var email = document.getElementById("email").value;
    var pickupLocation = document.getElementById("pickup_location").value;
    var dropoffLocation = document.getElementById("dropoff_location").value;
    var needAccommodation = document.getElementById("need_accomodation").checked;


    var formData = {
        "name": name,
        "PhoneNumber": phoneNumber,
        "dojdate": dojdate,
        "dropdate": dropdate,
        "car_type": carType,
        "passenger_count": passengerCount,
        "email": email,
        "pickup_location": pickupLocation,
        "dropoff_location": dropoffLocation,
        "need_accommodation": needAccommodation
    };

    fetch('/submitmodalform', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                document.getElementById("submitMessage").style.display = 'block';
            } else {
                console.error('Error submitting form data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error submitting form data:', error);
        });
    document.getElementById("submitform").reset();
}


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('mainpageformid');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);

        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        fetch('http://127.0.0.1:5500/mainformdata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
            .then((response, err) => {
                if (response.ok) {
                    console.log('Form data submitted successfully');
                } else {
                    console.log(response.body)
                    console.error('Error submitting form data', err);
                }
            })
            .catch(error => {
                console.error('Error submitting form data:', error);
            });
    });
    document.getElementById('mainpageformid').reset();
});


function contactpagebooking() {
    var name = document.getElementById("name").value;
    var phonenum = document.getElementById("phoneNumber").value;
    var email = document.getElementById("email").value;
    var comment = document.getElementById("comment").value;

    var jsondata = {
        'name': name,
        'phoneNumber': phonenum,
        'email': email,
        'comment': comment
    };

    fetch('http://127.0.0.1:5500/contactpagebooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsondata)
    })
        .then(response => {
            if (response.ok) {
                document.getElementById("submitMessage").textContent = "Data submitted successfully.";
                alert("Data submitted");
            }
        })
        .catch(error => {
            console.log("error", error);
        });
}


var isScrollingPaused = false;

function pauseScrolling() {
    isScrollingPaused = true;
}

function resumeScrolling() {
    isScrollingPaused = false;
}

document.addEventListener('DOMContentLoaded', function () {
    function createFlipCard(imageSrc) {
        var flipCard = document.createElement("div");
        flipCard.classList.add("flip-card");

        var flipCardInner = document.createElement("div");
        flipCardInner.classList.add("flip-card-inner");

        var flipCardFront = document.createElement("div");
        flipCardFront.classList.add("flip-card-front");

        var img = document.createElement("img");
        img.src = imageSrc;
        img.alt = "Image";
        img.style.width = "100%";
        img.style.height = "100%";

        flipCardFront.appendChild(img);

        var flipCardBack = document.createElement("div");
        flipCardBack.classList.add("flip-card-back");
        flipCardBack.textContent = "Description";

        flipCardInner.appendChild(flipCardFront);
        flipCardInner.appendChild(flipCardBack);

        flipCard.appendChild(flipCardInner);

        return flipCard;
    }

    var templesContainer = document.querySelector(".templescontainer");
    var templeImages = ["talakona.jpg", "kanipakam.jpg", "sri kalahasthi.jpg", "iskon.jpg", "kapilatheertham.jpg", "Tiruchanoor_padmavathi_temple.jpg", "srinivasa_Mangapuram.jpg"];
    templeImages.forEach(function (imageSrc) {
        var flipCard = createFlipCard(imageSrc);
        templesContainer.appendChild(flipCard);
    });

    var placesContainer = document.querySelector(".placesContainer");
    var placeImages = ["talakona.jpg", "kanipakam.jpg", "sri kalahasthi.jpg", "iskon.jpg", "kapilatheertham.jpg", "Tiruchanoor_padmavathi_temple.jpg", "srinivasa_Mangapuram.jpg"];
    placeImages.forEach(function (imageSrc) {
        var flipCard = createFlipCard(imageSrc);
        placesContainer.appendChild(flipCard);
    });

});

