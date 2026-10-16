# Permintaan Proyek Koding Website

## 1. Gambaran Umum Proyek (Overview)
* **Nama Proyek:** [LARAVEL-IO]
* **Tujuan Utama:** [Website ini dibuat awalnya untuk proyek pribadi tapi saya ada gambaran agar bisa digunakan untuk pengguna luas nantinya. website untuk IoT dengan komunikasi dengan message broker seperti RabbitMQ dengan protokol MQTT nya ]
* **Target Pengguna:** [awal pengembangan untuk pribadi, tapi buatlah interface/blueprint untuk skalabilitas dan kemudahan pengembangan nantinya]

## 2. Teknologi yang Digunakan (Tech Stack)
* **Teknologi:** [Laravel Versi terbaru dengan starterkit React Shadcn(defaultnya Laravel starterkit)]]
* **Penyimpanan Data (jika ada):** [Lokal]
* **Database:** [MySQL]

## 3. Fitur Utama (Core Features)
* [x] **Fitur 1:** [Dapat menambahkan device IoT dengan memasukkan nama device dan deskripsi singkat]
* [x] **Fitur 2:** [setiap device IoT dapat ditambahkan topik Message broker nya(untuk ini optimasikan untuk RabbitMQ) memasukkan Routing Key, Payload(payload ini punya opsi berupa string, atau switch(0, 1/ ON/OFF), opsi terbalik(soalnya board IoT ada yang logika wirednya kebalik(HIGH malah mati LOW malah hidup contohnya))), dan bisa atur jadwal eksekusi(jadwal buat se custom mungkin) eksekusi ]
* [x] **Fitur 3:** [Buat 1 migrasi akun admin dengan username: admin password: Indonesia]

## 4. Catatan
* karena rencana nantinya proyek ini akan bisa besar dikembangkan, maka buat kodenya modular, enak di develop, dimudahkan penambahan fitur tanpa merusak core kode DLL. gunakan teknik progammer professional
* tidak perlu buat comment panjang panjang, buat comment jika nama variabel dan fungsi sangat ambigu
