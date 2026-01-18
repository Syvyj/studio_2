(function () {
    'use strict';

    /**
     * STUDIOS MASTER (Unified)
     * Developed by: Syvyj
     * Version: 1.3.0
     * Description: Unified studio collections for Lampa (Netflix, HBO, Disney+, etc.)
     * 
     * This plugin is a community development. 
     * Credits to the creator for curation and logic.
     */

    var SERVICE_CONFIGS = {
        'netflix': {
            title: 'Netflix',
            style_class: 'lampa--netflix',
            brand_color: '#E50914',
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 2L16.5 22" stroke="#E50914" stroke-width="4"/><path d="M7.5 2L7.5 22" stroke="#E50914" stroke-width="4"/><path d="M7.5 2L16.5 22" stroke="#E50914" stroke-width="4"/></svg>',
            categories: [
                { "title": "Нові фільми", "url": "discover/movie", "params": { "with_watch_providers": "8", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "Нові серіали", "url": "discover/tv", "params": { "with_networks": "213", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "В тренді на Netflix", "url": "discover/tv", "params": { "with_networks": "213", "sort_by": "popularity.desc" } },
                { "title": "Екшн та Блокбастери", "url": "discover/movie", "params": { "with_companies": "213", "with_genres": "28,12", "sort_by": "popularity.desc" } },
                { "title": "Фантастичні світи", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "10765", "sort_by": "vote_average.desc", "vote_count.gte": "200" } },
                { "title": "Реаліті-шоу: Хіти", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "10764", "sort_by": "popularity.desc" } },
                { "title": "Кримінальні драми", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "80", "sort_by": "popularity.desc" } },
                { "title": "K-Dramas (Корейські серіали)", "url": "discover/tv", "params": { "with_networks": "213", "with_original_language": "ko", "sort_by": "popularity.desc" } },
                { "title": "Аніме колекція", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "16", "with_keywords": "210024", "sort_by": "popularity.desc" } },
                { "title": "Документальне кіно", "url": "discover/movie", "params": { "with_companies": "213", "with_genres": "99", "sort_by": "release_date.desc" } },
                { "title": "Вибір критиків", "url": "discover/movie", "params": { "with_companies": "213", "vote_average.gte": "7.5", "vote_count.gte": "300", "sort_by": "vote_average.desc" } }
            ]
        },
        'apple': {
            title: 'Apple TV+',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
            categories: [
                { "title": "Нові фільми", "url": "discover/movie", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "Нові серіали", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "Хіти Apple TV+", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "popularity.desc" } },
                { "title": "Apple Original Films", "url": "discover/movie", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "release_date.desc", "vote_count.gte": "10" } },
                { "title": "Фантастика Apple", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "with_genres": "10765", "sort_by": "vote_average.desc", "vote_count.gte": "200" } },
                { "title": "Комедії та Feel-good", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "with_genres": "35", "sort_by": "popularity.desc" } },
                { "title": "Трилери та Детективи", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "with_genres": "9648,80", "sort_by": "popularity.desc" } }
            ]
        },
        'hbo': {
            title: 'HBO',
            icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor"><path d="M7.042 16.896H4.414v-3.754H2.708v3.754H.01L0 7.22h2.708v3.6h1.706v-3.6h2.628zm12.043.046C21.795 16.94 24 14.689 24 11.978a4.89 4.89 0 0 0-4.915-4.92c-2.707-.002-4.09 1.991-4.432 2.795.003-1.207-1.187-2.632-2.58-2.634H7.59v9.674l4.181.001c1.686 0 2.886-1.46 2.888-2.713.385.788 1.72 2.762 4.427 2.76zm-7.665-3.936c.387 0 .692.382.692.817 0 .435-.305.817-.692.817h-1.33v-1.634zm.005-3.633c.387 0 .692.382.692.817 0 .436-.305.818-.692.818h-1.33V9.373zm1.77 2.607c.305-.039.813-.387.992-.61-.063.276-.068 1.074.006 1.35-.204-.314-.688-.701-.998-.74zm3.43 0a2.462 2.462 0 1 1 4.924 0 2.462 2.462 0 0 1-4.925 0zm2.462 1.936a1.936 1.936 0 1 0 0-3.872 1.936 1.936 0 0 0 0 3.872z"/></svg>',
            categories: [
                { "title": "Нові фільми WB/HBO", "url": "discover/movie", "params": { "with_companies": "174|49", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "10" } },
                { "title": "Нові серіали HBO/Max", "url": "discover/tv", "params": { "with_networks": "49|3186", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "HBO: Головні хіти", "url": "discover/tv", "params": { "with_networks": "49", "sort_by": "popularity.desc" } },
                { "title": "Max Originals", "url": "discover/tv", "params": { "with_networks": "3186", "sort_by": "popularity.desc" } },
                { "title": "Блокбастери Warner Bros.", "url": "discover/movie", "params": { "with_companies": "174", "sort_by": "revenue.desc", "vote_count.gte": "1000" } },
                { "title": "Золота колекція HBO (Найвищий рейтинг)", "url": "discover/tv", "params": { "with_networks": "49", "sort_by": "vote_average.desc", "vote_count.gte": "500", "vote_average.gte": "8.0" } },
                { "title": "Епічні світи (Фентезі)", "url": "discover/tv", "params": { "with_networks": "49|3186", "with_genres": "10765", "sort_by": "popularity.desc" } },
                { "title": "Преміальні драми", "url": "discover/tv", "params": { "with_networks": "49", "with_genres": "18", "without_genres": "10765", "sort_by": "popularity.desc" } },
                { "title": "Доросла анімація (Adult Swim)", "url": "discover/tv", "params": { "with_networks": "3186|80", "with_genres": "16", "sort_by": "popularity.desc" } },
                { "title": "Всесвіт DC (Фільми)", "url": "discover/movie", "params": { "with_companies": "174", "with_keywords": "9715", "sort_by": "release_date.desc" } }
            ]
        },
        'amazon': {
            title: 'Prime Video',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.787 15.292c-.336-.43-2.222-.204-3.069-.103-.257.031-.296-.193-.065-.356 1.504-1.056 3.968-.75 4.255-.397.288.357-.076 2.827-1.485 4.007-.217.18-.423.084-.327-.155.317-.792 1.027-2.566.69-2.996"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>',
            categories: [
                { "title": "В тренді на Prime Video", "url": "discover/tv", "params": { "with_networks": "1024", "sort_by": "popularity.desc" } },
                { "title": "Нові фільми", "url": "discover/movie", "params": { "with_watch_providers": "119", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "Нові серіали", "url": "discover/tv", "params": { "with_networks": "1024", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "Жорсткий екшн та Антигерої", "url": "discover/tv", "params": { "with_networks": "1024", "with_genres": "10765,10759", "sort_by": "popularity.desc" } },
                { "title": "Блокбастери MGM та Amazon", "url": "discover/movie", "params": { "with_companies": "1024|21", "sort_by": "revenue.desc" } },
                { "title": "Комедії", "url": "discover/tv", "params": { "with_networks": "1024", "with_genres": "35", "sort_by": "vote_average.desc" } },
                { "title": "Найвищий рейтинг IMDb", "url": "discover/tv", "params": { "with_networks": "1024", "vote_average.gte": "8.0", "vote_count.gte": "500", "sort_by": "vote_average.desc" } }
            ]
        },
        'disney': {
            title: 'Disney+',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19,3V7m2-2H17m-10.31,4L8.69,21m-5.69-7c0-3,5.54-4.55,9-2m-9,2s12.29-2,13.91,6.77c1.09,5.93-6.58,6.7-9.48,5.89S3,16.06,3,14.06"/></svg>',
            categories: [
                { "title": "Нові фільми на Disney+", "url": "discover/movie", "params": { "with_watch_providers": "337", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "Нові серіали на Disney+", "url": "discover/tv", "params": { "with_watch_providers": "337", "watch_region": "UA", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "Marvel: Кіновсесвіт (MCU)", "url": "discover/movie", "params": { "with_companies": "420", "sort_by": "release_date.desc", "vote_count.gte": "200" } },
                { "title": "Marvel: Серіали", "url": "discover/tv", "params": { "with_companies": "420", "with_networks": "2739", "sort_by": "first_air_date.desc" } },
                { "title": "Зоряні Війни: Фільми", "url": "discover/movie", "params": { "with_companies": "1", "sort_by": "release_date.asc" } },
                { "title": "Зоряні Війни: Мандалорець та інші", "url": "discover/tv", "params": { "with_companies": "1", "with_keywords": "1930", "sort_by": "popularity.desc" } },
                { "title": "Класика Disney", "url": "discover/movie", "params": { "with_companies": "6125", "sort_by": "popularity.desc" } },
                { "title": "Pixar: Нескінченність і далі", "url": "discover/movie", "params": { "with_companies": "3", "sort_by": "popularity.desc" } },
                { "title": "FX: Дорослі хіти (The Bear, Shogun)", "url": "discover/tv", "params": { "with_networks": "88", "sort_by": "popularity.desc" } },
                { "title": "Сімпсони та анімація FOX", "url": "discover/tv", "params": { "with_networks": "19", "with_genres": "16", "sort_by": "popularity.desc" } }
            ]
        },
        'hulu': {
            title: 'Hulu',
            icon: '<svg viewBox="0 0 24 24" fill="#3DBB3D"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>',
            categories: [
                { "title": "Hulu Originals: У тренді", "url": "discover/tv", "params": { "with_networks": "453", "sort_by": "popularity.desc" } },
                { "title": "Драми та Трилери Hulu", "url": "discover/tv", "params": { "with_networks": "453", "with_genres": "18,9648", "sort_by": "vote_average.desc" } },
                { "title": "Комедії та Анімація для дорослих", "url": "discover/tv", "params": { "with_networks": "453", "with_genres": "35,16", "sort_by": "popularity.desc" } },
                { "title": "Міні-серіали (Limited Series)", "url": "discover/tv", "params": { "with_networks": "453", "with_keywords": "158718", "sort_by": "first_air_date.desc" } }
            ]
        },
        'paramount': {
            title: 'Paramount+',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22H22L12 2ZM12 6.5L18.5 19.5H5.5L12 6.5Z"/></svg>',
            categories: [
                { "title": "Блокбастери Paramount Pictures", "url": "discover/movie", "params": { "with_companies": "4", "sort_by": "revenue.desc" } },
                { "title": "Paramount+ Originals", "url": "discover/tv", "params": { "with_networks": "4330", "sort_by": "popularity.desc" } },
                { "title": "Всесвіт Йеллоустоун", "url": "discover/tv", "params": { "with_networks": "318|4330", "with_genres": "37,18", "sort_by": "popularity.desc" } },
                { "title": "Star Trek: Остання межа", "url": "discover/tv", "params": { "with_networks": "4330", "with_keywords": "159223", "sort_by": "first_air_date.desc" } },
                { "title": "Nickelodeon: Для дітей", "url": "discover/tv", "params": { "with_networks": "13", "sort_by": "popularity.desc" } }
            ]
        },
        'syfy': {
            title: 'Syfy',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>',
            categories: [
                { "title": "Хіти телеканалу Syfy", "url": "discover/tv", "params": { "with_networks": "77", "sort_by": "popularity.desc" } },
                { "title": "Космічні подорожі та Наукова Фантастика", "url": "discover/tv", "params": { "with_networks": "77", "with_genres": "10765", "with_keywords": "3801", "sort_by": "vote_average.desc" } },
                { "title": "Містика, Жахи та Фентезі", "url": "discover/tv", "params": { "with_networks": "77", "with_genres": "9648,10765", "without_keywords": "3801", "sort_by": "popularity.desc" } }
            ]
        },
        'educational_and_reality': {
            title: 'Пізнавальне',
            icon: '<svg viewBox="0 0 24 24" fill="#FF9800"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>',
            categories: [
                // --- БЛОК 1: Студійні новинки (Discovery, NatGeo, BBC, History) ---
                {
                    "title": "Нові випуски: Discovery, NatGeo, BBC",
                    "url": "discover/tv",
                    "params": {
                        "with_networks": "64|91|43|2696|4|65", // Всі топ канали разом
                        "sort_by": "first_air_date.desc",     // Сортування від нового
                        "first_air_date.lte": "{current_date}",
                        "vote_count.gte": "0"                 // Показувати навіть без оцінок (зовсім свіже)
                    }
                },

                // --- БЛОК 2: Найкраще від студій ---
                { "title": "Discovery Channel: Хіти", "url": "discover/tv", "params": { "with_networks": "64", "sort_by": "popularity.desc" } },
                { "title": "National Geographic: Світ навколо", "url": "discover/tv", "params": { "with_networks": "43", "sort_by": "popularity.desc" } },
                { "title": "Animal Planet: Тварини", "url": "discover/tv", "params": { "with_networks": "91", "sort_by": "popularity.desc" } },
                { "title": "BBC Earth: Природа (Високий рейтинг)", "url": "discover/tv", "params": { "with_networks": "4", "with_genres": "99", "sort_by": "vote_average.desc", "vote_count.gte": "50" } },

                // --- БЛОК 3: Жанрові добірки (Всі студії світу) ---

                // Кулінарія (MasterChef, Hell's Kitchen і т.д.)
                {
                    "title": "Кулінарні битви та Шеф-кухарі",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "10764",             // Reality
                        "with_keywords": "222083",     // Cooking OR Baking (Випічка)
                        "without_keywords": "10636,5481",   // ПРИБРАТИ: Dating (Single's Inferno), Survival
                        "sort_by": "popularity.desc"
                    }
                },

                // Шоу талантів (The Voice, X-Factor, Idol)
                {
                    "title": "Голос, Танці та Шоу талантів",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "10764",             // Reality
                        "with_keywords": "4542|4568|2643",  // Singing OR Dancing OR Talent Show
                        "without_keywords": "5481,9714",    // ПРИБРАТИ: Survival (Survivor), Travel (Amazing Race)
                        "sort_by": "popularity.desc"
                    }
                },

                // Виживання (Survivor, Bear Grylls)
                {
                    "title": "Шоу про виживання",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "10764",
                        "with_keywords": "5481|10348", // Keywords: Survival
                        "sort_by": "popularity.desc"
                    }
                },
                // Наука та Технології (Mythbusters, How it's made)
                {
                    "title": "Наука, Техніка та Експерименти",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "99",
                        "with_keywords": "12554|4924", // Science OR Technology
                        "sort_by": "popularity.desc"
                    }
                },

                // Подорожі (Орел і Решка, Travel Man)
                {
                    "title": "Подорожі та Туризм",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "99,10764",
                        "with_keywords": "9714",   // Keyword: Travel
                        "sort_by": "vote_average.desc",
                        "vote_count.gte": "20"
                    }
                },

                // True Crime (Кримінал)
                {
                    "title": "True Crime: Реальні розслідування",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "99",
                        "with_keywords": "10714|9840", // Serial Killer OR Investigation
                        "sort_by": "popularity.desc"
                    }
                }
            ]
        }
    };

    // -----------------------------------------------------------------
    // UI LOGIC
    // -----------------------------------------------------------------

    function createInterfaceState(main) {
        const info = new InterfaceInfo();
        info.create();

        const background = document.createElement('img');
        background.className = 'full-start__background';

        return {
            info,
            background,
            backgroundTimer: null,
            backgroundLast: '',
            attached: false,
            attach() {
                if (this.attached) return;
                const container = main.activity.render()[0];
                if (!container) return;

                container.classList.add('new-interface');
                container.insertBefore(this.background, container.firstChild);
                container.insertBefore(info.render(true), this.background.nextSibling);
                this.attached = true;
            },
            update(data) {
                if (!data) return;
                info.update(data);
                this.updateBackground(data);
            },
            updateBackground(data) {
                const path = data && data.backdrop_path ? Lampa.Api.img(data.backdrop_path, 'w1280') : '';
                if (!path || path === this.backgroundLast) return;

                clearTimeout(this.backgroundTimer);
                this.backgroundTimer = setTimeout(() => {
                    this.background.classList.remove('loaded');
                    this.background.onload = () => this.background.classList.add('loaded');
                    this.background.src = path;
                    this.backgroundLast = path;
                }, 600);
            },
            destroy() {
                clearTimeout(this.backgroundTimer);
                info.destroy();
                if (this.background.parentNode) this.background.parentNode.removeChild(this.background);
                this.attached = false;
            }
        };
    }

    class InterfaceInfo {
        constructor() { this.html = null; }
        create() {
            this.html = $(`<div class="new-interface-info">
                <div class="new-interface-info__body">
                    <div class="new-interface-info__title"></div>
                    <div class="new-interface-info__description"></div>
                </div>
            </div>`);
        }
        render(js) { return js ? this.html[0] : this.html; }
        update(data) {
            this.html.find('.new-interface-info__title').text(data.title || data.name || '');
            this.html.find('.new-interface-info__description').text(data.overview || '');
            this.loadLogo(data);
        }
        loadLogo(data) {
            if (!Lampa.TMDB || !data.id) return;
            const type = data.media_type || (data.name ? 'tv' : 'movie');
            const url = Lampa.TMDB.api(`${type}/${data.id}/images?api_key=${Lampa.TMDB.key()}`);

            $.getJSON(url, (res) => {
                const logo = res.logos && res.logos[0];
                if (logo) {
                    const imgUrl = Lampa.TMDB.image('/t/p/w500' + logo.file_path);
                    this.html.find('.new-interface-info__title').html(`<img src="${imgUrl}" style="max-height: 120px">`);
                }
            });
        }
        destroy() { if (this.html) this.html.remove(); }
    }

    // -----------------------------------------------------------------
    // COMPONENTS
    // -----------------------------------------------------------------

    function StudiosMain(object) {
        var comp = new Lampa.InteractionMain(object);
        var config = SERVICE_CONFIGS[object.service_id];
        var state = null;

        comp.create = function () {
            var _this = this;
            if (config.style_class) this.activity.render().addClass(config.style_class);

            // Динамічний інтерфейс тільки для Netflix
            if (object.service_id === 'netflix') {
                state = createInterfaceState(this);
            }

            this.activity.loader(true);
            var network = new Lampa.Reguest();
            var status = new Lampa.Status(config.categories.length);

            status.onComplite = function () {
                var fulldata = [];
                Object.keys(status.data).sort((a, b) => a - b).forEach(key => {
                    var data = status.data[key];
                    if (data && data.results.length) {
                        Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                        fulldata.push({
                            title: config.categories[key].title,
                            results: data.results,
                            url: config.categories[key].url,
                            params: config.categories[key].params
                        });
                    }
                });

                if (fulldata.length) {
                    _this.build(fulldata);
                    if (state) {
                        state.attach();
                        state.update(fulldata[0].results[0]);
                    }
                }
                _this.activity.loader(false);
            };

            // ПРАВИЛЬНИЙ ОБРОБНИК ФОКУСУ
            this.onFocus = function (item) {
                if (state && item.data) state.update(item.data);
            };

            config.categories.forEach((cat, index) => {
                let url = Lampa.TMDB.api(cat.url + '?api_key=' + Lampa.TMDB.key() + '&language=uk');
                if (cat.params) {
                    for (let k in cat.params) {
                        let v = cat.params[k].toString().replace('{current_date}', new Date().toISOString().split('T')[0]);
                        url += `&${k}=${v}`;
                    }
                }
                network.silent(url, (json) => status.append(index.toString(), json), status.error.bind(status));
            });

            return this.render();
        };

        // Очистка при закритті
        const baseDestroy = comp.destroy;
        comp.destroy = function () {
            if (state) state.destroy();
            if (baseDestroy) baseDestroy.call(this);
        };

        return comp;
    }

    // -----------------------------------------------------------------
    // STYLES & START
    // -----------------------------------------------------------------

    function startPlugin() {
        Lampa.Component.add('studios_main', StudiosMain);
        Lampa.Component.add('studios_view', function (object) {
            return new Lampa.InteractionCategory(object);
        });

        if (!$('#studios-master-styles').length) {
            $('body').append(`<style id="studios-master-styles">
                .lampa--netflix { background: #141414 !important; }
                .new-interface .full-start__background {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    object-fit: cover; opacity: 0; transition: opacity 1s; z-index: 0;
                    mask-image: linear-gradient(to bottom, black 20%, transparent 90%);
                    -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 90%);
                }
                .new-interface .full-start__background.loaded { opacity: 0.4; }
                .new-interface-info { position: relative; z-index: 2; padding: 50px 4%; height: 260px; pointer-events: none; }
                .new-interface-info__title { font-size: 3.5em; font-weight: bold; margin-bottom: 15px; }
                .new-interface-info__description { width: 45%; font-size: 1.1em; line-height: 1.4; opacity: 0.8; 
                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
                .lampa--netflix .card.focus { transform: scale(1.1); border: 3px solid #fff; z-index: 10; transition: 0.2s; }
                .lampa--netflix .category__title { font-size: 1.5em; font-weight: bold; margin: 20px 0 10px 10px; }
                .lampa--netflix .interaction-main__row { position: relative; z-index: 3; }
            </style>`);
        }

        // Menu Logic
        const addBtn = () => {
            const list = $('.menu__list');
            if (!list.length || $('.studios-master-item').length) return;

            Object.keys(SERVICE_CONFIGS).forEach(sid => {
                const item = $(`<li class="menu__item selector studios-master-item">
                    <div class="menu__ico">${SERVICE_CONFIGS[sid].icon}</div>
                    <div class="menu__text">${SERVICE_CONFIGS[sid].title}</div>
                </li>`);
                item.on('hover:enter', () => {
                    Lampa.Activity.push({ title: SERVICE_CONFIGS[sid].title, component: 'studios_main', service_id: sid });
                });
                list.append(item);
            });
        };

        if (window.appready) addBtn();
        else Lampa.Listener.follow('app', e => { if (e.type === 'ready') addBtn(); });
    }

    startPlugin();
})();