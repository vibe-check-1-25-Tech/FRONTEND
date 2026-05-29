
console.log("profile.js connected")


// =========================
// API URL
// =========================

const API_URL =
    "http://localhost:8080/api"


// =========================
// API
// =========================

async function getProfile() {

    try {

        const token =
            localStorage.getItem("token")

        const response =
            await fetch(
                `${API_URL}/profile`,
                {
                    method: "GET",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    }
                }
            )

        if (!response.ok) {

            throw new Error(
                "Ошибка загрузки профиля"
            )
        }

        return await response.json()

    } catch (err) {

        console.error(
            "GET PROFILE ERROR:",
            err
        )

        return null
    }
}


async function updateProfile(data) {

    try {

        const token =
            localStorage.getItem("token")

        const response =
            await fetch(
                `${API_URL}/profile`,
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    },

                    body:
                        JSON.stringify(data)
                }
            )

        if (!response.ok) {

            throw new Error(
                "Ошибка обновления"
            )
        }

        return await response.json()

    } catch (err) {

        console.error(
            "UPDATE PROFILE ERROR:",
            err
        )

        return null
    }
}


async function getMoods() {

    try {

        const token =
            localStorage.getItem("token")

        const response =
            await fetch(
                `${API_URL}/moods`,
                {
                    method: "GET",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token
                    }
                }
            )

        if (!response.ok) {

            throw new Error(
                "Ошибка moods"
            )
        }

        return await response.json()

    } catch (err) {

        console.error(
            "MOODS ERROR:",
            err
        )

        return []
    }
}


// =========================
// LOAD PROFILE
// =========================

async function loadProfileData() {

    try {

        const profile =
            await getProfile()

        console.log(
            "PROFILE:",
            profile
        )

        if (!profile) return


        // =========================
        // NAME
        // =========================

        document.getElementById(
            "userName"
        ).value =
            profile.name || ""


        // =========================
        // EMAIL
        // =========================

        document.getElementById(
            "userEmail"
        ).value =
            profile.email || ""


        // =========================
        // PHONE
        // =========================

        document.getElementById(
            "userPhone"
        ).value =
            profile.phone || ""


        // =========================
        // AVATAR
        // =========================

        if (profile.avatar) {

            document.getElementById(
                "avatarImg"
            ).src =
                profile.avatar
        }

    } catch (err) {

        console.error(
            "LOAD PROFILE ERROR:",
            err
        )
    }
}


// =========================
// SAVE PROFILE
// =========================

async function saveProfile() {

    const name =
        document.getElementById(
            "userName"
        ).value

    const email =
        document.getElementById(
            "userEmail"
        ).value

    const phone =
        document.getElementById(
            "userPhone"
        ).value

    const avatar =
        document.getElementById(
            "avatarImg"
        ).src


    // =========================
    // PASSWORD
    // =========================

    const currentPassword =
        document.getElementById(
            "currentPassword"
        ).value

    const newPassword =
        document.getElementById(
            "newPassword"
        ).value

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value

    const passwordError =
        document.getElementById(
            "passwordError"
        )

    passwordError.textContent =
        ""


    if (
        newPassword ||
        confirmPassword
    ) {

        if (
            newPassword.length < 4
        ) {

            passwordError.textContent =
                "Минимум 4 символа"

            return
        }

        if (
            newPassword !==
            confirmPassword
        ) {

            passwordError.textContent =
                "Пароли не совпадают"

            return
        }
    }


    // =========================
    // REQUEST
    // =========================

    const body = {

        name:
            name,

        email:
            email,

        phone:
            phone,

        avatar:
            avatar,

        currentPassword:
            currentPassword,

        newPassword:
            newPassword
    }


    try {

        const result =
            await updateProfile(
                body
            )

        console.log(
            "SAVE RESULT:",
            result
        )

        if (!result) {

            alert(
                "Ошибка сохранения"
            )

            return
        }

        showToast(
            "✅ Профиль сохранён"
        )


        // CLEAR PASSWORDS

        document.getElementById(
            "currentPassword"
        ).value = ""

        document.getElementById(
            "newPassword"
        ).value = ""

        document.getElementById(
            "confirmPassword"
        ).value = ""

    } catch (err) {

        console.error(
            "SAVE PROFILE ERROR:",
            err
        )
    }
}


// =========================
// AVATAR
// =========================

const avatarUpload =
    document.getElementById(
        "avatarUpload"
    )

if (avatarUpload) {

    avatarUpload.addEventListener(
        "change",
        e => {

            const file =
                e.target.files[0]

            if (!file) return

            const reader =
                new FileReader()

            reader.onload =
                event => {

                    document.getElementById(
                        "avatarImg"
                    ).src =
                        event.target.result

                    showToast(
                        "✅ Аватар обновлён"
                    )
                }

            reader.readAsDataURL(
                file
            )
        }
    )
}


// =========================
// LOAD STATS
// =========================

async function loadStats() {

    try {

        const moods =
            await getMoods()

        console.log(
            "MOODS:",
            moods
        )

        const total =
            moods.length

        let avg = 0

        if (total > 0) {

            avg =
                (
                    moods.reduce(
                        (
                            sum,
                            mood
                        ) =>

                            sum +
                            Number(
                                mood.score || 0
                            ),

                        0
                    ) / total
                ).toFixed(1)
        }

        const bestScore =
            total > 0

            ? Math.max(
                ...moods.map(
                    mood =>
                        Number(
                            mood.score || 0
                        )
                )
            )

            : 0


        const moodEmoji = {

            1: "😢",
            2: "😐",
            3: "🙂",
            4: "😊",
            5: "😁"
        }


        document.getElementById(
            "totalEntries"
        ).textContent =
            total

        document.getElementById(
            "avgMood"
        ).textContent =
            avg

        document.getElementById(
            "bestMood"
        ).textContent =

            bestScore
                ? moodEmoji[
                    bestScore
                ]
                : "—"

    } catch (err) {

        console.error(
            "STATS ERROR:",
            err
        )
    }
}


// =========================
// TOAST
// =========================

function showToast(message) {

    const oldToast =
        document.querySelector(
            ".profile-toast"
        )

    if (oldToast) {

        oldToast.remove()
    }

    const toast =
        document.createElement(
            "div"
        )

    toast.className =
        "profile-toast"

    toast.innerHTML = `

        <i class="fas fa-check-circle"></i>

        ${message}
    `

    toast.style.position =
        "fixed"

    toast.style.bottom =
        "20px"

    toast.style.right =
        "20px"

    toast.style.background =
        "#3b1c5a"

    toast.style.color =
        "white"

    toast.style.padding =
        "14px 20px"

    toast.style.borderRadius =
        "14px"

    toast.style.zIndex =
        "9999"

    document.body.appendChild(
        toast
    )

    setTimeout(() => {

        toast.remove()

    }, 2500)
}


// =========================
// SAVE BUTTON
// =========================

document
    .getElementById(
        "saveProfileBtn"
    )
    .addEventListener(
        "click",
        saveProfile
    )


// =========================
// LOGOUT
// =========================

document
    .getElementById(
        "logoutBtn"
    )
    .addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Выйти из аккаунта?"
                )

            if (
                confirmLogout
            ) {

                localStorage.removeItem(
                    "token"
                )

                window.location.href =
                    "login.html"
            }
        }
    )


// =========================
// INIT
// =========================

loadProfileData()

loadStats()
