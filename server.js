const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

// Middleware untuk file statis
app.use(express.static(__dirname));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/audio', express.static(path.join(__dirname, 'audio')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({ extended: true }));

// Data kuis
const quizData = {
  questions: [
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
  ],
  jokes: {
    correct: [
            "Admin yakin cuma asal tebak",
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
  }
};

// Data hasil skor
const scoreMessages = {
  low: {
    title: "Runtuh",
    message: "Skornya kaya bangunan tanpa pondasi"
  },
  medium: {
    title: "Seret",
    message: "Jalan sih... tapi kaya narik kulkas naik tangga"
  },
  high: {
    title: "Petualang Handal!",
    message: "Not bad, tapi ga bikin orang tepuk tangan juga"
  },
  excellent: {
    title: "Overpower",
    message: "Udah di level ini, sisanya cuma nunggu orang iri"
  }
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'quiz.html'));
});

app.get('/quiz/:category', (req, res) => {
  res.sendFile(path.join(__dirname, 'quiz.html'));
});

app.get('/api/questions', (req, res) => {
   res.json({
        questions: quizData.questions,
        jokes: quizData.jokes
   });
});

// API untuk mendapatkan hasil skor berdasarkan nilai
app.get('/api/score-result/:score/:total', (req, res) => {
  const score = parseInt(req.params.score);
  const total = parseInt(req.params.total);
  const percentage = (score / total) * 100;
 
  let result;
  if (percentage <= 33) {
    result = scoreMessages.low;
  } else if (percentage <= 66) {
    result = scoreMessages.medium;
  } else if (percentage <= 85) {
    result = scoreMessages.high;
  } else {
    result = scoreMessages.excellent;
  }
 
  res.json(result);
});

app.post('/api/submit', (req, res) => {
  // Handle quiz submission and scoring
  const userAnswers = req.body.answers;
  let score = 0;
 
  userAnswers.forEach((answer, index) => {
    if (answer == quizData.questions[index].correctAnswer) {
      score++;
    }
  });
 
  res.json({ score: score, total: quizData.questions.length });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});