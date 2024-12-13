const birthdayList = document.querySelector(".birthday-list")
const nameInput = document.querySelector(".name-input")
const dateInput = document.querySelector(".date-input")
const image = document.querySelector(".birthday-cake")
const quote = document.querySelector(".empty-state span")

let usersDetails = JSON.parse(localStorage.getItem('usersDetails')) || []
let id = usersDetails.length ? Math.max(usersDetails.map(user => user.id)) + 1 : 0

const today = new Date()
const formattedDate = 
`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}
-${today.getDate().toString().padStart(2, '0')}`

const addReminder = () => {
    const userName = nameInput.value.trim()
    const date = dateInput.value
    if (userName && date) {
        const item = document.createElement("li")
        item.className = 'birthday-list-item'
        item.innerHTML = `
            <span>${userName} - ${date}</span>
            <button class="delete-btn">
                <i class="material-symbols-outlined">delete</i>
            </button>
        `
        birthdayList.appendChild(item)

        usersDetails.push({id: id, name: userName, date: date})
        localStorage.setItem('usersDetails', JSON.stringify(usersDetails))
        id++

        image.style.display = "none"
        quote.style.display = "none"

        item.querySelector(".delete-btn").addEventListener("click", () => {
            birthdayList.removeChild(item)
            usersDetails = usersDetails.filter(user => user.id !== parseInt(item.dataset.id, 10))
            localStorage.setItem('usersDetails', JSON.stringify(usersDetails))
            if (usersDetails.length === 0) {
                image.style.display = "block"
                quote.style.display = "block"
            }
        })

        nameInput.value = ""
        dateInput.value = ""
    } else {
        window.alert("Please fill in both the name and birthday date to set a reminder")
    }
}

function showAlertNotification(users) {
    alert(`Reminder: It's ${users.join(', ')}'s birthday today!`)
}

function checkAndTriggerAlerts() {
    let todaysBirthdays = usersDetails.filter(user => user.date === formattedDate)
    .map(user => user.name)
    if (todaysBirthdays.length > 0) {
        showAlertNotification(todaysBirthdays)
        clearInterval(intervalId)
    }
}

function loadReminders() {
    if (usersDetails.length > 0) {
        image.style.display = "none";
        quote.style.display = "none";
        usersDetails.forEach(user => {
            const item = document.createElement("li");
            item.className = 'birthday-list-item';
            item.innerHTML = `
                <span>${user.name} - ${user.date}</span>
                <button class="delete-btn">
                    <i class="material-symbols-outlined">delete</i>
                </button>
            `;
            birthdayList.appendChild(item);

            item.querySelector(".delete-btn").addEventListener("click", () => {
                birthdayList.removeChild(item);
                usersDetails = usersDetails.filter(u => u.id !== user.id);
                localStorage.setItem('usersDetails', JSON.stringify(usersDetails));
                if (usersDetails.length === 0) {
                    image.style.display = "block";
                    quote.style.display = "block";
                }
            });
        });
    }
}

loadReminders()

let intervalId = setInterval(checkAndTriggerAlerts, 1000)