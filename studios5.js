/**
 * Ліхтар Studios2 — плагін головної сторінки (Likhtar Team).
 * Кастомна головна, стрімінги, студії, підписки на студії, Кіноогляд.
 */
(function () {
    'use strict';

    window.LIKHTAR_STUDIOS_VER = '3.0';
    window.LIKHTAR_STUDIOS_LOADED = false;
    window.LIKHTAR_STUDIOS_ERROR = null;

    if (typeof Lampa === 'undefined') {
        window.LIKHTAR_STUDIOS_ERROR = 'Lampa not found (script loaded before app?)';
        return;
    }


    // =================================================================
    // CONFIGURATION & CONSTANTS
    // =================================================================

    var currentScript = document.currentScript || [].slice.call(document.getElementsByTagName('script')).filter(function (s) {
        return (s.src || '').indexOf('studios') !== -1 || (s.src || '').indexOf('fix.js') !== -1 || (s.src || '').indexOf('likhtar') !== -1;
    })[0];

    var LIKHTAR_BASE_URL = (currentScript && currentScript.src) ? currentScript.src.replace(/[#?].*$/, '').replace(/[^/]+$/, '') : 'http://127.0.0.1:3000/';

    if (LIKHTAR_BASE_URL.indexOf('raw.githubusercontent.com') !== -1) {
        LIKHTAR_BASE_URL = LIKHTAR_BASE_URL
            .replace('raw.githubusercontent.com', 'cdn.jsdelivr.net/gh')
            .replace(/\/([^@/]+\/[^@/]+)\/main\//, '/$1@main/')
            .replace(/\/([^@/]+\/[^@/]+)\/master\//, '/$1@master/');
    } else if (LIKHTAR_BASE_URL.indexOf('.github.io') !== -1) {
        // e.g. https://syvyj.github.io/studio_2/ → https://cdn.jsdelivr.net/gh/syvyj/studio_2@main/
        var gitioMatch = LIKHTAR_BASE_URL.match(/https?:\/\/([^.]+)\.github\.io\/([^/]+)\//i);
        if (gitioMatch) {
            LIKHTAR_BASE_URL = 'https://cdn.jsdelivr.net/gh/' + gitioMatch[1] + '/' + gitioMatch[2] + '@main/';
        }
    }



    var SERVICE_CONFIGS = {
        'netflix': {
            title: 'Netflix',
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
                { "title": "Нові серіали Hulu", "url": "discover/tv", "params": { "with_networks": "453", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "2" } },
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
                { "title": "Нові серіали Paramount+", "url": "discover/tv", "params": { "with_networks": "4330", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "2" } },
                { "title": "Блокбастери Paramount Pictures", "url": "discover/movie", "params": { "with_companies": "4", "sort_by": "revenue.desc" } },
                { "title": "Paramount+ Originals", "url": "discover/tv", "params": { "with_networks": "4330", "sort_by": "popularity.desc" } },
                { "title": "Всесвіт Йеллоустоун", "url": "discover/tv", "params": { "with_networks": "318|4330", "with_genres": "37,18", "sort_by": "popularity.desc" } },
                { "title": "Star Trek: Остання межа", "url": "discover/tv", "params": { "with_networks": "4330", "with_keywords": "159223", "sort_by": "first_air_date.desc" } },
                { "title": "Nickelodeon: Для дітей", "url": "discover/tv", "params": { "with_networks": "13", "sort_by": "popularity.desc" } }
            ]
        },
        'sky_showtime': {
            title: 'Sky Showtime',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.5l6.5 13H5.5L12 5.5z"/></svg>',
            categories: [
                { "title": "🔥 Щойно зі стрімінгу", "url": "discover/movie", "params": { "with_companies": "4|33|67|521", "sort_by": "primary_release_date.desc", "primary_release_date.lte": "{current_date}", "vote_count.gte": "2" } },
                { "title": "🔥 Щойно зі стрімінгу (серіали)", "url": "discover/tv", "params": { "with_companies": "4|33|67|521", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "2" } },
                { "title": "🎬 Головна сцена (Paramount)", "url": "discover/movie", "params": { "with_companies": "4", "sort_by": "popularity.desc" } },
                { "title": "🌍 Світ Universal", "url": "discover/movie", "params": { "with_companies": "33", "sort_by": "popularity.desc" } },
                { "title": "🕵️ Дорослий розбір (Showtime)", "url": "discover/tv", "params": { "with_companies": "67", "sort_by": "popularity.desc" } },
                { "title": "🤠 Всесвіт Шеридана (Yellowstone)", "url": "discover/tv", "params": { "with_keywords": "256112", "sort_by": "popularity.desc" } },
                { "title": "🦄 Казкові світи (DreamWorks)", "url": "discover/movie", "params": { "with_companies": "521", "sort_by": "popularity.desc" } },
                { "title": "🍍 Дитячий двіж (Nickelodeon)", "url": "discover/tv", "params": { "with_companies": "4338", "sort_by": "popularity.desc" } },
                { "title": "🇬🇧 Британський стиль (Sky Studios)", "url": "discover/tv", "params": { "with_companies": "115331", "sort_by": "popularity.desc" } },
                { "title": "🎞️ Золота колекція", "url": "discover/movie", "params": { "with_companies": "4|33", "primary_release_date.lte": "2010-01-01", "sort_by": "vote_average.desc" } }
            ]
        },
        'syfy': {
            title: 'Syfy',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>',
            categories: [
                { "title": "Нові серіали Syfy", "url": "discover/tv", "params": { "with_networks": "77", "sort_by": "first_air_date.desc", "first_air_date.lte": "{current_date}", "vote_count.gte": "2" } },
                { "title": "Хіти телеканалу Syfy", "url": "discover/tv", "params": { "with_networks": "77", "sort_by": "popularity.desc" } },
                { "title": "Космічні подорожі та Наукова Фантастика", "url": "discover/tv", "params": { "with_networks": "77", "with_genres": "10765", "with_keywords": "3801", "sort_by": "vote_average.desc" } },
                { "title": "Містика, Жахи та Фентезі", "url": "discover/tv", "params": { "with_networks": "77", "with_genres": "9648,10765", "without_keywords": "3801", "sort_by": "popularity.desc" } }
            ]
        },
        'educational_and_reality': {
            title: 'Пізнавальне',
            icon: '<svg viewBox="0 0 24 24" fill="#FF9800"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>',
            categories: [
                {
                    "title": "Нові випуски: Discovery, NatGeo, BBC",
                    "url": "discover/tv",
                    "params": {
                        "with_networks": "64|91|43|2696|4|65",
                        "sort_by": "first_air_date.desc",
                        "first_air_date.lte": "{current_date}",
                        "vote_count.gte": "0"
                    }
                },
                { "title": "Discovery Channel: Хіти", "url": "discover/tv", "params": { "with_networks": "64", "sort_by": "popularity.desc" } },
                { "title": "National Geographic: Світ навколо", "url": "discover/tv", "params": { "with_networks": "43", "sort_by": "popularity.desc" } },
                { "title": "Animal Planet: Тварини", "url": "discover/tv", "params": { "with_networks": "91", "sort_by": "popularity.desc" } },
                { "title": "BBC Earth: Природа (Високий рейтинг)", "url": "discover/tv", "params": { "with_networks": "4", "with_genres": "99", "sort_by": "vote_average.desc", "vote_count.gte": "5" } },
                {
                    "title": "Кулінарні битви та Шеф-кухарі",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "10764",
                        "with_keywords": "222083",
                        "without_keywords": "10636,5481",
                        "sort_by": "popularity.desc"
                    }
                },
                {
                    "title": "Голос, Танці та Шоу талантів",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "10764",
                        "with_keywords": "4542|4568|2643",
                        "without_keywords": "5481,9714",
                        "sort_by": "popularity.desc"
                    }
                },
                {
                    "title": "Шоу про виживання",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "10764",
                        "with_keywords": "5481|10348",
                        "sort_by": "popularity.desc"
                    }
                },
                {
                    "title": "Наука, Техніка та Експерименти",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "99",
                        "with_keywords": "12554|4924",
                        "sort_by": "popularity.desc"
                    }
                },
                {
                    "title": "Подорожі та Туризм",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "99,10764",
                        "with_keywords": "9714",
                        "sort_by": "vote_average.desc",
                        "vote_count.gte": "20"
                    }
                },
                {
                    "title": "True Crime: Реальні розслідування",
                    "url": "discover/tv",
                    "params": {
                        "with_genres": "99",
                        "with_keywords": "10714|9840",
                        "sort_by": "popularity.desc"
                    }
                }
            ]
        }
    };

    /** Ключ TMDB: якщо в налаштуваннях вказано свій — використовується він, інакше ключ Лампи. Один ключ на всіх часто упирається в ліміти, тому свій ключ — правильний варіант. */
    function getTmdbKey() {
        var custom = (Lampa.Storage.get('likhtar_tmdb_apikey') || '').trim();
        return custom || (Lampa.TMDB && Lampa.TMDB.key ? Lampa.TMDB.key() : '');
    }

    /** Для рядка на головній: HBO/Prime/Paramount через watch_providers (TMDB), щоб отримувати і фільми, і серіали з актуальним контентом. */
    var SERVICE_WATCH_PROVIDERS_FOR_ROW = { hbo: '384', amazon: '119', paramount: '531' };

    // =================================================================
    // UTILS & COMPONENTS
    // =================================================================

    // Один елемент геро-рядка (backdrop + overlay). heightEm — висота банеру (напр. 28).
    function makeHeroResultItem(movie, heightEm) {
        heightEm = heightEm || 22.5;
        var pad = (heightEm / 35 * 2).toFixed(1);
        var titleEm = (heightEm / 35 * 2.5).toFixed(2);
        var descEm = (heightEm / 35 * 1.1).toFixed(2);
        return {
            title: 'Hero',
            params: {
                createInstance: function (element) {
                    var card = Lampa.Maker.make('Card', element, function (module) { return module.only('Card', 'Callback'); });
                    return card;
                },
                emit: {
                    onCreate: function () {
                        var img = movie.backdrop_path ? Lampa.TMDB.image('t/p/original' + movie.backdrop_path) : (movie.poster_path ? Lampa.TMDB.image('t/p/original' + movie.poster_path) : '');
                        try {
                            var item = $(this.html);
                            item.addClass('hero-banner');
                            item.css({
                                'background-image': 'url(' + img + ')',
                                'width': '100%',
                                'height': heightEm + 'em',
                                'background-size': 'cover',
                                'background-position': 'center',
                                'border-radius': '1em',
                                'position': 'relative',
                                'box-shadow': '0 0 20px rgba(0,0,0,0.5)',
                                'margin-bottom': '10px'
                            });
                            item.append('<div class="hero-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); padding: ' + pad + 'em; border-radius: 0 0 1em 1em;">' +
                                '<div class="hero-title" style="font-size: ' + titleEm + 'em; font-weight: bold; color: #fff; margin-bottom: 0.25em; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">' + (movie.title || movie.name) + '</div>' +
                                '<div class="hero-desc" style="font-size: ' + descEm + 'em; color: #ddd; max-width: 60%; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">' + (movie.overview || '') + '</div></div>');
                            item.find('.card__view').remove();
                            item.find('.card__title').remove();
                            item.find('.card__age').remove();
                            item[0].heroMovieData = movie;
                        } catch (e) { console.log('Hero onCreate error:', e); }
                    },
                    onVisible: function () {
                        try {
                            var item = $(this.html);
                            if (!item.hasClass('hero-banner')) {
                                var img = movie.backdrop_path ? Lampa.TMDB.image('t/p/original' + movie.backdrop_path) : (movie.poster_path ? Lampa.TMDB.image('t/p/original' + movie.poster_path) : '');
                                item.addClass('hero-banner');
                                item.css({
                                    'background-image': 'url(' + img + ')',
                                    'width': '100%',
                                    'height': heightEm + 'em',
                                    'background-size': 'cover',
                                    'background-position': 'center',
                                    'border-radius': '1em',
                                    'position': 'relative',
                                    'box-shadow': '0 0 20px rgba(0,0,0,0.5)',
                                    'margin-bottom': '10px'
                                });
                                item.append('<div class="hero-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); padding: ' + pad + 'em; border-radius: 0 0 1em 1em;">' +
                                    '<div class="hero-title" style="font-size: ' + titleEm + 'em; font-weight: bold; color: #fff; margin-bottom: 0.25em; text-shadow: 2px 2px 4px rgba(0,0,0,0.7);">' + (movie.title || movie.name) + '</div>' +
                                    '<div class="hero-desc" style="font-size: ' + descEm + 'em; color: #ddd; max-width: 60%; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">' + (movie.overview || '') + '</div></div>');
                                item.find('.card__view').remove();
                                item.find('.card__title').remove();
                                item.find('.card__age').remove();
                                item[0].heroMovieData = movie;
                            }
                            // Stop default image loading
                            if (this.img) this.img.onerror = function () { };
                            if (this.img) this.img.onload = function () { };
                        } catch (e) { console.log('Hero onVisible error:', e); }
                    },
                    onlyEnter: function () {
                        Lampa.Activity.push({
                            url: '',
                            component: 'full',
                            id: movie.id,
                            method: movie.name ? 'tv' : 'movie',
                            card: movie,
                            source: 'tmdb'
                        });
                    }
                }
            }
        };
    }

    function StudiosMain(object) {
        var comp = new Lampa.InteractionMain(object);
        var config = SERVICE_CONFIGS[object.service_id];
        if (!config) { comp.empty && comp.empty(); return comp; }

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var categories = config.categories;
            var network = new Lampa.Reguest();
            var total = categories.length; // No hero section
            var status = new Lampa.Status(total);

            status.onComplite = function () {
                var fulldata = [];
                // Hero section removed - only show categories
                if (status.data) {
                    Object.keys(status.data).sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); }).forEach(function (key) {
                        var num = parseInt(key, 10);
                        var data = status.data[key];
                        var cat = categories[num];
                        if (cat && data && data.results && data.results.length) {
                            Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                            fulldata.push({
                                title: cat.title,
                                results: data.results,
                                url: cat.url,
                                params: cat.params,
                                service_id: object.service_id
                            });
                        }
                    });
                }

                if (fulldata.length) {
                    _this.build(fulldata);
                    _this.activity.loader(false);
                } else {
                    _this.empty();
                }
            };

            var refCat = categories.find(function (c) { return c.params && (c.params.with_watch_providers || c.params.with_networks || c.params.with_companies); });
            var filterSuffix = '';
            if (refCat && refCat.params) {
                if (refCat.params.with_watch_providers) {
                    filterSuffix = '&with_watch_providers=' + refCat.params.with_watch_providers + '&watch_region=' + (refCat.params.watch_region || 'UA');
                } else if (refCat.params.with_networks) {
                    filterSuffix = '&with_networks=' + refCat.params.with_networks;
                } else if (refCat.params.with_companies) {
                    filterSuffix = '&with_companies=' + refCat.params.with_companies;
                }
            }

            // Hero section removed - just load categories
            categories.forEach(function (cat, index) {
                var params = [];
                params.push('api_key=' + getTmdbKey());
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

                console.log('[StudiosMain] Category', index + 1, ':', cat.title, 'URL:', url);

                network.silent(url, function (json) {
                    console.log('[StudiosMain] Category', index + 1, 'data received:', json);
                    // FIX: Normalize image paths
                    if (json && json.results && Array.isArray(json.results)) {
                        json.results.forEach(function (item) {
                            if (!item.poster_path && item.backdrop_path) {
                                item.poster_path = item.backdrop_path;
                            }
                        });
                    }
                    status.append(index.toString(), json);
                }, function () { status.error(); });
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

    // Категорії для секції «Українська стрічка» — фільми/серіали/шоу українського виробництва (TMDB)
    // Жанри TV: Reality 10764, Talk 10767
    var UKRAINIAN_FEED_CATEGORIES = [
        { title: 'Нові українські фільми', url: 'discover/movie', params: { with_origin_country: 'UA', sort_by: 'primary_release_date.desc', 'vote_count.gte': '5' } },
        { title: 'Нові українські серіали', url: 'discover/tv', params: { with_origin_country: 'UA', sort_by: 'first_air_date.desc', 'vote_count.gte': '5' } },
        { title: 'Шоу та програми', url: 'discover/tv', params: { with_origin_country: 'UA', with_genres: '10764,10767', sort_by: 'popularity.desc' } },
        { title: 'В тренді в Україні', url: 'discover/movie', params: { with_origin_country: 'UA', sort_by: 'popularity.desc' } },
        { title: 'Українські серіали в тренді', url: 'discover/tv', params: { with_origin_country: 'UA', sort_by: 'popularity.desc' } },
        { title: 'Найкращі українські фільми', url: 'discover/movie', params: { with_origin_country: 'UA', sort_by: 'vote_average.desc', 'vote_count.gte': '50' } },
        { type: 'from_global', globalKey: 'LIKHTAR_UA_MOVIES', title: 'Українські фільми (повна підбірка)' },
        { type: 'from_global', globalKey: 'LIKHTAR_UA_SERIES', title: 'Українські серіали (повна підбірка)' }
    ];

    function UkrainianFeedMain(object) {
        var comp = new Lampa.InteractionMain(object);
        var network = new Lampa.Reguest();
        var categories = UKRAINIAN_FEED_CATEGORIES;

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var requestIndices = [];
            categories.forEach(function (c, i) { if (c.type !== 'from_global') requestIndices.push(i); });
            var status = new Lampa.Status(requestIndices.length);

            status.onComplite = function () {
                var fulldata = [];
                if (status.data) {
                    Object.keys(status.data).sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); }).forEach(function (key) {
                        var data = status.data[key];
                        var cat = categories[requestIndices[parseInt(key, 10)]];
                        if (cat && data && data.results && data.results.length) {
                            Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                            fulldata.push({
                                title: cat.title,
                                results: data.results,
                                url: cat.url,
                                params: cat.params
                            });
                        }
                    });
                }
                categories.forEach(function (cat) {
                    if (cat.type === 'from_global' && cat.globalKey && window[cat.globalKey] && window[cat.globalKey].results && window[cat.globalKey].results.length) {
                        var raw = window[cat.globalKey].results;
                        var results = Array.isArray(raw) ? raw.slice(0, 100) : (raw.results || []).slice(0, 100);
                        if (results.length === 0) return;
                        Lampa.Utils.extendItemsParams(results, { style: { name: 'wide' } });
                        var mediaType = (results[0] && results[0].media_type) ? results[0].media_type : 'movie';
                        fulldata.push({
                            title: cat.title,
                            results: results,
                            url: mediaType === 'tv' ? 'discover/tv' : 'discover/movie',
                            params: { with_origin_country: 'UA' }
                        });
                    }
                });
                if (fulldata.length) {
                    _this.build(fulldata);
                    _this.activity.loader(false);
                } else {
                    _this.empty();
                }
            };

            requestIndices.forEach(function (catIndex, rIdx) {
                var cat = categories[catIndex];
                var params = ['api_key=' + getTmdbKey(), 'language=' + Lampa.Storage.get('language', 'uk')];
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
                    // FIX: Normalize image paths for all items
                    if (json && json.results && Array.isArray(json.results)) {
                        json.results.forEach(function (item) {
                            if (!item.poster_path && item.backdrop_path) {
                                item.poster_path = item.backdrop_path;
                            }
                        });
                    }
                    status.append(rIdx.toString(), json);
                }, function () { status.error(); });
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

    // Категорії для секції «Польська стрічка» — фільми/серіали/шоу польського виробництва (TMDB)
    var POLISH_FEED_CATEGORIES = [
        { title: 'Нові польські фільми', url: 'discover/movie', params: { with_origin_country: 'PL', sort_by: 'primary_release_date.desc', 'vote_count.gte': '5' } },
        { title: 'Нові польські серіали', url: 'discover/tv', params: { with_origin_country: 'PL', sort_by: 'first_air_date.desc', 'vote_count.gte': '5' } },
        { title: 'Шоу та програми', url: 'discover/tv', params: { with_origin_country: 'PL', with_genres: '10764,10767', sort_by: 'popularity.desc' } },
        { title: 'В тренді в Польщі', url: 'discover/movie', params: { with_origin_country: 'PL', sort_by: 'popularity.desc' } },
        { title: 'Польські серіали в тренді', url: 'discover/tv', params: { with_origin_country: 'PL', sort_by: 'popularity.desc' } },
        { title: 'Найкращі польські фільми', url: 'discover/movie', params: { with_origin_country: 'PL', sort_by: 'vote_average.desc', 'vote_count.gte': '50' } },
        { type: 'from_global', globalKey: 'LIKHTAR_PL_MOVIES', title: 'Польські фільми (повна підбірка)' },
        { type: 'from_global', globalKey: 'LIKHTAR_PL_SERIES', title: 'Польські серіали (повна підбірка)' },
        { type: 'from_global', globalKey: 'LIKHTAR_PL_SHOWS', title: 'Польські шоу та програми (повна підбірка)' }
    ];

    function PolishFeedMain(object) {
        var comp = new Lampa.InteractionMain(object);
        var network = new Lampa.Reguest();
        var categories = POLISH_FEED_CATEGORIES;

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            var requestIndices = [];
            categories.forEach(function (c, i) { if (c.type !== 'from_global') requestIndices.push(i); });
            var status = new Lampa.Status(requestIndices.length);

            status.onComplite = function () {
                var fulldata = [];
                if (status.data) {
                    Object.keys(status.data).sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); }).forEach(function (key) {
                        var data = status.data[key];
                        var cat = categories[requestIndices[parseInt(key, 10)]];
                        if (cat && data && data.results && data.results.length) {
                            Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                            fulldata.push({
                                title: cat.title,
                                results: data.results,
                                url: cat.url,
                                params: cat.params
                            });
                        }
                    });
                }
                categories.forEach(function (cat) {
                    if (cat.type === 'from_global' && cat.globalKey && window[cat.globalKey] && window[cat.globalKey].results && window[cat.globalKey].results.length) {
                        var raw = window[cat.globalKey].results;
                        var results = Array.isArray(raw) ? raw.slice(0, 100) : (raw.results || []).slice(0, 100);
                        if (results.length === 0) return;
                        Lampa.Utils.extendItemsParams(results, { style: { name: 'wide' } });
                        var mediaType = (results[0] && results[0].media_type) ? results[0].media_type : 'movie';
                        fulldata.push({
                            title: cat.title,
                            results: results,
                            url: mediaType === 'tv' ? 'discover/tv' : 'discover/movie',
                            params: { with_origin_country: 'PL' }
                        });
                    }
                });
                if (fulldata.length) {
                    _this.build(fulldata);
                    _this.activity.loader(false);
                } else {
                    _this.empty();
                }
            };

            requestIndices.forEach(function (catIndex, rIdx) {
                var cat = categories[catIndex];
                var params = ['api_key=' + getTmdbKey(), 'language=' + Lampa.Storage.get('language', 'uk')];
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
                    // FIX: Normalize image paths
                    if (json && json.results && Array.isArray(json.results)) {
                        json.results.forEach(function (item) {
                            if (!item.poster_path && item.backdrop_path) {
                                item.poster_path = item.backdrop_path;
                            }
                        });
                    }
                    status.append(rIdx.toString(), json);
                }, function () { status.error(); });
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
            params.push('api_key=' + getTmdbKey());
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
                // FIX: Ensure all items have poster_path for display
                // If backdrop_path exists but poster_path doesn't, use backdrop_path
                if (json && json.results && Array.isArray(json.results)) {
                    json.results.forEach(function (item) {
                        if (!item.poster_path && item.backdrop_path) {
                            item.poster_path = item.backdrop_path;
                        }
                    });
                }
                _this.build(json);
            }, this.empty.bind(this));
        };

        comp.nextPageReuest = function (object, resolve, reject) {
            network.silent(buildUrl(object.page), resolve, reject);
        };

        return comp;
    }

    // =================================================================
    // ПІДПИСКИ НА СТУДІЇ (Ліхтар — інтегровано з studio_subscription)
    // =================================================================
    var LikhtarStudioSubscription = (function () {
        var storageKey = 'likhtar_subscription_studios';

        function getParams() {
            var raw = Lampa.Storage.get(storageKey, '[]');
            return typeof raw === 'string' ? (function () { try { return JSON.parse(raw); } catch (e) { return []; } })() : (Array.isArray(raw) ? raw : []);
        }

        function setParams(params) {
            Lampa.Storage.set(storageKey, params);
        }

        function add(company) {
            var c = { id: company.id, name: company.name || '', logo_path: company.logo_path || '' };
            var studios = getParams();
            if (!studios.find(function (s) { return String(s.id) === String(c.id); })) {
                studios.push(c);
                setParams(studios);
                Lampa.Noty.show(Lampa.Lang.translate('title_bookmarked') || 'Додано в підписки');
            }
        }

        function remove(company) {
            var studios = getParams();
            var idx = studios.findIndex(function (c) { return c.id === company.id; });
            if (idx !== -1) {
                studios.splice(idx, 1);
                setParams(studios);
                Lampa.Noty.show(Lampa.Lang.translate('title_unbookmarked'));
            }
        }

        function isSubscribed(company) {
            return !!getParams().find(function (c) { return c.id === company.id; });
        }

        function injectButton(object) {
            var attempts = 0;
            var interval = setInterval(function () {
                var nameEl = $('.company-start__name');
                var company = object.company;
                if (!nameEl.length || !company || !company.id) {
                    attempts++;
                    if (attempts > 25) clearInterval(interval);
                    return;
                }
                clearInterval(interval);
                if (nameEl.find('.studio-subscription-btn').length) return;

                var btn = $('<div class="studio-subscription-btn selector"></div>');

                function updateState() {
                    var sub = isSubscribed(company);
                    btn.text(sub ? 'Відписатися' : 'Підписатися');
                    btn.removeClass('studio-subscription-btn--sub studio-subscription-btn--unsub').addClass(sub ? 'studio-subscription-btn--unsub' : 'studio-subscription-btn--sub');
                }

                function doToggle() {
                    if (isSubscribed(company)) remove(company);
                    else add({ id: company.id, name: company.name || '', logo_path: company.logo_path || '' });
                    updateState();
                }

                btn.on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    doToggle();
                });
                btn.on('hover:enter', doToggle);

                updateState();
                nameEl.append(btn);

                // Auto-focus the subscription button so it's visible immediately
                setTimeout(function () {
                    try {
                        if (Lampa.Controller && Lampa.Controller.collectionFocus) {
                            Lampa.Controller.collectionFocus(btn[0]);
                        }
                    } catch (e) { }
                }, 300);
            }, 200);
        }

        function registerComponent() {
            var langSubs = { en: 'My subscriptions', ru: 'Мои подписки', uk: 'Мої підписки', be: 'Мае падпіскі' };
            Lampa.Lang.add({
                title_studios_subscription: { en: 'Studios', ru: 'Студии', uk: 'Студії', be: 'Студыі' },
                likhtar_my_subscriptions: langSubs
            });

            Lampa.Component.add('studios_subscription', function (object) {
                var comp = new Lampa.InteractionMain(object);
                var network = new Lampa.Reguest();
                var studios = getParams();
                var limitPerStudio = 20;

                comp.create = function () {
                    var _this = this;
                    this.activity.loader(true);
                    if (!studios.length) {
                        this.empty();
                        this.activity.loader(false);
                        return this.render();
                    }
                    var status = new Lampa.Status(studios.length);
                    status.onComplite = function () {
                        var fulldata = [];
                        if (status.data) {
                            Object.keys(status.data).sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); }).forEach(function (key) {
                                var data = status.data[key];
                                var studio = studios[parseInt(key, 10)];
                                if (studio && data && data.results && data.results.length) {
                                    Lampa.Utils.extendItemsParams && Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                                    fulldata.push({
                                        title: studio.name || ('Студія ' + studio.id),
                                        results: (data.results || []).slice(0, limitPerStudio),
                                        url: 'discover/movie',
                                        params: { with_companies: String(studio.id), sort_by: 'primary_release_date.desc' }
                                    });
                                }
                            });
                        }
                        if (fulldata.length) {
                            _this.build(fulldata);
                        } else {
                            _this.empty();
                        }
                        _this.activity.loader(false);
                    };
                    studios.forEach(function (studio, index) {
                        var url = Lampa.TMDB.api('discover/movie?api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk') + '&with_companies=' + encodeURIComponent(studio.id) + '&sort_by=primary_release_date.desc&page=1');
                        network.silent(url, function (json) {
                            // FIX: Normalize image paths
                            if (json && json.results && Array.isArray(json.results)) {
                                json.results.forEach(function (item) {
                                    if (!item.poster_path && item.backdrop_path) {
                                        item.poster_path = item.backdrop_path;
                                    }
                                });
                            }
                            status.append(index.toString(), json);
                        }, function () { status.error(); });
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
            });

            var menuLine = $('<li class="menu__item selector" data-action="studios_subscription"><div class="menu__ico"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M437 75a68 68 0 00-47.5-19.5h-267A68 68 0 0075 123.5v265A68 68 0 00122.5 456h267a68 68 0 0047.5-19.5H437A68 68 0 00456.5 388.5v-265A68 68 0 00437 75zM122.5 94h267a28 28 0 0128 28v265a28 28 0 01-28 28h-267a28 28 0 01-28-28v-265a28 28 0 0128-28z"></path></svg></div><div class="menu__text">' + (Lampa.Lang.translate('likhtar_my_subscriptions') || 'Мої підписки') + '</div></li>');
            var target = $('.menu .menu__list .menu__item[data-action="subscribes"]');
            if (target.length) target.after(menuLine);
            else $('.menu .menu__list').append(menuLine);

            menuLine.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: Lampa.Lang.translate('likhtar_my_subscriptions') || 'Мої підписки',
                    component: 'studios_subscription',
                    page: 1
                });
            });
        }

        return {
            init: function () {
                var existing = Lampa.Storage.get(storageKey, '[]');
                var fromOld = Lampa.Storage.get('subscription_studios', '[]');
                if ((!existing || existing === '[]' || (Array.isArray(existing) && !existing.length)) && fromOld && fromOld !== '[]') {
                    try {
                        var arr = typeof fromOld === 'string' ? JSON.parse(fromOld) : fromOld;
                        if (Array.isArray(arr) && arr.length) setParams(arr);
                    } catch (e) { }
                }
                registerComponent();
                Lampa.Listener.follow('activity', function (e) {
                    if (e.type === 'start' && e.component === 'company') injectButton(e.object);
                });
            }
        };
    })();

    // =================================================================
    // MAIN PAGE ROWS
    // =================================================================

    // ========== Прибираємо секцію Shots ==========
    function removeShotsSection() {
        function doRemove() {
            $('.items-line').each(function () {
                var title = $(this).find('.items-line__title').text().trim();
                if (title === 'Shots' || title === 'shots') {
                    $(this).remove();
                }
            });
        }
        // Виконуємо із затримкою, бо Shots може підвантажитись пізніше
        setTimeout(doRemove, 1000);
        setTimeout(doRemove, 3000);
        setTimeout(doRemove, 6000);
    }

    // ========== ROW 1: HERO SLIDER (New Releases) ==========
    function addHeroRow() {
        Lampa.ContentRows.add({
            index: 0,
            name: 'custom_hero_row',
            title: 'Новинки прокату', // "New Releases"
            screen: ['main'],
            call: function (params) {
                return function (callback) {
                    var network = new Lampa.Reguest();
                    // Fetch Now Playing movies (Fresh releases)
                    var url = Lampa.TMDB.api('movie/now_playing?api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk') + '&region=UA');

                    network.silent(url, function (json) {
                        var items = json.results || [];
                        if (!items.length) {
                            // Fallback if no fresh movies
                            url = Lampa.TMDB.api('trending/all/week?api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk'));
                            network.silent(url, function (retryJson) {
                                items = retryJson.results || [];
                                build(items);
                            });
                            return;
                        }
                        build(items);

                        function build(movies) {
                            var moviesWithBackdrop = movies.filter(function (m) { return m.backdrop_path; });
                            var results = moviesWithBackdrop.slice(0, 15).map(function (movie) { return makeHeroResultItem(movie, 22.5); });

                            callback({
                                results: results,
                                title: '🔥 Новинки прокату', // Title visible above the row
                                params: {
                                    items: {
                                        mapping: 'line',
                                        view: 15
                                    }
                                }
                            });
                        }

                    }, function () {
                        callback({ results: [] });
                    });
                };
            }
        });
    }

    // ========== ROW 2: STUDIOS (Moved Up) ==========
    function addStudioRow() {
        var studios = [
            { id: 'netflix', name: 'Netflix', img: LIKHTAR_BASE_URL + 'logos/netflix.svg', providerId: '8' },
            { id: 'disney', name: 'Disney+', img: LIKHTAR_BASE_URL + 'logos/disney.svg', providerId: '337' },
            { id: 'hbo', name: 'HBO', img: LIKHTAR_BASE_URL + 'logos/hbo.svg', providerId: '384' },
            { id: 'apple', name: 'Apple TV+', img: LIKHTAR_BASE_URL + 'logos/apple.svg', providerId: '350' },
            { id: 'amazon', name: 'Prime Video', img: LIKHTAR_BASE_URL + 'logos/amazon.png', providerId: '119' },
            { id: 'hulu', name: 'Hulu', img: LIKHTAR_BASE_URL + 'logos/Hulu.svg', providerId: '15' },
            { id: 'paramount', name: 'Paramount+', img: LIKHTAR_BASE_URL + 'logos/paramount.svg', providerId: '531' },
            { id: 'sky_showtime', name: 'Sky Showtime', img: LIKHTAR_BASE_URL + 'logos/SkyShowtime.svg' },
            { id: 'syfy', name: 'Syfy', img: LIKHTAR_BASE_URL + 'logos/Syfy.svg', networkId: '77' },
            { id: 'educational_and_reality', name: 'Пізнавальне', img: LIKHTAR_BASE_URL + 'logos/Discovery.svg' },
            { id: 'ukrainian_feed', name: 'Українська стрічка', isUkrainianFeed: true },
            { id: 'polish_feed', name: 'Польська стрічка', isPolishFeed: true }
        ];

        // Перевірка нового контенту за останні 7 днів
        function checkNewContent(studio, cardElement) {
            if (!studio.providerId && !studio.networkId) return;
            var d = new Date();
            var today = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
            var weekAgo = new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000);
            var weekAgoStr = [weekAgo.getFullYear(), ('0' + (weekAgo.getMonth() + 1)).slice(-2), ('0' + weekAgo.getDate()).slice(-2)].join('-');

            var apiKey = 'api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk');
            var filter = studio.providerId
                ? '&with_watch_providers=' + studio.providerId + '&watch_region=UA'
                : '&with_networks=' + studio.networkId;

            var url = Lampa.TMDB.api('discover/movie?' + apiKey + '&sort_by=primary_release_date.desc&primary_release_date.gte=' + weekAgoStr + '&primary_release_date.lte=' + today + '&vote_count.gte=1' + filter);

            var network = new Lampa.Reguest();
            network.timeout(5000);
            network.silent(url, function (json) {
                if (json.results && json.results.length > 0) {
                    cardElement.find('.card__view').append('<div class="studio-new-badge">NEW</div>');
                } else {
                    // Спробуємо TV
                    var urlTV = Lampa.TMDB.api('discover/tv?' + apiKey + '&sort_by=first_air_date.desc&first_air_date.gte=' + weekAgoStr + '&first_air_date.lte=' + today + '&vote_count.gte=1' + filter);
                    network.silent(urlTV, function (json2) {
                        if (json2.results && json2.results.length > 0) {
                            cardElement.find('.card__view').append('<div class="studio-new-badge">NEW</div>');
                        }
                    });
                }
            });
        }

        Lampa.ContentRows.add({
            index: 1, // After Hero (0)
            name: 'custom_studio_row',
            title: 'Стрімінги',
            screen: ['main'],
            call: function (params) {
                return function (callback) {
                    var items = studios.map(function (s) {
                        var isUkrainianFeed = s.isUkrainianFeed === true;
                        var isPolishFeed = s.isPolishFeed === true;
                        return {
                            title: s.name,
                            params: {
                                createInstance: function () {
                                    var card = Lampa.Maker.make('Card', this, function (module) {
                                        return module.only('Card', 'Callback');
                                    });
                                    return card;
                                },
                                emit: {
                                    onCreate: function () {
                                        var item = $(this.html);
                                        item.addClass('card--studio');
                                        if (isUkrainianFeed) {
                                            item.find('.card__view').empty().html(
                                                '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:0.4em;text-align:center;font-weight:700;font-size:1.05em;line-height:1.2;">' +
                                                '<span style="color:#0057b7;">Українська</span>' +
                                                '<span style="color:#ffd700;">стрічка</span>' +
                                                '</div>'
                                            );
                                        } else if (isPolishFeed) {
                                            item.find('.card__view').empty().html(
                                                '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:0.4em;text-align:center;font-weight:700;font-size:1.05em;line-height:1.2;">' +
                                                '<span style="color:#c41e3a;">Польська</span>' +
                                                '<span style="color:#8b0000;">стрічка</span>' +
                                                '</div>'
                                            );
                                        } else {
                                            // Use background-size: contain with padding to handle all aspect ratios uniformly
                                            item.find('.card__view').empty().css({
                                                'background-image': 'url(' + s.img + ')',
                                                'background-position': 'center',
                                                'background-repeat': 'no-repeat',
                                                'background-size': 'contain'
                                            });
                                            checkNewContent(s, item);
                                        }
                                        item.find('.card__age, .card__year, .card__type, .card__textbox, .card__title').remove();
                                    },
                                    onlyEnter: function () {
                                        if (isUkrainianFeed) {
                                            Lampa.Activity.push({
                                                url: '',
                                                title: 'Українська стрічка',
                                                component: 'ukrainian_feed',
                                                page: 1
                                            });
                                            return;
                                        }
                                        if (isPolishFeed) {
                                            Lampa.Activity.push({
                                                url: '',
                                                title: 'Польська стрічка',
                                                component: 'polish_feed',
                                                page: 1
                                            });
                                            return;
                                        }
                                        Lampa.Activity.push({
                                            url: '',
                                            title: s.name,
                                            component: 'studios_main',
                                            service_id: s.id,
                                            page: 1
                                        });
                                    }
                                }
                            }
                        };
                    });

                    callback({
                        results: items,
                        title: '📺 Стрімінги',
                        params: {
                            items: {
                                view: 15,
                                mapping: 'line'
                            }
                        }
                    });
                };
            }
        });
    }

    // ========== ROW: НОВИНКИ УКРАЇНСЬКОЇ СТРІЧКИ ==========
    function addUkrainianContentRow() {
        Lampa.ContentRows.add({
            index: 3, // Hero(0), Studios(1), Mood(2), then Ukrainian(3)
            name: 'ukrainian_content_row',
            title: 'Новинки української стрічки',
            screen: ['main'],
            call: function (params) {
                return function (callback) {
                    var network = new Lampa.Reguest();
                    var results = [];
                    var apiKey = 'api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk');
                    var d = new Date();
                    var currentDate = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                    var urlMovie = Lampa.TMDB.api('discover/movie?' + apiKey + '&sort_by=primary_release_date.desc&primary_release_date.lte=' + currentDate + '&with_origin_country=UA&vote_count.gte=3');
                    var urlTV = Lampa.TMDB.api('discover/tv?' + apiKey + '&sort_by=first_air_date.desc&first_air_date.lte=' + currentDate + '&with_origin_country=UA&vote_count.gte=3');

                    network.silent(urlMovie, function (json1) {
                        if (json1.results) results = results.concat(json1.results);
                        network.silent(urlTV, function (json2) {
                            if (json2.results) results = results.concat(json2.results);
                            results.sort(function (a, b) {
                                var dateA = new Date(a.release_date || a.first_air_date || '2000-01-01');
                                var dateB = new Date(b.release_date || b.first_air_date || '2000-01-01');
                                return dateB - dateA;
                            });
                            var unique = [];
                            var seen = {};
                            results.forEach(function (item) {
                                if (!seen[item.id]) { seen[item.id] = true; unique.push(item); }
                            });
                            callback({
                                results: unique.slice(0, 20),
                                title: '🇺🇦 Новинки української стрічки',
                                params: {
                                    items: { mapping: 'line', view: 15 }
                                }
                            });
                        });
                    });
                };
            }
        });
    }

    // ========== ROW 3: MOOD BUTTONS (Кіно під настрій) ==========
    // Жанри TMDB: Драма 18, Комедія 35, Мультфільм 16, Сімейний 10751, Документальний 99, Бойовик 28, Мелодрама 10749, Трилер 53, Кримінал 80, Пригоди 12, Жахи 27, Фентезі 14
    function addMoodRow() {
        var moods = [
            { genres: [18], text: 'До сліз / Катарсис' },
            { genres: [35], text: 'Чистий позитив' },
            { genres: [16, 10751, 99], text: 'Смачний перегляд' },
            { genres: [28], text: 'Адреналін' },
            { genres: [10749], text: 'Метелики в животі' },
            { genres: [53, 80], text: 'На межі / Напруга' },
            { genres: [12], text: 'Пошук пригод' },
            { genres: [35, 27], text: 'Разом веселіше' },
            { genres: [10751, 14], text: 'Малим і дорослим' },
            { random: true, text: 'На твій смак' }
        ];

        Lampa.ContentRows.add({
            index: 2, // Right after Streamings (1)
            name: 'custom_mood_row',
            title: 'Кіно під настрій',
            screen: ['main'],
            call: function (params) {
                return function (callback) {
                    var network = new Lampa.Reguest();
                    var items = moods.map(function (m) {
                        var isRandom = m.random === true;
                        return {
                            title: m.text,
                            params: {
                                createInstance: function () {
                                    var card = Lampa.Maker.make('Card', this, function (module) {
                                        return module.only('Card', 'Callback');
                                    });
                                    return card;
                                },
                                emit: {
                                    onCreate: function () {
                                        var item = $(this.html);
                                        item.addClass('card--mood');
                                        item.find('.card__view').empty().append(
                                            '<div class="mood-content"><div class="mood-text">' + m.text + '</div></div>'
                                        );
                                        item.find('.card__age, .card__year, .card__type, .card__textbox, .card__title').remove();
                                    },
                                    onlyEnter: function () {
                                        if (isRandom) {
                                            var page = Math.floor(Math.random() * 5) + 1;
                                            var url = Lampa.TMDB.api('discover/movie?api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk') + '&sort_by=popularity.desc&vote_count.gte=100&page=' + page);
                                            network.silent(url, function (json) {
                                                var list = json.results || [];
                                                if (list.length === 0) return;
                                                var pick = list[Math.floor(Math.random() * list.length)];
                                                Lampa.Activity.push({
                                                    url: '',
                                                    component: 'full',
                                                    id: pick.id,
                                                    method: 'movie',
                                                    card: pick,
                                                    source: 'tmdb'
                                                });
                                            });
                                            return;
                                        }
                                        var genreStr = (m.genres || []).join(',');
                                        Lampa.Activity.push({
                                            url: 'discover/movie?with_genres=' + genreStr + '&sort_by=popularity.desc',
                                            title: m.text,
                                            component: 'category_full',
                                            page: 1,
                                            source: 'tmdb'
                                        });
                                    }
                                }
                            }
                        };
                    });

                    callback({
                        results: items,
                        title: '🎭 Кіно під настрій',
                        params: {
                            items: {
                                view: 10,
                                mapping: 'line'
                            }
                        }
                    });
                };
            }
        });
    }

    function addStyles() {
        $('#custom_main_page_css').remove();
        $('body').append(`
            <style id="custom_main_page_css">
                /* Hero Banner (‑20%: 22em) */
                .card.hero-banner { 
                    width: 52vw !important; 
                    height: 25em !important;
                    margin: 0 1.5em 0.3em 0 !important; /* Reduced bottom margin */
                    display: inline-block; 
                    scroll-snap-align: start; /* Smart Snap */
                    scroll-margin-left: 1.5em !important; /* Force indentation for every card */
                }
                
                /* Container Snap (Fallback) */
                .scroll__content:has(.hero-banner) {
                    scroll-snap-type: x mandatory;
                    padding-left: 1.5em !important;
                }
                .scroll--mask .scroll__content {
                    padding: 1.2em 1em 1em;
                }
                
                /* Global Row Spacing Reduction */
                .row--card {
                     margin-bottom: -1.2em !important; /* Pull rows closer by ~40% */
                }
                
                .items-line {
                    padding-bottom: 2em !important;
                }

                /* Mood Buttons */
                .card--mood {
                    width: 12em !important;
                    height: 4em !important;
                    border-radius: 1em;
                    margin-bottom: 0 !important;
                    background: linear-gradient(145deg, #2a2a2a, #1f1f1f);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    transition: transform 0.2s, box-shadow 0.2s;
                    overflow: visible; 
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .card--mood.focus {
                    transform: scale(1.05);
                    box-shadow: 0 0 0 3px #fff;
                    background: #333;
                    z-index: 10;
                }
                .card--mood .card__view {
                    width: 100%;
                    height: 100%;
                    padding-bottom: 0 !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden; 
                    border-radius: 1em;
                }
                .mood-content {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .mood-text {
                    color: #fff;
                    font-size: 1.1em;
                    font-weight: 500;
                    text-align: center;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding: 0 0.5em;
                }

                /* Studio Buttons */
                .card--studio {
                    width: 12em !important;
                    padding: 5px !important;
                    padding-bottom: 0 !important;
                    height: 6.75em !important; /* 16:9 ratio approx */
                    background-color: #fff;
                    border-radius: 0.6em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .card--studio.focus {
                    transform: scale(1.1);
                    box-shadow: 0 0 15px rgba(255,255,255,0.8);
                    z-index: 10;
                }
                .card--studio .card__view {
                    width: 100%;
                    height: 100%;
                    padding: 1em !important; 
                    padding-bottom: 1em !important;
                    box-sizing: border-box !important;
                    background-origin: content-box;
                    display: block; 
                    position: relative;
                }
                /* Removed img/svg specific styles as we now use background-image */
                /* Consolidated Styles for StudioJS Widths */
                .studios_main .card--wide, .studios_view .card--wide { width: 18.3em !important; }
                .studios_view .category-full { padding-top: 1em; }
                /* Кнопка підписки на студію — у стилі міток (UA, 4K, HDR), ~50% розміру */
                .studio-subscription-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    vertical-align: middle;
                    margin-left: 0.4em;
                    padding: 0.18em 0.22em;
                    font-size: 0.4em;
                    font-weight: 800;
                    line-height: 1;
                    letter-spacing: 0.02em;
                    border-radius: 0.25em;
                    border: 1px solid rgba(255,255,255,0.2);
                    cursor: pointer;
                    transition: box-shadow 0.15s, transform 0.15s;
                }
                .company-start__name {
                    display: inline-flex;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .studio-subscription-btn.studio-subscription-btn--sub {
                    background: linear-gradient(135deg, #1565c0, #42a5f5);
                    color: #fff;
                    border-color: rgba(66,165,245,0.4);
                }
                .studio-subscription-btn.studio-subscription-btn--unsub {
                    background: linear-gradient(135deg, #37474f, #78909c);
                    color: #fff;
                    border-color: rgba(120,144,156,0.4);
                }
                .studio-subscription-btn.focus {
                    box-shadow: 0 0 0 2px #fff;
                    transform: scale(1.05);
                }

                /* Кнопка "На сторінку" — ідеальні пропорції постеру Lampa */
                .items-line .scroll__body .service-more-card.card,
                .studios_main .service-more-card.card,
                .studios_view .service-more-card.card {
                    width: 14em !important;
                    min-width: 14em !important;
                    max-width: 14em !important;
                    aspect-ratio: 2/3;
                    flex: 0 0 14em !important;
                    background: transparent;
                    box-shadow: none;
                }
                /* Адаптив під менші екрани, як у стандартних карток */
                @media (max-width: 1400px) {
                    .items-line .scroll__body .service-more-card.card {
                        width: 11.5em !important; min-width: 11.5em !important; max-width: 11.5em !important; flex: 0 0 11.5em !important;
                    }
                }
                
                .service-more-card .card-more__box {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(40,40,40,0.95);
                    border-radius: 0.6em;
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 0.6em;
                    box-sizing: border-box;
                    transition: transform 0.2s, background 0.2s;
                }
                .service-more-card.focus .card-more__box {
                    background: #fff;
                    color: #000;
                    transform: scale(1.05);
                }
                .service-more-card .card-more__title {
                    font-size: 1.05em;
                    font-weight: 700;
                    text-align: center;
                    line-height: 1.4;
                    margin: 0;
                    color: inherit;
                }

            </style>
        `);
    }

    // =================================================================
    // LIKHTAR QUALITY MARKS (Jacred)
    // =================================================================

    function initMarksJacRed() {
        var svgIcons = {
            '4K': '<span style="font-weight:800;font-size:0.85em;color:#ff9800;">4K</span>',
            'UKR': '<span style="font-weight:800;font-size:0.85em;color:#4fc3f7;">UA</span>',
            'HDR': '<span style="font-weight:800;font-size:0.85em;color:#ffeb3b;">HDR</span>'
        };

        var workingProxy = null;
        var proxies = [
            'https://myfinder.kozak-bohdan.workers.dev/?key=lmp_2026_JacRed_K9xP7aQ4mV2E&url=',
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?url='
        ];

        function fetchWithProxy(url, callback) {
            // Спочатку пробуємо Lampa.Reguest (вбудований проксі Лампи)
            try {
                var network = new Lampa.Reguest();
                network.timeout(10000);
                network.silent(url, function (json) {
                    console.log('[JacRed] Direct success via Lampa.Reguest');
                    var text = typeof json === 'string' ? json : JSON.stringify(json);
                    workingProxy = 'direct';
                    callback(null, text);
                }, function () {
                    console.log('[JacRed] Direct Lampa.Reguest failed, trying proxies...');
                    tryProxies(url, callback);
                });
            } catch (e) {
                tryProxies(url, callback);
            }
        }

        function tryProxies(url, callback) {
            var proxyList = (workingProxy && workingProxy !== 'direct') ? [workingProxy] : proxies;

            function tryProxy(index) {
                if (index >= proxyList.length) {
                    console.error('[JacRed] All proxies failed for:', url);
                    callback(new Error('No proxy worked'));
                    return;
                }
                var p = proxyList[index];
                var target = p.indexOf('url=') > -1 ? p + encodeURIComponent(url) : p + url;
                console.log('[JacRed] Fetching via proxy:', target);

                var xhr = new XMLHttpRequest();
                xhr.open('GET', target, true);
                xhr.onload = function () {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        console.log('[JacRed] Proxy success:', p);
                        workingProxy = p;
                        callback(null, xhr.responseText);
                    } else {
                        console.warn('[JacRed] Proxy failed:', xhr.status, p);
                        tryProxy(index + 1);
                    }
                };
                xhr.onerror = function () {
                    console.warn('[JacRed] Proxy error:', p);
                    tryProxy(index + 1);
                };
                xhr.timeout = 10000;
                xhr.ontimeout = function () {
                    console.warn('[JacRed] Proxy timeout:', p);
                    tryProxy(index + 1);
                };
                xhr.send();
            }
            tryProxy(0);
        }

        var _jacredCache = {};

        function getBestJacred(card, callback) {
            var cacheKey = 'jacred_v3_' + card.id;

            // In-memory cache (миттєвий)
            if (_jacredCache[cacheKey]) {
                console.log('[JacRed] mem-cache HIT:', cacheKey);
                callback(_jacredCache[cacheKey]);
                return;
            }

            // localStorage cache (переживає перезавантаження)
            try {
                var raw = Lampa.Storage.get(cacheKey, '');
                if (raw && typeof raw === 'object' && raw._ts && (Date.now() - raw._ts < 48 * 60 * 60 * 1000)) {
                    console.log('[JacRed] storage-cache HIT:', cacheKey, raw);
                    _jacredCache[cacheKey] = raw;
                    callback(raw);
                    return;
                }
            } catch (e) { }

            console.log('[JacRed] cache MISS for', cacheKey);

            var title = (card.original_title || card.title || card.name || '').toLowerCase();
            var year = (card.release_date || card.first_air_date || '').substr(0, 4);
            console.log('[JacRed] title:', title, 'year:', year, 'release_date:', card.release_date, 'first_air_date:', card.first_air_date);

            if (!title || !year) {
                console.warn('[JacRed] SKIP: no title or year');
                callback(null);
                return;
            }

            var releaseDate = new Date(card.release_date || card.first_air_date);
            console.log('[JacRed] releaseDate:', releaseDate, 'now:', new Date(), 'future?', releaseDate.getTime() > Date.now());
            if (releaseDate && releaseDate.getTime() > Date.now()) {
                console.warn('[JacRed] SKIP: future release');
                callback(null);
                return;
            }

            var apiUrl = 'https://jr.maxvol.pro/api/v1.0/torrents?search=' + encodeURIComponent(title) + '&year=' + year;
            console.log('[JacRed] API URL:', apiUrl);

            fetchWithProxy(apiUrl, function (err, data) {
                if (err || !data) {
                    callback(null);
                    return;
                }

                try {
                    var parsed;
                    try {
                        parsed = JSON.parse(data);
                    } catch (e) {
                        console.error('[JacRed] JSON Parse Error:', e);
                        console.log('[JacRed] Raw Data:', data);
                        callback(null);
                        return;
                    }

                    // Handle AllOrigins wrapper if present
                    if (parsed.contents) {
                        try {
                            parsed = JSON.parse(parsed.contents);
                        } catch (e) {
                            console.log('[JacRed] Failed to parse inner contents, using raw');
                        }
                    }

                    var results = Array.isArray(parsed) ? parsed : (parsed.Results || []);
                    console.log('[JacRed] Parsed results:', results.length);

                    if (!results.length) {
                        var emptyData = { empty: true, _ts: Date.now() };
                        _jacredCache[cacheKey] = emptyData;
                        try { Lampa.Storage.set(cacheKey, emptyData); } catch (e) { }
                        callback(null);
                        return;
                    }

                    var best = { resolution: 'SD', ukr: false, eng: false, hdr: false };
                    var resOrder = ['SD', 'HD', 'FHD', '2K', '4K'];

                    results.forEach(function (item) {
                        var t = (item.title || '').toLowerCase();

                        var currentRes = 'SD';
                        if (t.indexOf('4k') >= 0 || t.indexOf('2160') >= 0 || t.indexOf('uhd') >= 0) currentRes = '4K';
                        else if (t.indexOf('2k') >= 0 || t.indexOf('1440') >= 0) currentRes = '2K';
                        else if (t.indexOf('1080') >= 0 || t.indexOf('fhd') >= 0 || t.indexOf('full hd') >= 0) currentRes = 'FHD';
                        else if (t.indexOf('720') >= 0 || t.indexOf('hd') >= 0) currentRes = 'HD';

                        if (resOrder.indexOf(currentRes) > resOrder.indexOf(best.resolution)) {
                            best.resolution = currentRes;
                        }

                        if (t.indexOf('ukr') >= 0 || t.indexOf('укр') >= 0 || t.indexOf('ua') >= 0 || t.indexOf('ukrainian') >= 0) {
                            best.ukr = true;
                        }

                        if (t.indexOf('eng') >= 0 || t.indexOf('english') >= 0 || t.indexOf('multi') >= 0) {
                            best.eng = true;
                        }

                        if (t.indexOf('dolby vision') >= 0 || t.indexOf('dolbyvision') >= 0) {
                            best.hdr = true;
                            best.dolbyVision = true;
                        } else if (t.indexOf('hdr') >= 0) {
                            best.hdr = true;
                        }
                    });

                    if (card.original_language === 'uk') best.ukr = true;
                    if (card.original_language === 'en') best.eng = true;

                    best._ts = Date.now();
                    _jacredCache[cacheKey] = best;
                    try { Lampa.Storage.set(cacheKey, best); } catch (e) { }
                    console.log('[JacRed] RESULT for', card.id, ':', JSON.stringify(best));
                    callback(best);

                } catch (e) {
                    callback(null);
                }
            });
        }

        function createBadge(cssClass, label) {
            var badge = document.createElement('div');
            badge.classList.add('card__mark');
            badge.classList.add('card__mark--' + cssClass);
            badge.textContent = label;
            return badge;
        }

        // Вставити мітки в повну картку (спільна логіка для події та вже відкритої сторінки)
        function injectFullCardMarks(movie, renderEl) {
            if (!movie || !movie.id || !renderEl) return;
            var $render = $(renderEl);
            var rateLine = $render.find('.full-start-new__rate-line').first();
            if (!rateLine.length) return;
            if (rateLine.find('.jacred-info-marks-v2').length) return;
            var marksContainer = $('<div class="jacred-info-marks-v2"></div>');
            rateLine.prepend(marksContainer);
            console.log('[JacRed] full card: injecting marks for', movie.id, movie.title || movie.name);
            getBestJacred(movie, function (data) {
                if (data && !data.empty) {
                    renderInfoRowBadges(marksContainer, data);
                }
            });
        }

        // ——— Повна картка: подія 'full' + обробка вже відкритої (deep link ?card=...) ———
        function initFullCardMarks() {
            if (!Lampa.Listener || !Lampa.Listener.follow) return;
            Lampa.Listener.follow('full', function (e) {
                if (e.type !== 'complite') return;
                var movie = e.data && e.data.movie;
                var renderEl = e.object && e.object.activity && e.object.activity.render && e.object.activity.render();
                injectFullCardMarks(movie, renderEl);
            });
            // Якщо відкрили по силці ?card=..., повна картка вже є до нашого init — обробити її одразу
            setTimeout(function () {
                try {
                    var act = Lampa.Activity && Lampa.Activity.active && Lampa.Activity.active();
                    if (!act || act.component !== 'full') return;
                    var movie = act.card || act.movie;
                    var renderEl = act.activity && act.activity.render && act.activity.render();
                    injectFullCardMarks(movie, renderEl);
                } catch (err) {
                    console.warn('[JacRed] full card catch-up:', err);
                }
            }, 300);
        }

        // Картки на головній: MutationObserver тільки для .card (повну картку обробляємо через подію full)
        function processCards() {
            $('.card:not(.jacred-mark-processed-v2)').each(function () {
                var card = $(this);
                card.addClass('jacred-mark-processed-v2');

                // Hero-банери зберігають movie в heroMovieData
                var movie = card[0].heroMovieData || card.data('item') || (card[0] && (card[0].card_data || card[0].item)) || null;
                if (movie && movie.id && !movie.size) {
                    // Hero-банери не мають .card__view — додаємо прямо на елемент
                    if (card.hasClass('hero-banner')) {
                        addMarksToContainer(card, movie, null);
                    } else {
                        addMarksToContainer(card, movie, '.card__view');
                    }
                }
            });
        }

        function observeCardRows() {
            var observer = new MutationObserver(function () {
                processCards();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            processCards();
        }

        function renderInfoRowBadges(container, data) {
            container.empty();

            // UA+ for Ukrainian audio (simple text, styled like native tags)
            if (data.ukr) {
                var uaTag = $('<div class="full-start__pg"></div>');
                uaTag.text('UA+');
                container.append(uaTag);
            }

            // Quality: 4K, 1080p, etc.
            if (data.resolution && data.resolution !== 'SD') {
                var resText = data.resolution;
                if (resText === 'FHD') resText = '1080p';
                else if (resText === 'HD') resText = '720p';

                var qualityTag = $('<div class="full-start__pg"></div>');
                qualityTag.text(resText);
                container.append(qualityTag);
            }

            // HDR / Dolby Vision
            if (data.hdr) {
                var hdrTag = $('<div class="full-start__pg"></div>');
                hdrTag.text(data.dolbyVision ? 'Dolby Vision' : 'HDR');
                container.append(hdrTag);
            }
        }

        // Перевірка на uafix.net — спочатку BanderaOnline API, fallback — прямий парсинг
        var _uafixCache = {};

        function checkUafixBandera(movie, callback) {
            var title = movie.title || movie.name || '';
            var origTitle = movie.original_title || movie.original_name || '';
            var imdbId = movie.imdb_id || '';
            var type = movie.name ? 'series' : 'movie';

            var url = 'https://banderabackend.lampame.v6.rocks/api/v2/search?source=uaflix';
            if (title) url += '&title=' + encodeURIComponent(title);
            if (origTitle) url += '&original_title=' + encodeURIComponent(origTitle);
            if (imdbId) url += '&imdb_id=' + encodeURIComponent(imdbId);
            url += '&type=' + type;

            var network = new Lampa.Reguest();
            network.timeout(5000);
            network.silent(url, function (json) {
                callback(json && json.ok && json.items && json.items.length > 0);
            }, function () {
                callback(null); // null = невідомо, спробуємо fallback
            });
        }

        function checkUafixDirect(movie, callback) {
            // Прямий парсинг uafix.net через пошук DLE
            var query = movie.original_title || movie.original_name || movie.title || movie.name || '';
            if (!query) return callback(false);

            var searchUrl = 'https://uafix.net/index.php?do=search&subaction=search&story=' + encodeURIComponent(query);

            fetchWithProxy(searchUrl, function (err, html) {
                if (err || !html) return callback(false);
                // Перевіряємо чи є результати пошуку (DLE повертає "знайдено X відповідей")
                var hasResults = html.indexOf('знайдено') >= 0 && html.indexOf('0 відповідей') < 0;
                callback(hasResults);
            });
        }

        function checkUafix(movie, callback) {
            if (!movie || !movie.id) return callback(false);
            var key = 'uafix_' + movie.id;
            if (_uafixCache[key] !== undefined) return callback(_uafixCache[key]);

            // Спочатку BanderaOnline API
            checkUafixBandera(movie, function (result) {
                if (result !== null) {
                    // API відповів
                    _uafixCache[key] = result;
                    callback(result);
                } else {
                    // API недоступний — fallback на прямий парсинг
                    checkUafixDirect(movie, function (found) {
                        _uafixCache[key] = found;
                        callback(found);
                    });
                }
            });
        }

        function addMarksToContainer(element, movie, viewSelector) {
            var containerParent = viewSelector ? element.find(viewSelector) : element;
            var marksContainer = containerParent.find('.card-marks');

            if (!marksContainer.length) {
                marksContainer = $('<div class="card-marks"></div>');
                containerParent.append(marksContainer);
            }

            getBestJacred(movie, function (data) {
                if (!data) data = { empty: true };

                // Паралельно перевіряємо uafix
                checkUafix(movie, function (hasUafix) {
                    if (hasUafix && data) {
                        data.ukr = true;
                        data.empty = false;
                    }
                    if (data && !data.empty) {
                        renderBadges(marksContainer, data, movie);
                    }
                });
            });
        }

        function renderBadges(container, data, movie) {
            container.empty();
            if (data.ukr && Lampa.Storage.get('likhtar_badge_ua', true)) container.append(createBadge('ua', 'UA'));
            if (data.eng && Lampa.Storage.get('likhtar_badge_en', true)) container.append(createBadge('en', 'EN'));
            if (data.resolution && data.resolution !== 'SD') {
                if (data.resolution === '4K' && Lampa.Storage.get('likhtar_badge_4k', true)) container.append(createBadge('4k', '4K'));
                else if (data.resolution === 'FHD' && Lampa.Storage.get('likhtar_badge_fhd', true)) container.append(createBadge('fhd', 'FHD'));
                else if (data.resolution === 'HD' && Lampa.Storage.get('likhtar_badge_fhd', true)) container.append(createBadge('hd', 'HD'));
                else if (Lampa.Storage.get('likhtar_badge_fhd', true)) container.append(createBadge('hd', data.resolution));
            }
            if (data.hdr && Lampa.Storage.get('likhtar_badge_hdr', true)) container.append(createBadge('hdr', 'HDR'));
            // Рейтинг критиків
            if (movie) {
                var rating = parseFloat(movie.imdb_rating || movie.kp_rating || movie.vote_average || 0);
                if (rating > 0) {
                    var rBadge = document.createElement('div');
                    rBadge.classList.add('card__mark', 'card__mark--rating');
                    rBadge.innerHTML = '<span class="mark-star">★</span>' + rating.toFixed(1);
                    container.append(rBadge);
                }
            }
        }

        var style = document.createElement('style');
        style.innerHTML = `
            /* ====== Вирівнюємо нативну TV мітку з нашими ====== */
            .card .card__type {
                left: -0.2em !important;
            }

            /* ====== Card marks — зліва, стовпчиком під TV ====== */
            .card-marks {
                position: absolute;
                top: 2.7em;
                left: -0.2em;
                display: flex;
                flex-direction: column;
                gap: 0.15em;
                z-index: 10;
                pointer-events: none;
            }
            /* Якщо немає TV мітки — піднімаємо на її позицію */
            .card:not(.card--tv):not(.card--movie) .card-marks,
            .card--movie .card-marks {
                top: 1.4em;
            }
            .card__mark {
                padding: 0.35em 0.45em;
                font-size: 0.8em;
                font-weight: 800;
                line-height: 1;
                letter-spacing: 0.03em;
                border-radius: 0.3em;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                align-self: flex-start;
                opacity: 0;
                animation: mark-fade-in 0.35s ease-out forwards;
                border: 1px solid rgba(255,255,255,0.15);
            }
            .card__mark--ua  { background: linear-gradient(135deg, #1565c0, #42a5f5); color: #fff; border-color: rgba(66,165,245,0.4); }
            .card__mark--4k  { background: linear-gradient(135deg, #e65100, #ff9800); color: #fff; border-color: rgba(255,152,0,0.4); }
            .card__mark--fhd { background: linear-gradient(135deg, #4a148c, #ab47bc); color: #fff; border-color: rgba(171,71,188,0.4); }
            .card__mark--hd  { background: linear-gradient(135deg, #1b5e20, #66bb6a); color: #fff; border-color: rgba(102,187,106,0.4); }
            .card__mark--en  { background: linear-gradient(135deg, #37474f, #78909c); color: #fff; border-color: rgba(120,144,156,0.4); }
            .card__mark--hdr { background: linear-gradient(135deg, #f57f17, #ffeb3b); color: #000; border-color: rgba(255,235,59,0.4); }
            .card__mark--rating { background: linear-gradient(135deg, #1a1a2e, #16213e); color: #ffd700; border-color: rgba(255,215,0,0.3); font-size: 0.75em; white-space: nowrap; }
            .card__mark--rating .mark-star { margin-right: 0.15em; font-size: 0.9em; }

            /* ====== Картка "На сторінку стрімінгу" — використовуємо нативний card-more ====== */
            .service-more-card .card-more__box {
                height: 0;
                padding-bottom: 150%;
                position: relative;
            }
            .service-more-card .card-more__title {
                margin-top: 0;
                top: 50%;
                transform: translateY(-50%);
                font-size: 1.4em;
            }

            /* ====== NEW badge на стрімінгах ====== */
            .studio-new-badge {
                position: absolute;
                top: 0.4em;
                right: 0.4em;
                background: linear-gradient(135deg, #e53935, #ff5252);
                color: #fff;
                font-size: 0.65em;
                font-weight: 800;
                padding: 0.25em 0.5em;
                border-radius: 0.3em;
                letter-spacing: 0.05em;
                z-index: 5;
                animation: mark-fade-in 0.35s ease-out forwards;
                box-shadow: 0 2px 6px rgba(229,57,53,0.4);
            }

            /* Ховаємо нативну оцінку, коли є наші мітки */
            .card.jacred-mark-processed-v2 .card__vote { display: none !important; }

            /* ====== Hero banner marks ====== */
            .hero-banner .card-marks {
                top: 1.5em !important;
                left: 1.2em !important;
                gap: 0.3em !important;
            }
            .hero-banner .card__mark {
                font-size: 1em;
                padding: 0.4em 0.6em;
            }
            
            /* ====== Full card (info row) marks ====== */
            .jacred-info-marks-v2 {
                display: flex;
                flex-direction: row;
                gap: 0.5em;
                margin-right: 1em;
                align-items: center;
            }

            @keyframes mark-fade-in { to { opacity: 1; } }
        `;
        document.head.appendChild(style);

        initFullCardMarks();
        observeCardRows();
    }


    function addServiceRows() {
        var services = ['netflix', 'apple', 'hbo', 'amazon', 'disney', 'paramount', 'sky_showtime', 'hulu', 'syfy', 'educational_and_reality'];

        services.forEach(function (id, index) {
            var config = SERVICE_CONFIGS[id];
            if (!config) return;

            Lampa.ContentRows.add({
                index: 4 + index,
                name: 'service_row_' + id,
                title: 'Сьогодні на ' + config.title,
                screen: ['main'],
                call: function (params) {
                    return function (callback) {
                        var network = new Lampa.Reguest();
                        var results = [];

                        var ROW_FILTER = {
                            'netflix': { with_networks: '213' },
                            'apple': { with_networks: '2552|3235' },
                            'hbo': { with_networks: '49|3186', with_companies: '174|49' },
                            'amazon': { with_networks: '1024', with_companies: '1785|21' },
                            'disney': { with_networks: '2739|19|88', with_companies: '2' },
                            'hulu': { with_networks: '453' },
                            'paramount': { with_networks: '4330|318', with_companies: '4' },
                            'sky_showtime': { with_companies: '4|33|67|521' },
                            'syfy': { with_networks: '77' },
                            'educational_and_reality': { with_networks: '64|43|91|4', with_genres: '99,10764' }
                        };

                        var filterParams = ROW_FILTER[id] || {};
                        if (Object.keys(filterParams).length === 0) return callback({ results: [] });

                        var minVotes = (id === 'syfy' || id === 'educational_and_reality') ? 1 : 3;
                        var apiKey = 'api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk');
                        var voteQ = '&vote_count.gte=' + minVotes;

                        // Отримуємо поточну дату, щоб відсікти "майбутні" релізи
                        var d = new Date();
                        var currentDate = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                        var dateQMovie = '&primary_release_date.lte=' + currentDate;
                        var dateQTV = '&first_air_date.lte=' + currentDate;

                        var networkQ = filterParams.with_networks ? '&with_networks=' + encodeURIComponent(filterParams.with_networks) : '';
                        var companyQ = filterParams.with_companies ? '&with_companies=' + encodeURIComponent(filterParams.with_companies) : '';
                        var genreQ = filterParams.with_genres ? '&with_genres=' + encodeURIComponent(filterParams.with_genres) : '';

                        var requests = [];

                        // Фільми
                        if (companyQ || genreQ) {
                            var urlM = Lampa.TMDB.api('discover/movie?' + apiKey + '&sort_by=primary_release_date.desc' + dateQMovie + voteQ + companyQ + genreQ);
                            requests.push(function (cb) {
                                network.silent(urlM, function (j) { cb(j.results || []); }, function () { cb([]); });
                            });
                        }

                        // Серіали
                        if (networkQ || companyQ || genreQ) {
                            var urlT = Lampa.TMDB.api('discover/tv?' + apiKey + '&sort_by=first_air_date.desc' + dateQTV + voteQ + networkQ + companyQ + genreQ);
                            requests.push(function (cb) {
                                network.silent(urlT, function (j) { cb(j.results || []); }, function () { cb([]); });
                            });
                        }

                        if (requests.length === 0) return callback({ results: [] });

                        var pending = requests.length;
                        requests.forEach(function (req) {
                            req(function (items) {
                                results = results.concat(items);
                                pending--;
                                if (pending === 0) {
                                    if (results.length === 0 && networkQ) {
                                        var urlFallback = Lampa.TMDB.api('discover/tv?' + apiKey + '&sort_by=popularity.desc' + dateQTV + networkQ);
                                        network.silent(urlFallback, function (j) {
                                            var fallbackItems = (j.results || []).slice(0, 20);
                                            callback({ results: fallbackItems, title: 'Сьогодні на ' + config.title });
                                        }, function () {
                                            callback({ results: [], title: 'Сьогодні на ' + config.title });
                                        });
                                        return;
                                    }

                                    var unique = [];
                                    var seen = {};
                                    results.forEach(function (item) {
                                        if (!seen[item.id]) { seen[item.id] = true; unique.push(item); }
                                    });

                                    // Сортуємо мікс серіалів та фільмів суворо за датою виходу
                                    unique.sort(function (a, b) {
                                        var dateA = new Date(a.release_date || a.first_air_date || '2000-01-01');
                                        var dateB = new Date(b.release_date || b.first_air_date || '2000-01-01');
                                        return dateB - dateA;
                                    });

                                    callback({
                                        results: unique.slice(0, 20),
                                        title: 'Сьогодні на ' + config.title
                                    });
                                }
                            });
                        });
                    }
                }
            });
        });
    }

    // ========== ROW: НОВИНКИ ПОЛЬСЬКОЇ СТРІЧКИ (в кінці головної) ==========
    function addPolishContentRow() {
        Lampa.ContentRows.add({
            index: 14, // After Hero(0), Studios(1), Mood(2), Ukrainian(3), Services(4-13)
            name: 'polish_content_row',
            title: 'Новинки польської стрічки',
            screen: ['main'],
            call: function (params) {
                return function (callback) {
                    var network = new Lampa.Reguest();
                    var results = [];
                    var apiKey = 'api_key=' + getTmdbKey() + '&language=' + Lampa.Storage.get('language', 'uk');
                    var d = new Date();
                    var currentDate = [d.getFullYear(), ('0' + (d.getMonth() + 1)).slice(-2), ('0' + d.getDate()).slice(-2)].join('-');
                    var urlMovie = Lampa.TMDB.api('discover/movie?' + apiKey + '&sort_by=primary_release_date.desc&primary_release_date.lte=' + currentDate + '&with_origin_country=PL&vote_count.gte=3');
                    var urlTV = Lampa.TMDB.api('discover/tv?' + apiKey + '&sort_by=first_air_date.desc&first_air_date.lte=' + currentDate + '&with_origin_country=PL&vote_count.gte=3');

                    network.silent(urlMovie, function (json1) {
                        if (json1.results) results = results.concat(json1.results);
                        network.silent(urlTV, function (json2) {
                            if (json2.results) results = results.concat(json2.results);
                            results.sort(function (a, b) {
                                var dateA = new Date(a.release_date || a.first_air_date || '2000-01-01');
                                var dateB = new Date(b.release_date || b.first_air_date || '2000-01-01');
                                return dateB - dateA;
                            });
                            var unique = [];
                            var seen = {};
                            results.forEach(function (item) {
                                if (!seen[item.id]) { seen[item.id] = true; unique.push(item); }
                            });
                            callback({
                                results: unique.slice(0, 20),
                                title: '🇵🇱 Новинки польської стрічки',
                                params: {
                                    items: { mapping: 'line', view: 15 }
                                }
                            });
                        });
                    });
                };
            }
        });
    }

    function modifyServiceTitles() {
        setInterval(function () {
            var services = ['netflix', 'apple', 'hbo', 'amazon', 'disney', 'paramount', 'sky_showtime', 'hulu', 'syfy', 'educational_and_reality'];
            services.forEach(function (id) {
                var config = SERVICE_CONFIGS[id];
                if (!config) return;

                var titleText = 'Сьогодні на ' + config.title;

                var el = $('.items-line__title').filter(function () {
                    return $(this).text().trim() === titleText && $(this).find('svg').length === 0;
                });

                if (el.length) {
                    var iconHtml = '<div style="width: 1.2em; height: 1.2em; display: inline-block; vertical-align: middle; margin-right: 0.4em; margin-bottom: 0.1em; color: inherit;">' + config.icon + '</div>';
                    el.html(iconHtml + '<span style="vertical-align: middle;">Сьогодні на ' + config.title + '</span>');

                    // Додаємо/переміщуємо картку "На сторінку стрімінгу" ЗАВЖДИ в самий кінець scroll__body
                    var line = el.closest('.items-line');
                    if (line.length) {
                        var scrollBody = line.find('.scroll__body');
                        if (scrollBody.length && !scrollBody.data('likhtar-more-observed')) {
                            scrollBody.data('likhtar-more-observed', true);

                            function moveMoreToEnd() {
                                var more = line.find('.service-more-card');
                                if (more.length && scrollBody[0] && more[0] !== scrollBody[0].lastElementChild) {
                                    scrollBody[0].appendChild(more[0]);
                                }
                            }

                            var observer = new MutationObserver(function () {
                                moveMoreToEnd();
                            });
                            observer.observe(scrollBody[0], { childList: true, subtree: false });

                            var existing = line.find('.service-more-card');
                            if (existing.length) {
                                moveMoreToEnd();
                            } else if (scrollBody.find('.card').length) {
                                var moreCard = $('<div class="card service-more-card selector"><div class="card-more__box"><div class="card-more__title">На сторінку<br>' + config.title + '</div></div></div>');
                                moreCard.on('hover:enter', (function (serviceId) {
                                    return function () {
                                        Lampa.Activity.push({
                                            url: '',
                                            title: SERVICE_CONFIGS[serviceId].title,
                                            component: 'studios_main',
                                            service_id: serviceId,
                                            page: 1
                                        });
                                    };
                                })(id));
                                scrollBody.append(moreCard);
                            }
                        } else if (scrollBody.length) {
                            var existing = line.find('.service-more-card');
                            if (existing.length) {
                                if (existing[0] !== scrollBody[0].lastElementChild) {
                                    scrollBody[0].appendChild(existing[0]);
                                }
                            } else if (scrollBody.find('.card').length) {
                                var moreCard = $('<div class="card service-more-card selector"><div class="card-more__box"><div class="card-more__title">На сторінку<br>' + config.title + '</div></div></div>');
                                moreCard.on('hover:enter', (function (serviceId) {
                                    return function () {
                                        Lampa.Activity.push({
                                            url: '',
                                            title: SERVICE_CONFIGS[serviceId].title,
                                            component: 'studios_main',
                                            service_id: serviceId,
                                            page: 1
                                        });
                                    };
                                })(id));
                                scrollBody.append(moreCard);
                            }
                        }
                    }
                }
            });

            // Кнопки "На сторінку" для української та польської стрічки (з переміщенням в кінець, як у стрімінгах)
            $('.items-line').each(function () {
                var line = $(this);
                var titleEl = line.find('.items-line__title');
                var titleText = titleEl.text().trim();
                var scrollBody = line.find('.scroll__body');
                if (!scrollBody.length) return;
                var isUA = titleText.indexOf('української стрічки') !== -1;
                var isPL = titleText.indexOf('польської стрічки') !== -1;
                if (!isUA && !isPL) return;
                var dataKey = isUA ? 'likhtar-more-ua' : 'likhtar-more-pl';
                if (scrollBody.data(dataKey)) return;
                scrollBody.data(dataKey, true);
                if (!scrollBody.find('.card').length) return;

                function moveMoreToEnd() {
                    var more = line.find('.service-more-card');
                    if (more.length && scrollBody[0] && more[0] !== scrollBody[0].lastElementChild) {
                        scrollBody[0].appendChild(more[0]);
                    }
                }
                var observer = new MutationObserver(moveMoreToEnd);
                observer.observe(scrollBody[0], { childList: true, subtree: false });

                var label = isUA ? 'Українська стрічка' : 'Польська стрічка';
                var comp = isUA ? 'ukrainian_feed' : 'polish_feed';
                var moreCard = $('<div class="card service-more-card selector"><div class="card-more__box"><div class="card-more__title">На сторінку<br>' + label + '</div></div></div>');
                moreCard.on('hover:enter', function () {
                    Lampa.Activity.push({ url: '', title: label, component: comp, page: 1 });
                });
                scrollBody.append(moreCard);
                moveMoreToEnd();
            });
        }, 1000);
    }

    function overrideApi() {
        // Backup original if needed, but we want to replace it
        var originalMain = Lampa.Api.sources.tmdb.main;

        Lampa.Api.sources.tmdb.main = function (params, oncomplite, onerror) {
            var parts_data = [];

            // Allow plugins (like ours) to add their rows
            Lampa.ContentRows.call('main', params, parts_data);

            // parts_data now contains ONLY custom rows (because we didn't add the standard ones)

            // Use the standard loader to process these rows
            function loadPart(partLoaded, partEmpty) {
                Lampa.Api.partNext(parts_data, 5, partLoaded, partEmpty);
            }

            loadPart(oncomplite, onerror);

            return loadPart;
        };
    }

    function setupKinoogladSettings() {
        if (!Lampa.SettingsApi || !Lampa.SettingsApi.addComponent) return;
        // Only register the component header here. The channel params are added by initKinoogladModule().
        Lampa.SettingsApi.addComponent({
            component: 'kinooglad',
            name: 'Кіноогляд',
            icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" fill="currentColor"/></svg>'
        });
    }


    function setupSettings() {
        if (!Lampa.SettingsApi || !Lampa.SettingsApi.addComponent) return;
        // Register kinooglad component FIRST so params added later in initKinoogladModule land under it
        setupKinoogladSettings();

        Lampa.SettingsApi.addComponent({
            component: 'likhtar_plugin',
            name: 'Ліхтар',
            icon: '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 21h6m-3-18v1m-6.36 1.64l.7.71m12.02-.71l-.7.71M4 12H3m18 0h-1M8 12a4 4 0 108 0 4 4 0 00-8 0zm-1 5h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        });

        // Інфо-заголовок
        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                type: 'title'
            },
            field: {
                name: 'Ліхтар — кастомна головна сторінка з стрімінгами, мітками якості та українською озвучкою. Автор: Likhtar Team'
            }
        });

        // === API TMDB ===
        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                type: 'title'
            },
            field: {
                name: 'API TMDB'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                name: 'likhtar_tmdb_apikey',
                type: 'input',
                placeholder: 'Ключ TMDB (опційно)',
                values: '',
                default: ''
            },
            field: {
                name: 'Свій ключ TMDB',
                description: 'Якщо вказати — плагін використовуватиме його замість ключа Лампи. Один ключ на всіх має ліміти; свій ключ (безкоштовно на themoviedb.org) дає стабільність.'
            }
        });

        // === Секція: Секції головної ===
        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                type: 'title'
            },
            field: {
                name: 'Секції головної сторінки'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                name: 'likhtar_section_streamings',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Стрімінги',
                description: 'Секція з логотипами стрімінгових сервісів'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                name: 'likhtar_section_mood',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Кіно під настрій',
                description: 'Підбірки фільмів за жанрами та настроєм'
            }
        });



        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                name: 'likhtar_kinooglad_enabled',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Кіноогляд',
                description: 'Увімкнути розділ Кіноогляд у меню. Налаштування каналів — у пункті «Кіноогляд» нижче.'
            }
        });

        // === Кіноогляд — налаштування каналів (розділів) та YouTube ===

        // === Секція: Мітки ===
        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                type: 'title'
            },
            field: {
                name: 'Мітки на картках'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                name: 'likhtar_badge_ua',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Українська озвучка (UA)',
                description: 'Показувати мітку наявності українського дубляжу'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                name: 'likhtar_badge_en',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Англійська озвучка (EN)',
                description: 'Показувати мітку наявності англійської доріжки'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                name: 'likhtar_badge_4k',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Якість 4K',
                description: 'Показувати мітку наявності 4K роздільної здатності'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                name: 'likhtar_badge_fhd',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Якість FHD',
                description: 'Показувати мітку наявності Full HD роздільної здатності'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'likhtar_plugin',
            param: {
                name: 'likhtar_badge_hdr',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'HDR / Dolby Vision',
                description: 'Показувати мітку наявності HDR або Dolby Vision'
            }
        });
    }
    function initKinoogladModule() {
        if (window.plugin_kinoohlyad_ready) return;
        window.plugin_kinoohlyad_ready = true;
        var KinoApi = {
            proxies: [
                'https://api.allorigins.win/raw?url=',
                'https://api.allorigins.win/get?url=',
                'https://corsproxy.io/?url=',
                'https://api.codetabs.com/v1/proxy?quest=',
                'https://thingproxy.freeboard.io/fetch/'
            ],
            // Порядок: за наявністю нового відео (сортування в main()). ID відповідають @нікам.
            defaultChannels: [
                { name: 'Навколо Кіно', id: 'UCHCpzrgaW9vFS4dGrmPmZNw' },           // @NavkoloKino
                { name: 'СЕРІАЛИ та КІНО', id: 'UCXUMAOsX27mm8M_f18RpzIQ' },        // @SERIALYtaKINO
                { name: 'eKinoUA', id: 'UCvY63ZphoNcDKpt5WK5Nbhg' },                // @eKinoUA
                { name: 'Загін Кіноманів', id: 'UCig7t6LFOjS2fKkhjbVLpjw' },        // @zagin_kinomaniv
                { name: 'Мої думки про кіно', id: 'UCIwXIJlsAcEQJ2lNVva7W0A' },     // @moiidumkyprokino
                { name: 'КІНО НАВИВОРІТ', id: 'UC3_JBeV9tvTb1nSRDh7ANXw' }          // @kino_navuvorit
            ],
            getChannels: function () {
                var stored = Lampa.Storage.get('kino_channels', '[]');
                var channels;
                if (typeof stored === 'string') {
                    try {
                        channels = JSON.parse(stored);
                    } catch (e) {
                        return this.defaultChannels.slice();
                    }
                } else if (Array.isArray(stored)) {
                    channels = stored;
                } else {
                    return this.defaultChannels.slice();
                }
                if (!channels || !channels.length) return this.defaultChannels.slice();
                var seen = {};
                channels = channels.filter(function (c) {
                    var id = String(c.id).trim().toLowerCase();
                    if (seen[id]) return false;
                    seen[id] = true;
                    return true;
                });
                return channels;
            },
            saveChannels: function (channels) {
                Lampa.Storage.set('kino_channels', channels);
            },
            resolveHandleToChannelId: function (handle, callback) {
                var _this = this;
                var cleanHandle = String(handle).trim().replace(/^@/, '');
                var pageUrl = 'https://www.youtube.com/@' + encodeURIComponent(cleanHandle);
                var encodedPage = encodeURIComponent(pageUrl);
                var tried = 0;

                function tryProxy(idx) {
                    if (idx >= _this.proxies.length) {
                        callback(new Error('resolve_failed'));
                        return;
                    }
                    var proxy = _this.proxies[idx];
                    var url = proxy + (proxy.indexOf('corsproxy') > -1 ? pageUrl : encodedPage);
                    $.get(url).done(function (html) {
                        var str = typeof html === 'string' ? html : (html && html.contents) ? html.contents : '';
                        var m = str.match(/"externalId"\s*:\s*"(UC[\w-]{22})"/) ||
                            str.match(/"channelId"\s*:\s*"(UC[\w-]{22})"/) ||
                            str.match(/youtube\.com\/channel\/(UC[\w-]{22})/);
                        if (m && m[1]) {
                            callback(null, { id: m[1], name: cleanHandle });
                        } else {
                            tryProxy(idx + 1);
                        }
                    }).fail(function () { tryProxy(idx + 1); });
                }
                tryProxy(0);
            },
            fetch: function (channel, oncomplite, onerror) {
                var _this = this;
                var id = String(channel.id).trim();
                var isChannelId = /^UC[\w-]{22}$/.test(id);

                function doFetch(feedUrl) {
                    var url = feedUrl;
                    var encodedUrl = encodeURIComponent(url);

                    function tryFetch(index) {
                        if (index >= _this.proxies.length) {
                            console.log('Kinoohlyad: All proxies failed for ' + channel.name);
                            onerror();
                            return;
                        }

                        var currentProxy = _this.proxies[index];
                        var fetchUrl = currentProxy + encodedUrl;

                        $.get(fetchUrl, function (data) {
                            var raw = typeof data === 'string' ? data : (data && typeof data.contents === 'string') ? data.contents : '';
                            var str = (raw || (typeof data === 'string' ? data : '')).trim();
                            if (str && str.indexOf('<?xml') !== 0 && str.indexOf('<feed') !== 0) {
                                if (str.indexOf('<!DOCTYPE') !== -1 || str.indexOf('<html') !== -1) {
                                    return tryFetch(index + 1);
                                }
                            }
                            var items = [];
                            var xml;
                            try {
                                xml = typeof data === 'string' ? $.parseXML(data) : (data && data.documentElement) ? data : $.parseXML(raw || String(data || ''));
                            } catch (e) {
                                return tryFetch(index + 1);
                            }

                            if (!xml || !$(xml).find('entry').length) {
                                return tryFetch(index + 1);
                            }

                            $(xml).find('entry').each(function () {
                                var $el = $(this);
                                var mediaGroup = $el.find('media\\:group, group');
                                var thumb = mediaGroup.find('media\\:thumbnail, thumbnail').attr('url');
                                var videoId = $el.find('yt\\:videoId, videoId').text();
                                var link = $el.find('link').attr('href');
                                var title = $el.find('title').text();

                                // Filter out Shorts
                                if (link && link.indexOf('/shorts/') > -1) return;
                                if (title && title.toLowerCase().indexOf('#shorts') > -1) return;

                                items.push({
                                    title: title,
                                    img: thumb,
                                    video_id: videoId,
                                    release_date: ($el.find('published').text() || '').split('T')[0],
                                    vote_average: 0
                                });
                            });

                            if (items.length) {
                                // console.log('Kinoohlyad: Success via ' + currentProxy);
                                oncomplite(items);
                            } else {
                                tryFetch(index + 1);
                            }
                        }).fail(function () {
                            tryFetch(index + 1);
                        });
                    }

                    tryFetch(0);
                }

                if (isChannelId) {
                    doFetch('https://www.youtube.com/feeds/videos.xml?channel_id=' + id);
                } else {
                    _this.resolveHandleToChannelId(id, function (err, resolved) {
                        if (!err && resolved && resolved.id) {
                            var ch = _this.getChannels();
                            for (var i = 0; i < ch.length; i++) {
                                if (String(ch[i].id).trim().toLowerCase() === id.toLowerCase()) {
                                    ch[i].id = resolved.id;
                                    _this.saveChannels(ch);
                                    break;
                                }
                            }
                            doFetch('https://www.youtube.com/feeds/videos.xml?channel_id=' + resolved.id);
                        } else {
                            doFetch('https://www.youtube.com/feeds/videos.xml?user=' + id.replace(/^@/, ''));
                        }
                    });
                }
            },
            main: function (oncomplite, onerror) {
                var _this = this;
                var channels = this.getChannels().filter(function (c) { return c.active !== false; });

                if (!channels.length) {
                    onerror();
                    return;
                }

                var maxVideosPerChannel = 7;
                var promises = channels.map(function (channel) {
                    return new Promise(function (resolve) {
                        _this.fetch(channel, function (items) {
                            resolve({ title: channel.name, channelId: channel.id, results: items.slice(0, maxVideosPerChannel) });
                        }, function () {
                            resolve({ title: channel.name, channelId: channel.id, results: [] });
                        });
                    });
                });

                Promise.all(promises).then(function (results) {
                    var withVideos = results.filter(function (res) { return res.results.length > 0; });
                    var withoutVideos = results.filter(function (res) { return res.results.length === 0; });

                    withVideos.sort(function (a, b) {
                        var dateA = a.results[0] ? new Date(a.results[0].release_date) : 0;
                        var dateB = b.results[0] ? new Date(b.results[0].release_date) : 0;
                        return dateB - dateA;
                    });

                    var sorted = withVideos.concat(withoutVideos);
                    if (sorted.length) oncomplite(sorted);
                    else onerror();
                });
            },
            clear: function () { }
        };

        function KinoCard(data) {
            this.build = function () {
                this.card = Lampa.Template.get('kino_card', {});
                this.img = this.card.find('img')[0];

                this.card.find('.card__title').text(data.title);
                var date = data.release_date ? data.release_date.split('-').reverse().join('.') : '';
                this.card.find('.card__date').text(date);
            };

            this.image = function () {
                var _this = this;
                this.img.onload = function () {
                    _this.card.addClass('card--loaded');
                };
                this.img.onerror = function () {
                    _this.img.src = './img/img_broken.svg';
                };
                if (data.img) this.img.src = data.img;
            };

            this.play = function (id) {
                if (Lampa.Manifest.app_digital >= 183) {
                    var item = {
                        title: Lampa.Utils.shortText(data.title, 50),
                        id: id,
                        youtube: true,
                        url: 'https://www.youtube.com/watch?v=' + id,
                        icon: '<img class="size-youtube" src="https://img.youtube.com/vi/' + id + '/default.jpg" />',
                        template: 'selectbox_icon'
                    };
                    Lampa.Player.play(item);
                    Lampa.Player.playlist([item]);
                } else {
                    Lampa.YouTube.play(id);
                }
            };

            this.create = function () {
                var _this = this;
                this.build();
                if (!this.card) return;

                this.card.on('hover:focus', function (e) {
                    if (_this.onFocus) _this.onFocus(e.target, data);
                }).on('hover:enter', function () {
                    _this.play(data.video_id);
                });

                this.image();
            };

            this.render = function () {
                return this.card;
            };

            this.destroy = function () {
                this.img.onerror = null;
                this.img.onload = null;
                this.img.src = '';
                this.card.remove();
                this.card = this.img = null;
            }
        }

        function KinoLine(data) {
            var content = Lampa.Template.get('items_line', { title: data.title });
            var body = content.find('.items-line__body');
            var scroll = new Lampa.Scroll({ horizontal: true, step: 600 });
            var items = [];
            var active = 0;
            var last;

            this.create = function () {
                scroll.render().find('.scroll__body').addClass('items-cards');
                content.find('.items-line__title').text(data.title);
                body.append(scroll.render());
                this.bind();
            };

            this.bind = function () {
                data.results.forEach(this.append.bind(this));
                if (data.channelId) this.appendChannelLink(data.channelId);
                Lampa.Layer.update();
            };

            this.append = function (element) {
                var _this = this;
                var card = new KinoCard(element);
                card.create();

                card.onFocus = function (target, card_data) {
                    last = target;
                    active = items.indexOf(card);
                    scroll.update(items[active].render(), true);
                    if (_this.onFocus) _this.onFocus(card_data);
                };

                scroll.append(card.render());
                items.push(card);
            };

            this.appendChannelLink = function (channelId) {
                var _this = this;
                var url = /^UC[\w-]{22}$/.test(channelId)
                    ? 'https://www.youtube.com/channel/' + channelId
                    : 'https://www.youtube.com/@' + channelId;
                var cardEl = $('<div class="card selector card--wide layer--render layer--visible kino-card kino-card--channel">' +
                    '<div class="card__view"><img src="./img/img_load.svg" class="card__img" alt=""></div>' +
                    '<div class="card__title">На канал автора</div>' +
                    '<div class="card__date" style="font-size: 0.8em; opacity: 0.7; margin-top: 0.3em;">YouTube</div></div>');
                cardEl.addClass('card--loaded');
                cardEl.on('hover:enter click', function () {
                    if (Lampa.Platform.openWindow) Lampa.Platform.openWindow(url);
                    else window.open(url, '_blank');
                });
                var channelCard = { render: function () { return cardEl; }, destroy: function () { cardEl.remove(); } };
                scroll.append(cardEl);
                items.push(channelCard);
            };

            this.toggle = function () {
                Lampa.Controller.add('items_line', {
                    toggle: function () {
                        Lampa.Controller.collectionSet(scroll.render());
                        Lampa.Controller.collectionFocus(items.length ? last : false, scroll.render());
                    },
                    right: function () {
                        Navigator.move('right');
                    },
                    left: function () {
                        Navigator.move('left');
                    },
                    down: this.onDown,
                    up: this.onUp,
                    gone: function () { },
                    back: this.onBack
                });
                Lampa.Controller.toggle('items_line');
            };

            this.render = function () {
                return content;
            };

            this.destroy = function () {
                Lampa.Arrays.destroy(items);
                scroll.destroy();
                content.remove();
                items = [];
            };
        }

        function KinoSettings() {
            var html = $('<div class="kino-settings-screen"></div>');
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            var channels = KinoApi.getChannels();
            var items = [];
            var active = 0;

            function parseChannelInput(input) {
                var s = (input || '').trim();
                if (!s) return null;
                var m = s.match(/youtube\.com\/channel\/(UC[\w-]{22})/i) || s.match(/(?:^|\s)(UC[\w-]{22})(?:\s|$)/);
                if (m) return { id: m[1], name: 'Канал' };
                m = s.match(/(?:youtube\.com\/)?@([\w.-]+)/i) || s.match(/^@?([\w.-]+)$/);
                if (m) return { id: m[1], name: m[1] };
                if (/^UC[\w-]{22}$/.test(s)) return { id: s, name: 'Канал' };
                return null;
            }

            this.create = function () {
                this.activity.loader(false);
                html.empty();
                items = [];
                channels = KinoApi.getChannels();

                var wrap = $('<div class="kino-settings__wrap"></div>');
                html.append(scroll.render());
                scroll.append(wrap);

                wrap.append('<div class="kino-settings__title">Налаштування каналів</div>');

                var addRow = $('<div class="kino-settings__row selector" data-action="add">' +
                    '<span class="kino-settings__label">Додати канал</span>' +
                    '<span class="kino-settings__hint">Посилання YouTube або @нік</span></div>');
                addRow.on('hover:enter click', function () {
                    Lampa.Input.edit({
                        title: 'Посилання на канал або @нік',
                        value: '',
                        free: true,
                        nosave: true
                    }, function (value) {
                        var parsed = parseChannelInput(value);
                        if (parsed) {
                            channels.push({ name: parsed.name, id: parsed.id, active: true });
                            KinoApi.saveChannels(channels);
                            Lampa.Activity.replace({ component: 'kino_settings' });
                        }
                    });
                });
                wrap.append(addRow);
                items.push(addRow);

                var resetRow = $('<div class="kino-settings__row selector" data-action="reset">' +
                    '<span class="kino-settings__label">Скинути налаштування</span>' +
                    '<span class="kino-settings__hint">Повернути стандартний список каналів</span></div>');
                resetRow.on('hover:enter click', function () {
                    KinoApi.saveChannels(KinoApi.defaultChannels);
                    Lampa.Activity.replace({ component: 'kino_settings' });
                });
                wrap.append(resetRow);
                items.push(resetRow);

                wrap.append('<div class="kino-settings__subtitle">Канали (клік — вкл/викл, довгий — видалити)</div>');

                channels.forEach(function (channel, index) {
                    var isOn = channel.active !== false;
                    var row = $('<div class="kino-settings__row kino-settings__row--channel selector" data-index="' + index + '">' +
                        '<span class="kino-settings__channel-name"></span>' +
                        '<span class="kino-settings__channel-status"></span></div>');
                    row.find('.kino-settings__channel-name').text(channel.name);
                    row.find('.kino-settings__channel-status').text(isOn ? 'Увімкнено' : 'Вимкнено');
                    if (!isOn) row.addClass('kino-settings__row--off');

                    row.on('hover:enter click', function () {
                        channel.active = !channel.active;
                        if (channel.active === undefined) channel.active = false;
                        row.find('.kino-settings__channel-status').text(channel.active !== false ? 'Увімкнено' : 'Вимкнено');
                        row.toggleClass('kino-settings__row--off', channel.active === false);
                        KinoApi.saveChannels(channels);
                    });

                    row.on('hover:long', function () {
                        var idx = index;
                        Lampa.Select.show({
                            title: 'Дії з каналом',
                            items: [{ title: 'Видалити', id: 'delete' }],
                            onSelect: function (a) {
                                if (a.id == 'delete') {
                                    channels.splice(idx, 1);
                                    KinoApi.saveChannels(channels);
                                    Lampa.Activity.replace({ component: 'kino_settings' });
                                }
                                Lampa.Controller.toggle('content');
                            },
                            onBack: function () { Lampa.Controller.toggle('content'); }
                        });
                    });

                    wrap.append(row);
                    items.push(row);
                });

                return this.render();
            };

            this.start = function () {
                active = Math.min(active, items.length - 1);
                if (active < 0) active = 0;
                Lampa.Controller.add('content', {
                    toggle: function () {
                        Lampa.Controller.collectionSet(html);
                        if (items.length) Lampa.Controller.collectionFocus(items[active], html);
                        scroll.update(items[active] || html);
                    },
                    up: function () {
                        if (active > 0) active--;
                        else active = items.length - 1;
                        Lampa.Controller.collectionFocus(items[active], html);
                        scroll.update(items[active]);
                    },
                    down: function () {
                        if (active < items.length - 1) active++;
                        else active = 0;
                        Lampa.Controller.collectionFocus(items[active], html);
                        scroll.update(items[active]);
                    },
                    back: function () { Lampa.Activity.backward(); }
                });
                Lampa.Controller.toggle('content');
            };

            this.render = function () { return html; };
            this.destroy = function () {
                scroll.destroy();
                html.remove();
                items = null;
            };
        }

        function KinoComponent(object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true, scroll_by_item: true });
            var items = [];
            var html = $('<div></div>');
            var active = 0;
            var info;

            this.create = function () {
                var _this = this;
                this.activity.loader(true);

                var head = $('<div class="kino-head" style="/* padding: 1.5em 2em; */ display: flex; justify-content: space-between; align-items: center;"></div>');
                // head.append('<div class="kino-title" style="font-size: 2em;">Кіноогляд</div>');

                html.append(head);

                KinoApi.main(function (data) {
                    _this.build(data);
                    _this.activity.loader(false);
                }, function () {
                    _this.empty();
                    _this.activity.loader(false);
                });
                return this.render();
            };

            this.empty = function () {
                var empty = new Lampa.Empty();
                html.append(empty.render());
                this.start = empty.start.bind(empty);
                this.activity.toggle();
            };

            this.build = function (data) {
                var _this = this;
                scroll.minus();
                html.append(scroll.render());
                data.forEach(function (element) {
                    _this.append(element);
                });
                this.activity.toggle();
            };

            this.append = function (element) {
                var item = new KinoLine(element);
                item.create();
                item.onDown = this.down.bind(this);
                item.onUp = this.up.bind(this);
                item.onBack = this.back.bind(this);
                item.onFocus = function (data) { };
                scroll.append(item.render());
                items.push(item);
            };

            this.back = function () {
                Lampa.Activity.backward();
            };

            this.down = function () {
                active++;
                active = Math.min(active, items.length - 1);
                items[active].toggle();
                scroll.update(items[active].render());
            };

            this.up = function () {
                active--;
                if (active < 0) {
                    active = 0;
                    Lampa.Controller.toggle('head');
                } else {
                    items[active].toggle();
                }
                scroll.update(items[active].render());
            };

            this.start = function () {
                var _this = this;
                if (Lampa.Activity.active().activity !== this.activity) return;
                Lampa.Controller.add('content', {
                    toggle: function () {
                        if (items.length) {
                            items[active].toggle();
                        }
                    },
                    left: function () {
                        if (Navigator.canmove('left')) Navigator.move('left');
                        else Lampa.Controller.toggle('menu');
                    },
                    right: function () {
                        Navigator.move('right');
                    },
                    up: function () {
                        if (Navigator.canmove('up')) Navigator.move('up');
                        else Lampa.Controller.toggle('head');
                    },
                    down: function () {
                        if (items.length) {
                            items[active].toggle();
                        }
                    },
                    back: this.back
                });
                Lampa.Controller.toggle('content');
            };

            this.pause = function () { };
            this.stop = function () { };
            this.render = function () {
                return html;
            };
            this.destroy = function () {
                Lampa.Arrays.destroy(items);
                scroll.destroy();
                html.remove();
                items = [];
            };
        }

        function startPlugin() {
            window.plugin_kinoohlyad_ready = true;
            Lampa.Component.add('kinoohlyad_view', KinoComponent);
            Lampa.Component.add('kino_settings', KinoSettings);

            if (Lampa.SettingsApi && Lampa.SettingsApi.addParam) {
                function parseChannelInput(input) {
                    var s = (input || '').trim();
                    if (!s) return null;
                    var m = s.match(/youtube\.com\/channel\/(UC[\w-]{22})/i) || s.match(/(?:^|\s)(UC[\w-]{22})(?:\s|$)/);
                    if (m) return { id: m[1], name: 'Канал' };
                    m = s.match(/(?:youtube\.com\/)?@([\w.-]+)/i) || s.match(/^@?([\w.-]+)$/);
                    if (m) return { id: m[1], name: m[1] };
                    if (/^UC[\w-]{22}$/.test(s)) return { id: s, name: 'Канал' };
                    return null;
                }
                Lampa.SettingsApi.addParam({
                    component: 'kinooglad',
                    param: { name: 'kinooglad_add_channel', type: 'button' },
                    field: { name: 'Додати канал', description: 'Посилання YouTube або @нік' },
                    onChange: function () {
                        Lampa.Input.edit({ title: 'Посилання на канал або @нік', value: '', free: true, nosave: true }, function (value) {
                            var parsed = parseChannelInput(value);
                            if (!parsed) return;
                            var ch = KinoApi.getChannels();
                            var idNorm = String(parsed.id).trim().toLowerCase();
                            if (ch.some(function (c) { return String(c.id).trim().toLowerCase() === idNorm; })) return;
                            var isUc = /^UC[\w-]{22}$/.test(String(parsed.id).trim());
                            if (isUc) {
                                ch.push({ name: parsed.name, id: parsed.id, active: true });
                                KinoApi.saveChannels(ch);
                                if (Lampa.Settings && Lampa.Settings.update) Lampa.Settings.update();
                                return;
                            }
                            KinoApi.resolveHandleToChannelId(parsed.id, function (err, resolved) {
                                if (!err && resolved && resolved.id) {
                                    var exists = ch.some(function (c) { return String(c.id).trim() === resolved.id; });
                                    if (!exists) {
                                        ch.push({ name: resolved.name || parsed.name, id: resolved.id, active: true });
                                    }
                                } else {
                                    ch.push({ name: parsed.name, id: parsed.id, active: true });
                                }
                                KinoApi.saveChannels(ch);
                                if (Lampa.Settings && Lampa.Settings.update) Lampa.Settings.update();
                            });
                        });
                    }
                });
                Lampa.SettingsApi.addParam({
                    component: 'kinooglad',
                    param: { name: 'kinooglad_reset', type: 'button' },
                    field: { name: 'Скинути налаштування', description: 'Повернути стандартний список каналів' },
                    onChange: function () {
                        KinoApi.saveChannels(KinoApi.defaultChannels);
                        if (Lampa.Settings && Lampa.Settings.update) Lampa.Settings.update();
                    }
                });
                for (var ci = 0; ci < 15; ci++) {
                    (function (idx) {
                        Lampa.SettingsApi.addParam({
                            component: 'kinooglad',
                            param: { name: 'kinooglad_ch_' + idx, type: 'button' },
                            field: { name: '—' },
                            onRender: function (item) {
                                var ch = KinoApi.getChannels()[idx];
                                if (!ch) { item.hide(); return; }
                                item.show();
                                item.find('.settings-param__name').text(ch.name);
                                if (!item.find('.settings-param__value').length) item.append('<div class="settings-param__value"></div>');
                                item.find('.settings-param__value').text(ch.active !== false ? 'Так' : 'Ні');
                            },
                            onChange: function () {
                                var ch = KinoApi.getChannels();
                                if (ch[idx]) {
                                    ch[idx].active = (ch[idx].active === false);
                                    KinoApi.saveChannels(ch);
                                    var scrollWrap = document.querySelector('.activity .scroll') || document.querySelector('.scroll');
                                    var scrollTop = scrollWrap ? scrollWrap.scrollTop : 0;
                                    if (Lampa.Settings && Lampa.Settings.update) Lampa.Settings.update();
                                    setTimeout(function () {
                                        if (scrollWrap) scrollWrap.scrollTop = scrollTop;
                                    }, 80);
                                }
                            }
                        });
                    })(ci);
                }
            }

            Lampa.Template.add('kino_card', `
            <div class="card selector card--wide layer--render layer--visible kino-card">
                <div class="card__view">
                    <img src="./img/img_load.svg" class="card__img">
                    <div class="card__promo"></div>
                </div>
                <div class="card__title"></div>
                <div class="card__date" style="font-size: 0.8em; opacity: 0.7; margin-top: 0.3em;"></div>
            </div>
        `);

            $('body').append(`
            <style>
            .kino-card {
                width: 20em !important;
                margin: 0 1em 1em 0 !important;
                aspect-ratio: 16/9;
                display: inline-block !important;
                vertical-align: top;
            }
            .kino-card .card__title {
                font-size: 1em;
            }
            .kino-card .card__view {
                padding-bottom: 56.25% !important;
            }
            .kino-card .card__img {
                object-fit: cover !important;
                height: 100% !important;
                border-radius: 0.3em;
            }
            .kino-settings:focus, .kino-settings.focus {
                background: #fff !important;
                color: #000 !important;
            }
            .kino-settings-screen {
                padding: 1.5em 2em 3em;
                max-width: 40em;
            }
            .kino-settings__wrap { }
            .kino-settings__title {
                display: block;
                font-size: 1.5em;
                font-weight: 600;
                margin-bottom: 1.2em;
                color: inherit;
            }
            .kino-settings__subtitle {
                display: block;
                font-size: 0.95em;
                opacity: 0.85;
                margin: 1.2em 0 0.6em;
                padding-top: 0.8em;
                border-top: 1px solid rgba(255,255,255,0.15);
            }
            .kino-settings__row {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 0.25em;
                padding: 0.85em 1em;
                margin-bottom: 0.4em;
                border-radius: 0.5em;
                background: rgba(255,255,255,0.06);
                min-height: 3em;
                box-sizing: border-box;
            }
            .kino-settings__row.selector:hover,
            .kino-settings__row.selector.focus {
                background: rgba(255,255,255,0.12);
            }
            .kino-settings__row--channel {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                gap: 1em;
            }
            .kino-settings__row--off {
                opacity: 0.6;
            }
            .kino-settings__label {
                font-size: 1em;
                font-weight: 500;
            }
            .kino-settings__hint {
                font-size: 0.85em;
                opacity: 0.8;
            }
            .kino-settings__channel-name {
                flex: 1;
                min-width: 0;
                font-size: 1em;
            }
            .kino-settings__channel-status {
                flex-shrink: 0;
                font-size: 0.9em;
                opacity: 0.9;
            }
            .kino-card--channel .card__title { font-style: italic; }
            </style>
        `);

            function addMenu() {
                var action = function () {
                    Lampa.Activity.push({
                        url: '',
                        title: 'Кіноогляд',
                        component: 'kinoohlyad_view',
                        page: 1
                    });
                };

                var btn = $('<li class="menu__item selector" data-action="kinoohlyad"><div class="menu__ico"><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg></div><div class="menu__text">Кіноогляд</div></li>');

                btn.on('hover:enter click', action);

                $('.menu .menu__list').eq(0).append(btn);
            }

            function addSettings() {
                // Пункт «Кіноогляд» і панель з кнопкою реєструються в setupKinoogladSettings() через SettingsApi (як Ліхтар).
                // Тут лише перевірка увімкнення плагіна для меню та панелі.
            }

            if (Lampa.Storage.get('likhtar_kinooglad_enabled', true)) {
                if (window.appready) {
                    addMenu();
                    addSettings();
                } else {
                    Lampa.Listener.follow('app', function (e) {
                        if (e.type == 'ready') {
                            addMenu();
                            addSettings();
                        }
                    });
                }
            }
        }

        startPlugin();
    }
    // =================================================================
    // INIT FUNCTION
    // =================================================================
    function init() {
        // Settings panel
        setupSettings();

        // Register Components
        Lampa.Component.add('studios_main', StudiosMain);
        Lampa.Component.add('studios_view', StudiosView);
        Lampa.Component.add('ukrainian_feed', UkrainianFeedMain);
        Lampa.Component.add('polish_feed', PolishFeedMain);
        LikhtarStudioSubscription.init();

        addStyles();

        // Override API BEFORE adding rows
        overrideApi();

        addHeroRow();
        removeShotsSection();

        if (Lampa.Storage.get('likhtar_section_streamings', true)) {
            addStudioRow();
        }

        addUkrainianContentRow();

        if (Lampa.Storage.get('likhtar_section_mood', true)) {
            addMoodRow();
        }

        addServiceRows();
        addPolishContentRow();

        // Start dynamic title modifier for icons
        modifyServiceTitles();

        initKinoogladModule();

        // Initial Focus and Styling
        setTimeout(function () {
            var heroCard = document.querySelector('.hero-banner');
            if (heroCard) {
                heroCard.style.width = '85vw';
                heroCard.style.marginRight = '1.5em';
            }

            var studioCard = $('.card--studio');
            if (studioCard.length) {
                if (Lampa.Controller.enabled().name === 'main') {
                    Lampa.Controller.collectionFocus(studioCard[0], $('.scroll__content').eq(1)[0]);
                }
            }
        }, 1000);
    }

    function runInit() {
        try {
            initMarksJacRed();
            init();
            window.LIKHTAR_STUDIOS_LOADED = true;
        } catch (err) {
            window.LIKHTAR_STUDIOS_ERROR = (err && err.message) ? err.message : String(err);
            if (typeof console !== 'undefined' && console.error) {
                console.error('[Likhtar Studios]', err);
            }
        }
    }

    if (window.appready) runInit();
    else if (typeof Lampa !== 'undefined' && Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') runInit();
        });
    } else {
        window.LIKHTAR_STUDIOS_ERROR = 'Lampa.Listener not found';
    }

})();
