(function () {
    'use strict';

    /**
     * STUDIOS MASTER (Unified)
     * Developed by: Syvyj
     * Version: 1.2.0
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
                { "title": "Нові фільми", "url": "discover/movie", "is_hero": true, "params": { "with_watch_providers": "8", "watch_region": "UA", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "Нові серіали", "url": "discover/tv", "params": { "with_networks": "213", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "5" } },
                { "title": "В тренді на Netflix", "url": "discover/tv", "params": { "with_networks": "213", "sort_by": "popularity.desc" } },
                { "title": "Екшн та Блокбастери", "url": "discover/movie", "params": { "with_companies": "213", "with_genres": "28,12", "sort_by": "popularity.desc" } },
                { "title": "Фантастичні світи", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "10765", "sort_by": "vote_average.desc", "vote_count.gte": "200" } },
                { "title": "Реаліті-шоу: Хіти", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "10764", "sort_by": "popularity.desc" } },
                { "title": "Кримінальні драми", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "80", "sort_by": "popularity.desc" } },
                { "title": "K-Dramas (Корейські серіали)", "url": "discover/tv", "params": { "with_networks": "213", "with_original_language": "ko", "sort_by": "popularity.desc" } },
                { "title": "Аніме колекція", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "16", "with_keywords": "210024", "sort_by": "popularity.desc" } },
                { "title": "Документальне кіно", "url": "discover/movie", "params": { "with_companies": "213", "with_genres": "99", "sort_by": "release_date.desc" } },
                { "title": "Вибір критиків (Високий рейтинг)", "url": "discover/movie", "params": { "with_companies": "213", "vote_average.gte": "7.5", "vote_count.gte": "300", "sort_by": "vote_average.desc" } }
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
    // NEW INTERFACE LOGIC (Spotlight/Background)
    // -----------------------------------------------------------------

    function shouldUseNewInterface(object) {
        return object.service_id === 'netflix';
    }

    function ensureState(main) {
        if (main.__newInterfaceState) return main.__newInterfaceState;
        const state = createInterfaceState(main);
        main.__newInterfaceState = state;
        return state;
    }

    function createInterfaceState(main) {
        const info = new InterfaceInfo();
        info.create();

        const background = document.createElement('img');
        background.className = 'full-start__background';

        const state = {
            main,
            info,
            background,
            infoElement: null,
            backgroundTimer: null,
            backgroundLast: '',
            attached: false,
            attach() {
                if (this.attached) return;

                const container = main.activity.render()[0]; // Lampa jQuery object -> DOM
                if (!container) return;

                container.classList.add('new-interface'); // Uncommented for CSS scoping

                if (!background.parentElement) {
                    container.insertBefore(background, container.firstChild || null);
                }

                const infoNode = info.render(true);
                this.infoElement = infoNode;

                if (infoNode && infoNode.parentNode !== container) {
                    if (background.parentElement === container) {
                        container.insertBefore(infoNode, background.nextSibling);
                    } else {
                        container.insertBefore(infoNode, container.firstChild || null);
                    }
                }

                // Adjust scroll if needed, though Studios might handle it differently
                // main.scroll.minus(infoNode); 

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
                    background.classList.remove('loaded');

                    background.onload = () => background.classList.add('loaded');
                    background.onerror = () => background.classList.remove('loaded');

                    this.backgroundLast = path;

                    setTimeout(() => {
                        background.src = this.backgroundLast;
                    }, 300);
                }, 1000);
            },
            reset() {
                info.empty();
            },
            destroy() {
                clearTimeout(this.backgroundTimer);
                info.destroy();

                const container = main.activity.render()[0];
                // if (container) container.classList.remove('new-interface');

                if (this.infoElement && this.infoElement.parentNode) {
                    this.infoElement.parentNode.removeChild(this.infoElement);
                }

                if (background && background.parentNode) {
                    background.parentNode.removeChild(background);
                }

                this.attached = false;
            }
        };

        return state;
    }

    class InterfaceInfo {
        constructor() {
            this.html = null;
            this.timer = null;
            this.network = new Lampa.Reguest();
            this.loadedLogos = {};
            this.currentLogoUrl = null;
        }

        create() {
            if (this.html) return;

            this.html = $(`<div class="new-interface-info">
                <div class="new-interface-info__body">
                    <div class="new-interface-info__head"></div>
                    <div class="new-interface-info__title"></div>
                    <div class="new-interface-info__details"></div>
                    <div class="new-interface-info__description"></div>
                </div>
            </div>`);
        }

        render(js) {
            if (!this.html) this.create();
            return js ? this.html[0] : this.html;
        }

        update(data) {
            if (!data) return;
            if (!this.html) this.create();

            this.html.find('.new-interface-info__head,.new-interface-info__details').text('');

            // Оновлюємо заголовок (текст або логотип)
            this.updateTitle(data);

            this.html.find('.new-interface-info__description').text(data.overview || '');
            // Lampa.Background.change(Lampa.Utils.cardImgBackground(data)); // We handle background manually

            // this.loadDetails(data); // Can add this later if needed
        }

        updateTitle(data) {
            const titleElement = this.html.find('.new-interface-info__title');

            // Завжди пробуємо логотип для Netflix
            titleElement.text(data.title || data.name || '');
            this.loadLogo(data);
        }

        loadLogo(data) {
            if (!data || !data.id) return;

            // Check TMDB availability (Lampa v3+ usually)
            if (!Lampa.TMDB || typeof Lampa.TMDB.api !== 'function' || typeof Lampa.TMDB.key !== 'function') return;

            const source = data.source || 'tmdb';
            if (source !== 'tmdb' && source !== 'cub') return;

            const type = data.media_type === 'tv' || data.name ? 'tv' : 'movie';
            const userLanguage = Lampa.Storage.get('language') || 'en';
            const cacheKey = `${type}_${data.id}_${userLanguage}`;

            if (this.loadedLogos[cacheKey]) {
                this.displayLogo(data, this.loadedLogos[cacheKey]);
                return;
            }

            const currentLangUrl = Lampa.TMDB.api(`${type}/${data.id}/images?api_key=${Lampa.TMDB.key()}&language=${userLanguage}`);
            this.currentLogoUrl = currentLangUrl;

            // Simple GET request wrapper
            $.get(currentLangUrl, (currentLangData) => {
                if (this.currentLogoUrl !== currentLangUrl) return;

                let logoPath = null;
                if (currentLangData.logos && currentLangData.logos.length > 0) logoPath = currentLangData.logos[0].file_path;

                if (!logoPath) {
                    // Try English
                    const englishUrl = Lampa.TMDB.api(`${type}/${data.id}/images?api_key=${Lampa.TMDB.key()}&language=en`);
                    $.get(englishUrl, (englishData) => {
                        if (this.currentLogoUrl !== currentLangUrl) return;
                        if (englishData.logos && englishData.logos.length > 0) logoPath = englishData.logos[0].file_path;

                        if (logoPath) {
                            this.loadedLogos[cacheKey] = logoPath;
                            this.displayLogo(data, logoPath);
                        }
                    });
                } else {
                    this.loadedLogos[cacheKey] = logoPath;
                    this.displayLogo(data, logoPath);
                }
            });
        }

        displayLogo(data, logoPath) {
            if (!logoPath || !this.html) return;
            const titleElement = this.html.find('.new-interface-info__title');
            const logoUrl = Lampa.TMDB.image('/t/p/w500' + logoPath.replace('.svg', '.png')); // w500 for better quality

            const logoImg = $('<img>').attr('src', logoUrl).attr('alt', data.title || data.name);
            titleElement.empty().append(logoImg);
        }

        empty() {
            if (this.html) this.html.find('.new-interface-info__title, .new-interface-info__description').empty();
        }

        destroy() {
            if (this.html) this.html.remove();
            this.html = null;
            this.loadedLogos = {};
        }
    }

    // -----------------------------------------------------------------
    // COMPONENTS
    // -----------------------------------------------------------------

    function StudiosMain(object) {
        var comp = new Lampa.InteractionMain(object);
        var config = SERVICE_CONFIGS[object.service_id];

        comp.create = function () {
            var _this = this;
            if (config.style_class) this.activity.render().addClass(config.style_class);
            this.activity.loader(true);
            var categories = config.categories;
            var network = new Lampa.Reguest();
            var status = new Lampa.Status(categories.length);

            status.onComplite = function () {
                var fulldata = [];
                var sortedKeys = Object.keys(status.data).sort(function (a, b) { return a - b; });

                sortedKeys.forEach(function (key, index) {
                    var data = status.data[key];
                    if (data && data.results && data.results.length) {
                        var cat = categories[parseInt(key)];

                        // Force 'wide' style for Netflix (New Interface handles the look)
                        if (object.service_id === 'netflix') {
                            Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                        } else {
                            Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                        }

                        fulldata.push({
                            title: cat.title,
                            results: data.results,
                            url: cat.url,
                            params: cat.params,
                            service_id: object.service_id
                        });
                    }
                });

                if (fulldata.length) {
                    _this.build(fulldata);
                    _this.activity.render().addClass('lampa--' + object.service_id);

                    // Initialize New Interface if applicable
                    if (shouldUseNewInterface(object)) {
                        var state = ensureState(_this);
                        state.attach();

                        // Initial update with first item if available
                        if (fulldata[0] && fulldata[0].results && fulldata[0].results.length) {
                            state.update(fulldata[0].results[0]);
                        }
                    }

                    _this.activity.loader(false);
                } else {
                    _this.empty();
                }
            };

            // Handle specific focus events for New Interface
            if (shouldUseNewInterface(object)) {
                _this.listener = function (e) {
                    // Check if focus is inside this component
                    if (e.target && $(e.target).closest('.lampa--netflix').length) {
                        // Try to get data from card
                        var card = $(e.target).closest('.card').data('data'); // Assuming Lampa attaches data 'data' to card element
                        // If not found via jquery data, try DOM property
                        if (!card) card = e.target.card_data;

                        if (card) {
                            var state = ensureState(_this);
                            state.update(card);
                        }
                    }
                };
                Lampa.Listener.follow('focus', _this.listener);
            }

            // Override destroy to clean up
            _this.onDestroy = function () {
                if (_this.listener) Lampa.Listener.remove('focus', _this.listener);
                if (_this.__newInterfaceState) _this.__newInterfaceState.destroy();
            };

            categories.forEach(function (cat, index) {
                var params = [];
                params.push('api_key=' + Lampa.TMDB.key());
                params.push('language=' + Lampa.Storage.get('language', 'uk'));

                if (cat.params) {
                    for (var key in cat.params) {
                        var val = cat.params[key];
                        if (val === '{current_date}') {
                            var d = new Date();
                            val = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                        }
                        params.push(key + '=' + val);
                    }
                }

                var url = Lampa.TMDB.api(cat.url + '?' + params.join('&'));

                network.silent(url, function (json) {
                    status.append(index.toString(), json);
                }, function () {
                    status.error();
                });
            });

            return this.render();
        };

        comp.onMore = function (data) {
            Lampa.Activity.push({
                url: data.url,
                params: data.params,
                title: data.title,
                component: 'studios_view',
                page: 1
            });
        };

        return comp;
    }

    function StudiosView(object) {
        var comp = new Lampa.InteractionCategory(object);
        var network = new Lampa.Reguest();

        function buildUrl(page) {
            var params = [];
            params.push('api_key=' + Lampa.TMDB.key());
            params.push('language=' + Lampa.Storage.get('language', 'uk'));
            params.push('page=' + page);

            if (object.params) {
                for (var key in object.params) {
                    var val = object.params[key];
                    if (val === '{current_date}') {
                        var d = new Date();
                        val = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                    }
                    params.push(key + '=' + val);
                }
            }
            return Lampa.TMDB.api(object.url + '?' + params.join('&'));
        }

        comp.create = function () {
            var _this = this;
            network.silent(buildUrl(1), function (json) {
                _this.build(json);
            }, this.empty.bind(this));
        };

        comp.nextPageReuest = function (object, resolve, reject) {
            network.silent(buildUrl(object.page), resolve, reject);
        };

        return comp;
    }

    // -----------------------------------------------------------------
    // INJECTION
    // -----------------------------------------------------------------

    function startPlugin() {
        if (window.plugin_studios_master_ready) return;
        window.plugin_studios_master_ready = true;

        // Branding
        // Lampa.Noty.show('Studios Master by Syvyj розгорнуто');

        // Register components
        Lampa.Component.add('studios_main', StudiosMain);
        Lampa.Component.add('studios_view', StudiosView);

        // Inject CSS for wide cards once
        if (!$('#studios-unified-css').length) {
            $('body').append(`
                <style id="studios-unified-css">
                    /* Глибокий чорний фон як у Netflix */
                    .lampa--netflix { 
                        background-color: #141414 !important; 
                        position: relative; /* Context for absolute positioning */
                        overflow: hidden;
                    }

                    /* --- NEW INTERFACE (Spotlight) Styles --- */
                    .new-interface .card.card--wide {
                        width: 18.3em !important;
                    }
            
                    .new-interface-info {
                        position: relative;
                        padding: 1.5em;
                        height: 24em;
                        z-index: 5; /* Above background */
                    }
            
                    .new-interface-info__body {
                        width: 80%;
                        padding-top: 1.1em;
                    }
            
                    .new-interface-info__head {
                        color: rgba(255, 255, 255, 0.6);
                        margin-bottom: 1em;
                        font-size: 1.3em;
                        min-height: 1em;
                    }
            
                    .new-interface-info__head span {
                        color: #fff;
                    }
            
                    .new-interface-info__title {
                        font-size: 4em;
                        font-weight: 600;
                        margin-bottom: 0.3em;
                        overflow: hidden;
                        -o-text-overflow: '.';
                        text-overflow: '.';
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        line-clamp: 1;
                        -webkit-box-orient: vertical;
                        margin-left: -0.03em;
                        line-height: 1.3;
                    }
            
                    .new-interface-info__title img {
                        max-height: 125px;
                        margin-top: 5px;
                    }
            
                    .new-interface-info__details {
                        margin-bottom: 1.6em;
                        display: flex;
                        align-items: center;
                        flex-wrap: wrap;
                        min-height: 1.9em;
                        font-size: 1.1em;
                    }
            
                    .new-interface-info__description {
                        font-size: 1.2em;
                        font-weight: 300;
                        line-height: 1.5;
                        overflow: hidden;
                        -o-text-overflow: '.';
                        text-overflow: '.';
                        display: -webkit-box;
                        -webkit-line-clamp: 4;
                        line-clamp: 4;
                        -webkit-box-orient: vertical;
                        width: 50%; /* Restricted width for readability */
                    }
            
                    .new-interface .full-start__background {
                        height: 108%;
                        top: -6em;
                        position: absolute;
                        left: 0;
                        right: 0;
                        z-index: 1;
                        opacity: 0;
                        transition: opacity 0.5s ease-in-out;
                        width: 100%;
                        object-fit: cover;
                        mask-image: linear-gradient(to bottom, black 0%, black 50%, transparent 100%);
                        -webkit-mask-image: linear-gradient(to bottom, black 0%, black 50%, transparent 100%);
                    }
                    
                    .new-interface .full-start__background.loaded {
                        opacity: 0.5; /* Dim it a bit */
                    }

                    /* --- CARD FOCUS & STYLE --- */
                    .lampa--netflix .card--wide {
                        width: 20em !important; /* Slightly larger than 18.3em if needed */
                        border-radius: 4px;
                        transition: transform 0.3s !important;
                    }

                    .lampa--netflix .card.focus {
                        transform: scale(1.1) !important;
                        border: 3px solid #fff !important;
                        box-shadow: 0 0 20px rgba(0,0,0,0.8);
                        z-index: 100;
                    }
                    
                    /* Hide titles on cards in New Interface if preferred, 
                       since we have the big title on top. 
                       But user might want them. Let's keep them small. */
                    .lampa--netflix .card--wide .card__title {
                        display: none; /* Hide card titles to mimic Netflix pure image look in rows */
                    }
                    
                    .lampa--netflix .category__title {
                        color: #e5e5e5;
                        font-size: 1.4em;
                        font-weight: bold;
                        margin-bottom: 0.5em;
                        padding-left: 0.5em;
                    }

                    /* Ensure rows overlap the bottom of the background/info */
                    .lampa--netflix .interaction-main__row {
                        position: relative;
                        z-index: 10;
                    }
                </style>
            `);
        }

        // Function to render menu buttons
        function addMenuButtons() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length) return;

            // Iterate through all configs and add buttons
            Object.keys(SERVICE_CONFIGS).forEach(function (sid) {
                var conf = SERVICE_CONFIGS[sid];

                // Avoid duplicates
                if (menu.find('.menu__item[data-sid="' + sid + '"]').length) return;

                var btn = $(`<li class="menu__item selector" data-action="studios_action_${sid}" data-sid="${sid}">
                    <div class="menu__ico">${conf.icon}</div>
                    <div class="menu__text">${conf.title}</div>
                </li>`);

                btn.on('hover:enter', function () {
                    Lampa.Activity.push({
                        title: conf.title,
                        component: 'studios_main',
                        service_id: sid,
                        page: 1
                    });
                });

                // Append to the menu
                menu.append(btn);
            });
        }

        // Initialize
        if (window.appready) {
            addMenuButtons();
        } else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') addMenuButtons();
            });
        }

        // Safety check to ensure buttons appear even if DOM changes
        setInterval(function () {
            if (window.appready && $('.menu .menu__list').eq(0).length) {
                addMenuButtons();
            }
        }, 3000);
    }

    if (!window.plugin_studios_master_ready) startPlugin();
})();