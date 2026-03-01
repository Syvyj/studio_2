require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const axiosConfig = {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// ПАРСЕРИ ЛОКАЛЬНИХ САЙТІВ
// ==========================================
async function searchTmdbByTitle(title) {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, { params: { api_key: TMDB_API_KEY, language: 'uk-UA', query: title, page: 1 }, ...axiosConfig });
        if (response.data.results) {
            const items = response.data.results.filter(i => i.media_type !== 'person');
            if (items.length > 0) return items[0];
        }
    } catch (e) { } return null;
}

async function scrapeTeleportal() {
    let shows = [];
    try {
        const response = await axios.get('https://teleportal.ua/', axiosConfig);
        const $ = cheerio.load(response.data);
        $('.project-title, .item-name, h3, .show-title').each((i, el) => {
            const title = $(el).text().trim();
            if (title && !shows.includes(title)) shows.push(title);
        });
        if (!shows.length) throw new Error('Empty');
    } catch (e) { shows = ["МастерШеф", "Холостяк", "Супермама", "Сліпа", "Слід", "Хата на тата", "Кріпосна", "Спіймати Кайдаша"]; }

    let tmdb = [];
    for (const t of shows.slice(0, 15)) {
        const s = await searchTmdbByTitle(t);
        if (s) tmdb.push(s);
        await delay(150);
    }
    return tmdb;
}

async function scrapeFilmweb() {
    let shows = [];
    try {
        const response = await axios.get('https://www.filmweb.pl/ranking/vod/netflix/serial/poland', axiosConfig);
        const $ = cheerio.load(response.data);
        $('.rankingType__title').each((i, el) => {
            const title = $(el).text().trim();
            if (title && !shows.includes(title)) shows.push(title);
        });
        if (!shows.length) throw new Error('Empty');
    } catch (e) { shows = ["1670", "Wielka woda", "Ślepnąc od świateł", "Wataha", "Belfer", "Rojst", "Infamia"]; }

    let tmdb = [];
    for (const t of shows.slice(0, 15)) {
        const s = await searchTmdbByTitle(t);
        if (s) tmdb.push(s);
        await delay(150);
    }
    return tmdb;
}

// ==========================================
// КОНФІГУРАЦІЯ СТРІЧОК ТА КАТЕГОРІЙ
// ==========================================
const d = new Date();
const currentDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const p = new Date(); p.setMonth(p.getMonth() - 8);
const pastDate = `${p.getFullYear()}-${String(p.getMonth() + 1).padStart(2, '0')}-${String(p.getDate()).padStart(2, '0')}`;

const baseMovie = { 'primary_release_date.gte': pastDate, 'primary_release_date.lte': currentDate, sort_by: 'popularity.desc', 'vote_count.gte': 3 };
const baseTv = { 'first_air_date.gte': pastDate, 'first_air_date.lte': currentDate, sort_by: 'popularity.desc', 'vote_count.gte': 3 };

// ТУТ МИ ПРОПИСУЄМО І ГОЛОВНУ СТРІЧКУ, І ВНУТРІШНІ КАТЕГОРІЇ!
const FEEDS = [
    {
        id: "ua", title: "Українська стрічка",
        main: { movie: { ...baseMovie, with_origin_country: "UA", "vote_count.gte": 1 }, tv: 'CUSTOM_UA' },
        categories: [
            { title: "🎬 Нові українські фільми", type: "movie", params: { with_origin_country: "UA", sort_by: "primary_release_date.desc", "vote_count.gte": 0 } },
            { title: "📺 Українські серіали", type: "tv", params: { with_origin_country: "UA", sort_by: "first_air_date.desc", "vote_count.gte": 0 } },
            { title: "🏆 Найкраще за всі часи", type: "movie", params: { with_origin_country: "UA", sort_by: "vote_average.desc", "vote_count.gte": 10 } }
        ]
    },
    {
        id: "pl", title: "Польська стрічка",
        main: { movie: { ...baseMovie, with_origin_country: "PL", "vote_count.gte": 1 }, tv: 'CUSTOM_PL' },
        categories: [
            { title: "🎬 Нові польські фільми", type: "movie", params: { with_origin_country: "PL", sort_by: "primary_release_date.desc", "vote_count.gte": 0 } },
            { title: "📺 Польські серіали", type: "tv", params: { with_origin_country: "PL", sort_by: "first_air_date.desc", "vote_count.gte": 0 } },
            { title: "🏆 Хіти Польщі", type: "movie", params: { with_origin_country: "PL", sort_by: "popularity.desc", "vote_count.gte": 10 } }
        ]
    },
    {
        id: "reality", title: "Реаліті-шоу",
        main: { movie: null, tv: { ...baseTv, with_genres: "10764", "vote_count.gte": 1 } },
        categories: [
            { title: "🔥 Свіжі випуски", type: "tv", params: { with_genres: "10764", sort_by: "first_air_date.desc", "vote_count.gte": 1 } },
            { title: "🍳 Кулінарні битви", type: "tv", params: { with_genres: "10764", with_keywords: "222083|271221", sort_by: "popularity.desc" } },
            { title: "🎤 Таланти та Музика", type: "tv", params: { with_genres: "10764", with_keywords: "6041|173252", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "netflix", title: "Netflix",
        main: { movie: { ...baseMovie, with_watch_providers: "8", watch_region: "UA" }, tv: { ...baseTv, with_networks: "213" } },
        categories: [
            { title: "🔥 Нові фільми", type: "movie", params: { with_watch_providers: "8", watch_region: "UA", sort_by: "primary_release_date.desc", "vote_count.gte": 5 } },
            { title: "🔥 Нові серіали", type: "tv", params: { with_networks: "213", sort_by: "first_air_date.desc", "vote_count.gte": 5 } },
            { title: "🏆 Топ Серіали", type: "tv", params: { with_networks: "213", sort_by: "popularity.desc" } },
            { title: "🤯 Заплутані трилери", type: "movie", params: { with_watch_providers: "8", watch_region: "UA", with_genres: "53,9648", sort_by: "popularity.desc" } },
            { title: "📺 Реаліті та Шоу", type: "tv", params: { with_networks: "213", with_genres: "10764,10767", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "apple", title: "Apple TV+",
        main: { movie: { ...baseMovie, with_watch_providers: "350", watch_region: "UA" }, tv: { ...baseTv, with_networks: "2552|3235" } },
        categories: [
            { title: "🔥 Нові серіали", type: "tv", params: { with_networks: "2552|3235", sort_by: "first_air_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Apple TV+", type: "tv", params: { with_networks: "2552|3235", sort_by: "popularity.desc" } },
            { title: "🛸 Епічний Sci-Fi", type: "tv", params: { with_networks: "2552|3235", with_genres: "10765", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "hbo", title: "HBO / Max",
        main: { movie: { ...baseMovie, with_companies: "174|49" }, tv: { ...baseTv, with_networks: "49|3186" } },
        categories: [
            { title: "🔥 Нові серіали", type: "tv", params: { with_networks: "49|3186", sort_by: "first_air_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Серіали", type: "tv", params: { with_networks: "49|3186", sort_by: "popularity.desc" } },
            { title: "🔥 Нові фільми", type: "movie", params: { with_companies: "174|49", sort_by: "primary_release_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Фільми", type: "movie", params: { with_companies: "174|49", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "amazon", title: "Prime Video",
        main: { movie: { ...baseMovie, with_watch_providers: "119", watch_region: "US" }, tv: { ...baseTv, with_networks: "1024" } },
        categories: [
            { title: "🔥 Нові серіали", type: "tv", params: { with_networks: "1024", sort_by: "first_air_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Серіали", type: "tv", params: { with_networks: "1024", sort_by: "popularity.desc" } },
            { title: "🔥 Нові фільми", type: "movie", params: { with_watch_providers: "119", watch_region: "US", sort_by: "primary_release_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Фільми", type: "movie", params: { with_watch_providers: "119", watch_region: "US", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "disney", title: "Disney+",
        main: { movie: { ...baseMovie, with_companies: "2" }, tv: { ...baseTv, with_networks: "2739|19|88" } },
        categories: [
            { title: "🔥 Нові серіали", type: "tv", params: { with_networks: "2739|19|88", sort_by: "first_air_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Серіали", type: "tv", params: { with_networks: "2739|19|88", sort_by: "popularity.desc" } },
            { title: "🔥 Нові фільми", type: "movie", params: { with_companies: "2", sort_by: "primary_release_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Фільми", type: "movie", params: { with_companies: "2", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "paramount", title: "Paramount+",
        main: { movie: { ...baseMovie, with_companies: "4" }, tv: { ...baseTv, with_networks: "4330|318" } },
        categories: [
            { title: "🔥 Нові серіали", type: "tv", params: { with_networks: "4330|318", sort_by: "first_air_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Серіали", type: "tv", params: { with_networks: "4330|318", sort_by: "popularity.desc" } },
            { title: "🔥 Нові фільми", type: "movie", params: { with_companies: "4", sort_by: "primary_release_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Фільми", type: "movie", params: { with_companies: "4", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "sky_showtime", title: "Sky Showtime",
        main: { movie: { ...baseMovie, with_companies: "4|33|67|521" }, tv: { ...baseTv, with_companies: "67|115331" } },
        categories: [
            { title: "🔥 Нові серіали", type: "tv", params: { with_companies: "67|115331", sort_by: "first_air_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Серіали", type: "tv", params: { with_companies: "67|115331", sort_by: "popularity.desc" } },
            { title: "🔥 Нові фільми", type: "movie", params: { with_companies: "4|33", sort_by: "primary_release_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Фільми", type: "movie", params: { with_companies: "4|33", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "hulu", title: "Hulu",
        main: { movie: { ...baseMovie, with_watch_providers: "15", watch_region: "US" }, tv: { ...baseTv, with_networks: "453" } },
        categories: [
            { title: "🔥 Нові серіали", type: "tv", params: { with_networks: "453", sort_by: "first_air_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Серіали", type: "tv", params: { with_networks: "453", sort_by: "popularity.desc" } },
            { title: "🔥 Нові фільми", type: "movie", params: { with_watch_providers: "15", watch_region: "US", sort_by: "primary_release_date.desc", "vote_count.gte": 2 } },
            { title: "🏆 Топ Фільми", type: "movie", params: { with_watch_providers: "15", watch_region: "US", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "syfy", title: "Syfy",
        main: { movie: null, tv: { ...baseTv, with_networks: "77", "vote_count.gte": 1 } },
        categories: [
            { title: "🔥 Новинки", type: "tv", params: { with_networks: "77", sort_by: "first_air_date.desc", "vote_count.gte": 1 } },
            { title: "🏆 Топ на Syfy", type: "tv", params: { with_networks: "77", sort_by: "popularity.desc" } }
        ]
    },
    {
        id: "educational_and_reality", title: "Пізнавальне",
        main: { movie: null, tv: { ...baseTv, with_networks: "64|43|91|4", with_genres: "99", "vote_count.gte": 1 } },
        categories: [
            { title: "🔥 Нові випуски", type: "tv", params: { with_networks: "64|91|43|2696|4|65", sort_by: "first_air_date.desc", "vote_count.gte": 2 } },
            { title: "🌍 Discovery Channel", type: "tv", params: { with_networks: "64", sort_by: "popularity.desc" } },
            { title: "🦁 National Geographic", type: "tv", params: { with_networks: "43", sort_by: "popularity.desc" } },
            { title: "🐾 Animal Planet", type: "tv", params: { with_networks: "91", sort_by: "popularity.desc" } }
        ]
    }
];

// ==========================================
// ФУНКЦІЇ ЗБОРУ ТА ЗБАГАЧЕННЯ (ENRICH)
// ==========================================
async function fetchTMDB(endpoint, params, pagesToFetch = 3) {
    if (!params) return [];
    let allResults = [];
    for (let page = 1; page <= pagesToFetch; page++) {
        try {
            const res = await axios.get(`${TMDB_BASE_URL}${endpoint}`, { params: { api_key: TMDB_API_KEY, language: 'uk-UA', page: page, ...params }, ...axiosConfig });
            if (res.data.results) allResults.push(...res.data.results);
            if (page >= res.data.total_pages) break;
        } catch (e) { break; }
    }
    return allResults;
}



// ==========================================
// ГОЛОВНИЙ ПРОЦЕС
// ==========================================
async function runBot() {
    console.log('🤖 FULL BACKEND CACHE запущено...\n');

    for (const feed of FEEDS) {
        console.log(`\n=========================================`);
        console.log(`🎬 Збираємо: ${feed.title}`);
        console.log(`=========================================`);

        // --- 1. ЗБИРАЄМО ГОЛОВНИЙ РЯДОК (Main Row) ---
        process.stdout.write(`>> Головна стрічка... `);
        let movies = [];
        let tvShows = [];

        if (feed.main.tv === 'CUSTOM_UA') {
            tvShows = await scrapeTeleportal();
            movies = await fetchTMDB('/discover/movie', feed.main.movie);
        } else if (feed.main.tv === 'CUSTOM_PL') {
            tvShows = await scrapeFilmweb();
            movies = await fetchTMDB('/discover/movie', feed.main.movie);
        } else {
            if (feed.main.movie) {
                [movies] = await Promise.all([fetchTMDB('/discover/movie', feed.main.movie, 5)]);
            }
            if (feed.main.tv) {
                [tvShows] = await Promise.all([fetchTMDB('/discover/tv', feed.main.tv, 5)]);
            }
        }

        let mixed = [...movies, ...tvShows];
        const uniqueIds = new Set();
        mixed = mixed.filter(item => {
            if (uniqueIds.has(item.id)) return false;
            uniqueIds.add(item.id);

            const asianLangs = ['hi', 'te', 'ta', 'ko', 'zh', 'ja', 'th', 'id', 'tr'];
            if (asianLangs.includes(item.original_language) && (item.vote_count || 0) < 150) return false;

            const isReality = item.genre_ids && (item.genre_ids.includes(10764) || item.genre_ids.includes(10767));
            if (isReality && !['educational_and_reality', 'ua', 'pl', 'reality'].includes(feed.id)) return false;

            return true;
        });
        if (!['ua', 'pl'].includes(feed.id)) mixed.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        const topMainRow = mixed.slice(0, 20);
        console.log(`✅ [Готово]`);

        // --- 2. ЗБИРАЄМО ВНУТРІШНІ КАТЕГОРІЇ (Categories) ---
        const finalCategories = [];
        for (const cat of feed.categories) {
            process.stdout.write(`>> Категорія: ${cat.title}... `);
            const endpoint = cat.type === 'movie' ? '/discover/movie' : '/discover/tv';
            const catResults = await fetchTMDB(endpoint, cat.params, 2); // 2 сторінки достатньо для категорій

            // Відсіюємо азійський треш і тут
            const cleanCatResults = catResults.filter(item => {
                const asianLangs = ['hi', 'te', 'ta', 'ko', 'zh', 'ja', 'th', 'id', 'tr'];
                if (asianLangs.includes(item.original_language) && (item.vote_count || 0) < 150) return false;
                return true;
            });

            const topCatResults = cleanCatResults.slice(0, 20);

            finalCategories.push({
                title: cat.title,
                results: topCatResults
            });
            console.log(`✅ [Готово]`);
        }

        // --- 3. ЗБЕРІГАЄМО ЄДИНИЙ JSON ---
        const finalFeed = {
            title: `Сьогодні на ${feed.title}`,
            last_updated: new Date().toISOString(),
            main_row: topMainRow,
            categories: finalCategories
        };

        fs.writeFileSync(`${feed.id}_feed.json`, JSON.stringify(finalFeed, null, 2));
    }
    console.log('\n🎉 Локальне оновлення завершено! Перевіряй Лампу (з локальним сервером).');
}

runBot();
