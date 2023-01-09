const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd  = $('.cd');
const player = $('.player');
const playBtn = $('.btn-toggle-play')
const repeatBtn = $('.btn-repeat');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        { 
            name: 'Đưa nhau đi trốn',
            singer: 'Đen vâu ft.Linh Cáo',
            path: './assets/music/1.mp3',
            image: './assets/img/1.png'
    
        },
        { 
            name: 'Cho tôi lang thang',
            singer: 'Đen vâu ft.Ngọt',
            path: './assets/music/2.mp3',
            image: './assets/img/2.png'
    
        },
        {
            name: 'Đi theo bóng Mặt Trời',
            singer: 'Đen vâu ft.Giang',
            path: './assets/music/3.mp3',
            image: './assets/img/3.png'
        },
        {
            name: 'Ta cứ đi cùng nhau',
            singer: 'Đen vâu ft.Linh Cáo',
            path: './assets/music/4.mp3',
            image: './assets/img/4.png'
        },
        {
            name: 'Bài này chill phết',
            singer: 'Đen vâu ft.Min',
            path: './assets/music/5.mp3',
            image: './assets/img/5.png'
        },
        {
            name: 'Tết đong đầy',
            singer: 'Kay Trần ft.Nguyễn Khoa',
            path: './assets/music/6.mp3',
            image: './assets/img/6.png'
        },
        {
            name: 'Tết này con sẽ về',
            singer: 'Bùi Công Nam',
            path: './assets/music/7.mp3',
            image: './assets/img/7.png'
        },
        {
            name: 'Mang tiền về cho mẹ',
            singer: 'Đen vâu',
            path: './assets/music/8.mp3',
            image: './assets/img/8.png'
        },
        {
            name: 'Đi về nhà',
            singer: 'Đen vâu ft.JustaTee',
            path: './assets/music/9.mp3',
            image: './assets/img/9.png'
        },
        {
            name: 'Đi để trở về',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/10.mp3',
            image: './assets/img/10.png'
        }   
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${ index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="thumb" style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="tittle">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    definedProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        // Xử lí CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform:'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        // Xử lí phóng to thu nhỏ cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        },

        // Xử lí khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

        },
        // khi song dc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()

        }
        // khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor( (audio.currentTime / audio.duration) * 100 )
                progress.value = progressPercent
            }
        }
        // Khi tua
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Khi random
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        };
        // Xử lí khi phát lại 1 song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        };
        // Next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        };
        // Lắng nghe hành vi kkhi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            // Xử lí khi c;ick vào song
            if (songNode || e.target.closest('.option')) {

                // Xử lí khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lí khi click vào option
                if (e.target.closest('.option')) {

                }
            }

        }
    },
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.random
        this.isRepeat = this.config.repeat
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex <= 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
            
        this.loadCurrentSong()
    },

    start: function() {
        // tải cấu hình config
        this.loadConfig();
        // định nghĩa các thuộc tính chgo object
        this.definedProperties()
        // phát song đầu tiên
        this.loadCurrentSong()
        // Xử lí các sự kiện
        this.handleEvents()
        // show ra playlist
        this.render()

        randomBtn.classList.toggle('active', _this.isRandom)
        repeatBtn.classList.toggle('active', _this.isRepeat) 

    }
}
app.start()


