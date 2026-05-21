// Quiz data (will be fetched from server)
let quizData = {
    questions: [],
    jokes: {}
};




// DOM elements
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const progressElement = document.getElementById('progress-text');
const coffeeProgress = document.getElementById('coffee-progress');
const jokeContainer = document.getElementById('joke-container');
const jokeText = document.getElementById('joke-text');
const resultsContainer = document.getElementById('results-container');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const playAgainBtn = document.getElementById('play-again-btn');
const scoreValue = document.getElementById('score-value');
const totalQuestions = document.getElementById('total-questions');
const levelIndicator = document.getElementById('level-indicator');
const timerText = document.getElementById('timer-text');
const timerProgress = document.querySelector('.timer-circle-progress');
const questionContainer = document.getElementById('question-container');




// Audio elements
let correctSound, wrongSound, timeoutSound, levelupSound, backgroundMusicQuiz;
let audioElementsInitialized = false;




// Quiz state
let currentQuestion = 0;
let score = 0;
let questions = [];
let jokes = {};
let timer;
let timeLeft = 15;
let soundEnabled = true;
let musicEnabled = true;
let jokeTimer = null;




// ==================== AUDIO FUNCTIONS ====================




function initializeAudioElements() {
    if (audioElementsInitialized) return;


    try {
        correctSound = document.getElementById('correct-sound');
        wrongSound = document.getElementById('wrong-sound');
        timeoutSound = document.getElementById('timeout-sound');
        levelupSound = document.getElementById('levelup-sound');
        backgroundMusicQuiz = document.getElementById('background-music-quiz');


        // Add error handling for audio files
        const audioElements = [correctSound, wrongSound, timeoutSound, levelupSound, backgroundMusicQuiz];
        audioElements.forEach(audio => {
            if (audio) {
                audio.addEventListener('error', function () {
                    console.warn(`Audio file not found: ${audio.src}`);
                    if (audio !== backgroundMusicQuiz) {
                        soundEnabled = false;
                        localStorage.setItem('soundEnabled', 'false');
                        updateSoundButton();
                    } else {
                        musicEnabled = false;
                        localStorage.setItem('musicEnabled', 'false');
                        updateMusicButton();
                    }
                });
            }
        });


        audioElementsInitialized = true;
    } catch (error) {
        console.error("Error initializing audio elements:", error);
        soundEnabled = false;
        musicEnabled = false;
    }
}




function playSound(soundElement) {
    if (!soundEnabled || !soundElement) return;


    try {
        soundElement.currentTime = 0;
        soundElement.play().catch(error => {
            console.log("Audio play error: ", error);
        });
    } catch (error) {
        console.error("Error playing sound:", error);
    }
}




function updateSoundButton() {
    const soundToggleQuiz = document.getElementById('sound-toggle-quiz');
    if (soundToggleQuiz) {
        if (soundEnabled) {
            soundToggleQuiz.innerHTML = '<i class="fas fa-bell"></i> Sounds';
            soundToggleQuiz.classList.add('active');
        } else {
            soundToggleQuiz.innerHTML = '<i class="fas fa-bell-slash"></i> Sounds';
            soundToggleQuiz.classList.remove('active');
        }
    }
}




function updateMusicButton() {
    const musicToggleQuiz = document.getElementById('music-toggle-quiz');
    if (musicToggleQuiz) {
        if (musicEnabled) {
            musicToggleQuiz.innerHTML = '<i class="fas fa-volume-up"></i> Music';
            musicToggleQuiz.classList.add('active');
        } else {
            musicToggleQuiz.innerHTML = '<i class="fas fa-volume-mute"></i> Music';
            musicToggleQuiz.classList.remove('active');
        }
    }
}




// ==================== QUIZ INITIALIZATION ====================




function initializeQuiz() {
    // Get user preferences
    soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    musicEnabled = localStorage.getItem('musicEnabled') !== 'false';


    // Initialize audio elements
    initializeAudioElements();


    // Setup audio controls
    setupAudioControls();


    // Use fallback data directly (no fetch)
    useFallbackData();
}




function setupAudioControls() {
    const musicToggleQuiz = document.getElementById('music-toggle-quiz');
    const soundToggleQuiz = document.getElementById('sound-toggle-quiz');


    if (musicToggleQuiz) {
        if (musicEnabled && backgroundMusicQuiz) {
            backgroundMusicQuiz.play().catch(e => console.log("Autoplay prevented: ", e));
        }
        updateMusicButton();


        musicToggleQuiz.onclick = function () {
            if (backgroundMusicQuiz) {
                if (backgroundMusicQuiz.paused) {
                    backgroundMusicQuiz.play();
                    musicEnabled = true;
                } else {
                    backgroundMusicQuiz.pause();
                    musicEnabled = false;
                }
                localStorage.setItem('musicEnabled', musicEnabled.toString());
                updateMusicButton();
            }
        };
    }


    if (soundToggleQuiz) {
        updateSoundButton();


        soundToggleQuiz.onclick = function () {
            soundEnabled = !soundEnabled;
            localStorage.setItem('soundEnabled', soundEnabled.toString());
            updateSoundButton();


            // Test sound when enabling
            if (soundEnabled) {
                playSound(correctSound);
            }
        };
    }
}




function useFallbackData() {
    questions = [
        {
            id: 1,
            question: "Negara berpenduduk terbanyak di dunia saat ini adalah …",
            options: ["Amerika Serikat", "India", " China"],
            correctAnswer: 1,
            level: 1
        },
        {
            id: 2,
            question: "Fungsi utama lapisan ozon adalah …",
            options: ["Mengatur suhu", "Menyerap UV", "Menghasilkan oksigen"],
            correctAnswer: 1,
            level: 1
        },
        {
            id: 3,
            question: "Tokoh proklamator Indonesia selain Soekarno adalah",
            options: ["Mohammad Hatta", "Sutan Sjahrir", "Ahmaad Yani"],
            correctAnswer: 0,
            level: 1
        },
        {
            id: 4,
            question: "Alat pencatat gempa bumi disebut …",
            options: ["Barometer", "Termometer", "Seismograf"],
            correctAnswer: 2,
            level: 2
        },
        {
            id: 5,
            question: "Bahasa internasional paling umum digunakan adalah",
            options: ["Mandarin", "Spanyol", "Inggris"],
            correctAnswer: 2,
            level: 2
        },
        {
            id: 6,
            question: "Lembaga penguji UU terhadap UUD 1945 adalah …",
            options: ["DPR", "MPR", "Mahkamah Konstitusi"],
            correctAnswer: 2,
            level: 2
        },
        {
            id: 7,
            question: "Planet terpanas di tata surya adalah …",
            options: ["Merkurius", "Venus", "Mars"],
            correctAnswer: 1,
            level: 3
        },
        {
            id: 8,
            question: "Tokoh teori relativitas adalah …",
            options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei"],
            correctAnswer: 1,
            level: 3
        },
        {
            id: 9,
            question: "Sungai terpanjang yang menyaingi Nil adalah …",
            options: ["Amazon", "Yangtze", "Mekong"],
            correctAnswer: 0,
            level: 3
        },
        {
            id: 10,
            question: "Lambang kimia Na berasal dari bahasa Latin …",
            options: ["Nitrogen", "Natrium", "Garam dapur"],
            correctAnswer: 1,
            level: 4
        },
        {
            id: 11,
            question: "Benua dengan negara paling sedikit adalah …",
            options: ["Asia", "Eropa", "Australia"],
            correctAnswer: 2,
            level: 4
        },
        {
            id: 12,
            question: "Kepanjangan CPU dalam komputer adalah …",
            options: ["Central Processing Unit", "Control Program Unit", "Computer Power Unit"],
            correctAnswer: 0,
            level: 4
        },
        {
            id: 13,
            question: "Perubahan padat langsung ke gas disebut …",
            options: ["Menguap", "Mengembun", "Menyublim"],
            correctAnswer: 2,
            level: 5
        },
        {
            id: 14,
            question: "Alat musik bambu dari Jawa Barat adalah …",
            options: ["Gamelan", "Angklung", "Sasando"],
            correctAnswer: 1,
            level: 5
        },
        {
            id: 15,
            question: "Organ penyaring darah pada manusia adalah …",
            options: ["Paru-paru", "Jantung", "Ginjal"],
            correctAnswer: 2,
            level: 5
        }
    ];


    jokes = {
        correct: [
            "Aku yakin cuma asal tebak",
            "Sekali-sekali otakmu kerja juga ya'",
            "Jangan kaget, mungkin kecelakaan logika",
            "Ntah pintar ntah hoki",
            "Kayanya otakmu kebetulan nyala bentar"
        ],
        wrong: [
            "Tenang, itu mah kamu ngaco doang",
            "Coba lagi deh, sekarang pake otak yaa",
            "Gapapa salah, at least pede jawab, respect",
            "Meleset yahaha, admin ketawa barusan",
            "Salah, jelas banget salahnya"
        ],
        levelUp: [
            "Lanjut! otakmu lagi mode trial premium",
            "Level up detected!, baterai otak 7%",
            "Congrats, naik level, bedanya apa? kagak ada",
            "Level naik, IQ loading",
            "Level baru kebuka, isinya sama aja"
        ]
    };


    totalQuestions.textContent = questions.length;
    startQuiz();
}




// ==================== QUIZ FUNCTIONS ====================




function startQuiz() {
    currentQuestion = 0;
    score = 0;


    // Reset UI state
    resetQuizUI();
    loadQuestion();
}




function resetQuizUI() {
    // Hide all containers
    questionContainer.classList.add('hidden');
    optionsContainer.classList.add('hidden');
    jokeContainer.classList.add('hidden');
    resultsContainer.classList.add('hidden');
    levelIndicator.classList.add('hidden');


    // Show question elements
    questionContainer.classList.remove('hidden');
    optionsContainer.classList.remove('hidden');
    levelIndicator.classList.remove('hidden');


    // Reset progress
    coffeeProgress.style.height = '0%';
    progressElement.textContent = '0/' + questions.length;
    scoreValue.textContent = '0';
}




function loadQuestion() {
    // Clear any existing timers
    clearInterval(timer);
    clearTimeout(jokeTimer);


    // Check if quiz is finished
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }


    const question = questions[currentQuestion];


    // Update UI
    questionElement.textContent = question.question;
    updateLevelIndicator(question.level);
    clearOptions();
    createOptions(question.options);
    updateProgress();


    // Show UI elements with a small delay for smooth transition
    setTimeout(() => {
        questionContainer.classList.remove('hidden');
        optionsContainer.classList.remove('hidden');
        jokeContainer.classList.add('hidden');
    }, 100);


    startTimer();
}

function updateLevelIndicator(level) {
    const levelTexts = {
        1: "Level 1: Pagi santai",
        2: "Level 2: Siang tenang",
        3: "Level 3: Sore asik",
        4: "Level 4: Malam tenang",
        5: "Level 5: Angin lembut"
    };


    levelIndicator.textContent = levelTexts[level] || `Level ${level}`;
}

function clearOptions() {
    optionsContainer.innerHTML = '';
}

function createOptions(options) {
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(button);
    }); // Menutup forEach dengan });
}

function updateProgress() {
    const progress = ((currentQuestion) / questions.length) * 100;
    coffeeProgress.style.height = `${progress}%`;
    progressElement.textContent = `${currentQuestion}/${questions.length}`;
}

function startTimer() {
    timeLeft = 15;
    timerText.textContent = timeLeft;
    timerProgress.style.strokeDashoffset = 0;
    timerProgress.style.stroke = '#8b4513';
    timerText.classList.remove('timer-warning');

    timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;

        // Update circular progress
        const offset = 283 - (timeLeft / 15 * 283);
        timerProgress.style.strokeDashoffset = offset;

        // Warning when time is running out
        if (timeLeft <= 5) {
            timerText.classList.add('timer-warning');
            timerProgress.style.stroke = '#ff6b6b';
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function timeUp() {
    const options = optionsContainer.children;
    const question = questions[currentQuestion];

    // Disable all buttons
    Array.from(options).forEach(option => {
        option.disabled = true;
    });

    // Show correct answer
    options[question.correctAnswer].classList.add('correct');

    // Play timeout sound
    playSound(timeoutSound);

    // Hide question and show joke after delay
    setTimeout(() => {
        questionContainer.classList.add('hidden');
        optionsContainer.classList.add('hidden');
        showJoke('wrong');
    }, 800);
}

function selectAnswer(selectedIndex) {
    clearInterval(timer);

    const question = questions[currentQuestion];
    const options = optionsContainer.children;

    // Disable all buttons
    Array.from(options).forEach(option => {
        option.disabled = true;
    });

    // Check answer
    const isCorrect = selectedIndex === question.correctAnswer;

    if (isCorrect) {
        options[selectedIndex].classList.add('correct');
        score++;
        playSound(correctSound);
    } else {
        options[selectedIndex].classList.add('wrong');
        options[question.correctAnswer].classList.add('correct');
        playSound(wrongSound);

        // Add cricket animation
        const cricketSpan = document.createElement('span');
        cricketSpan.textContent = ' ';
        cricketSpan.style.animation = 'cricket 0.5s infinite';
        options[selectedIndex].appendChild(cricketSpan);
    }

    // Update score
    scoreValue.textContent = score;
    scoreValue.classList.add('pulse');
    setTimeout(() => scoreValue.classList.remove('pulse'), 500);

    // Hide question and show joke after a small delay
    setTimeout(() => {
        questionContainer.classList.add('hidden');
        optionsContainer.classList.add('hidden');
        showJoke(isCorrect ? 'correct' : 'wrong');
    }, 1000); // Tunggu 1 detik sebelum show joke
}

function showJoke(type) {
    const jokeArray = jokes[type];
    const randomJoke = jokeArray[Math.floor(Math.random() * jokeArray.length)];

    jokeText.textContent = randomJoke;

    // Hapus class hidden dan tambah class visible
    jokeContainer.classList.remove('hidden');
    jokeContainer.classList.add('visible');

    // Clear any existing timer
    clearTimeout(jokeTimer);

    // Move to next question after 3 seconds
    jokeTimer = setTimeout(() => {
        jokeContainer.classList.remove('visible');
        jokeContainer.classList.add('hidden');
        currentQuestion++;

        if (currentQuestion < questions.length) {
            // Small delay before loading next question
            setTimeout(() => {
                loadQuestion();
            }, 300);
        } else {
            showResults();
        }
    }, 3000);
}

function showResults() {
    // Hide all quiz elements
    questionContainer.classList.add('hidden');
    optionsContainer.classList.add('hidden');
    jokeContainer.classList.add('hidden');
    levelIndicator.classList.add('hidden');

    // Show results
    resultsContainer.classList.remove('hidden');
    coffeeProgress.style.height = '100%';
    progressElement.textContent = `${questions.length}/${questions.length}`;
    scoreValue.textContent = score;

    // Determine result message
    const percentage = (score / questions.length) * 100;
    let title, message;

    if (percentage <= 33) {
        title = "Runtuh";
        message = "Skornya kaya bangunan tanpa pondasi";
    } else if (percentage <= 66) {
        title = "Seret";
        message = "Jalan sih... tapi kaya narik kulkas naik tangga";
    } else if (percentage <= 85) {
        title = "Stabil";
        message = "Not bad, tapi ga bikin orang tepuk tangan juga";
    } else {
        title = "Overpower";
        message = "Udah di level ini, sisanya cuma nunggu orang iri";
    }

    resultTitle.textContent = title;
    resultMessage.textContent = message;
}

// ==================== EVENT LISTENERS ====================

if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
        resultsContainer.classList.add('hidden');
        levelIndicator.classList.remove('hidden');
        startQuiz();
    });
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('quiz')) {
        initializeQuiz();
    }
});