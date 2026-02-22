(function () {
    'use strict';

    const CONFIG = {
        server: '192.168.1.31:12320',  // CHANGE TO YOUR SERVER
        sources: [
            'animeon',
            'bambooua',
            'cikavaideya',
            'starlight',
            'uakino',
            'uaflix',
            'uatutfun',
            'unimay',
            'ashdibase',
            'pidtor'
        ],
        minQuality: 1080,
        ukKeywords: ['ukr', 'uk', 'ua', 'ukrainian', 'україн'],
        timeout: 15000
    };

    function addUrlParams(url, params) {
        const separator = url.indexOf('?') >= 0 ? '&' : '?';
        return url + separator + params;
    }

    function isUkrainianVoice(text) {
        if (!text) return true;  // If no voice info, assume Ukrainian
        const lower = text.toLowerCase();
        return CONFIG.ukKeywords.some(keyword => lower.includes(keyword));
    }

    function getVoiceName(item) {
        return item.translate || item.name || item.details || item.title || 'Ukrainian';
    }

    class VoiceStorage {
        constructor(movie) {
            this.hash = Lampa.Utils.hash(movie.original_title || movie.title);
            this.field = 'ukr_online_voice';
        }

        get() {
            const storage = Lampa.Storage.get(this.field, '{}');
            return storage[this.hash] || '';
        }

        set(voice) {
            const storage = Lampa.Storage.get(this.field, '{}');
            storage[this.hash] = voice;
            Lampa.Storage.set(this.field, storage);
        }
    }

    class LampacAPI {
        constructor(movie) {
            this.movie = movie;
            this.network = new Lampa.Reguest();
        }

        async getExternalIds() {
            if (this.movie.imdb_id && this.movie.kinopoisk_id) {
                return;
            }

            const params = [
                `id=${this.movie.id}`,
                `serial=${this.movie.name ? 1 : 0}`
            ].join('&');

            const url = addUrlParams(`http://${CONFIG.server}/externalids`, params);

            return new Promise((resolve, reject) => {
                this.network.timeout(CONFIG.timeout);
                this.network.silent(url,
                    data => {
                        Object.assign(this.movie, data);
                        resolve();
                    },
                    () => resolve()
                );
            });
        }

        getRequestParams(season = null) {
            const params = [
                `id=${this.movie.id}`,
                `title=${encodeURIComponent(this.movie.title || this.movie.name)}`,
                `original_title=${encodeURIComponent(this.movie.original_title || this.movie.original_name)}`,
                `serial=${this.movie.name ? 1 : 0}`,
                `year=${(this.movie.release_date || this.movie.first_air_date || '0000').slice(0, 4)}`,
                `source=tmdb`
            ];

            if (this.movie.imdb_id) {
                params.push(`imdb_id=${this.movie.imdb_id}`);
            }

            if (this.movie.kinopoisk_id) {
                params.push(`kinopoisk_id=${this.movie.kinopoisk_id}`);
            }

            if (season) {
                params.push(`s=${season}`);
            }

            return params.join('&');
        }

        async querySource(source, season = null) {
            const url = `http://${CONFIG.server}/lite/${source}`;
            const params = this.getRequestParams(season);

            console.log('[UA Online] Querying:', source, url + '?' + params);

            return new Promise((resolve, reject) => {
                this.network.timeout(CONFIG.timeout);
                this.network.silent(addUrlParams(url, params),
                    data => {
                        console.log('[UA Online] Response from', source, ':', data);
                        if (data && !data.error && !data.disable) {
                            data._source = source;
                            resolve(data);
                        } else {
                            console.log('[UA Online] No data from', source);
                            reject('No data');
                        }
                    },
                    err => {
                        console.log('[UA Online] Error from', source, ':', err);
                        reject(err);
                    }
                );
            });
        }

        async queryAll(season = null) {
            await this.getExternalIds();

            console.log('[UA Online] Querying all sources for:', this.movie.title);

            const promises = CONFIG.sources.map(source =>
                this.querySource(source, season)
                    .catch(err => {
                        console.log('[UA Online] Source failed:', source, err);
                        return null;
                    })
            );

            const results = await Promise.all(promises);
            const filtered = results.filter(r => r !== null);

            console.log('[UA Online] Got results from', filtered.length, 'sources');

            return filtered;
        }
    }

    class ContentProcessor {
        constructor() { }

        filterUkrainian(translates) {
            // For UA balancers, don't filter - all should be Ukrainian
            console.log('[UA Online] All translates (UA balancers):', translates.length);
            return translates;
        }

        filterQuality(qualityObj) {
            if (!qualityObj || typeof qualityObj !== 'object') {
                return null;
            }

            const filtered = {};
            for (let res in qualityObj) {
                const resolution = parseInt(res);
                if (resolution >= CONFIG.minQuality) {
                    filtered[res] = qualityObj[res];
                }
            }

            return Object.keys(filtered).length > 0 ? filtered : null;
        }

        extractTranslates(results) {
            let translates = [];

            results.forEach(result => {
                if (result.voice && Array.isArray(result.voice)) {
                    result.voice.forEach(v => {
                        v.source = result._source;
                        translates.push(v);
                    });
                } else if (result.data && Array.isArray(result.data)) {
                    result.data.forEach(d => {
                        d.source = result._source;
                        translates.push(d);
                    });
                }
            });

            console.log('[UA Online] Extracted translates:', translates.length);

            return translates;
        }

        async getStreams(voiceItem) {
            if (voiceItem.method === 'play' && voiceItem.quality) {
                return voiceItem;
            }

            if (voiceItem.method === 'call' && voiceItem.url) {
                const network = new Lampa.Reguest();
                return new Promise((resolve, reject) => {
                    network.timeout(CONFIG.timeout);
                    network.silent(voiceItem.url,
                        data => {
                            if (data && data.quality) {
                                data.translate = voiceItem.translate || voiceItem.name;
                                data.source = voiceItem.source;
                                resolve(data);
                            } else {
                                reject('No quality');
                            }
                        },
                        err => reject(err)
                    );
                });
            }

            return null;
        }

        prepareQuality(quality) {
            const prepared = {};

            for (let res in quality) {
                const resolution = parseInt(res);
                const item = quality[res];

                let urls = [];
                if (typeof item === 'string') {
                    urls = item.split(' or ');
                } else if (item.url) {
                    urls = [item.url];
                } else {
                    urls = [String(item)];
                }

                prepared[res] = {
                    label: resolution >= 2160 ? '4K' :
                        resolution >= 1440 ? '2K' :
                            resolution >= 1080 ? 'FHD' : 'HD',
                    url: urls[0],
                    reserve: urls.slice(1)
                };
            }

            return prepared;
        }
    }

    class MoviePlayer {
        constructor(object) {
            this.object = object;
            this.api = new LampacAPI(object.movie);
            this.processor = new ContentProcessor();
            this.voiceStorage = new VoiceStorage(object.movie);
        }

        async play() {
            try {
                Lampa.Loading.start();

                const results = await this.api.queryAll();

                if (results.length === 0) {
                    Lampa.Noty.show('Content not found on UA sources');
                    console.log('[UA Online] No results from any source');
                    return;
                }

                let translates = this.processor.extractTranslates(results);
                translates = this.processor.filterUkrainian(translates);

                if (translates.length === 0) {
                    Lampa.Noty.show('No voices found');
                    console.log('[UA Online] No translates extracted');
                    return;
                }

                const savedVoice = this.voiceStorage.get();
                let selectedVoice = translates.find(t =>
                    getVoiceName(t) === savedVoice
                ) || translates[0];

                if (translates.length > 1) {
                    this.showVoiceSelector(translates, selectedVoice);
                } else {
                    await this.playVoice(selectedVoice);
                }

            } catch (e) {
                console.error('[UA Online] Error:', e);
                Lampa.Noty.show('Error: ' + (e.message || 'Unknown error'));
            } finally {
                Lampa.Loading.stop();
            }
        }

        showVoiceSelector(translates, selectedVoice) {
            const items = translates.map(t => ({
                title: getVoiceName(t),
                subtitle: t.source || '',
                selected: t === selectedVoice,
                voice: t
            }));

            Lampa.Select.show({
                title: 'Select voice',
                items: items,
                onSelect: async (item) => {
                    Lampa.Select.close();
                    this.voiceStorage.set(item.title);
                    Lampa.Loading.start();
                    await this.playVoice(item.voice);
                    Lampa.Loading.stop();
                },
                onBack: () => {
                    Lampa.Select.close();
                    Lampa.Controller.toggle('content');
                }
            });
        }

        async playVoice(voice) {
            try {
                const streams = await this.processor.getStreams(voice);

                if (!streams || !streams.quality) {
                    throw new Error('Streams not found');
                }

                const filteredQuality = this.processor.filterQuality(streams.quality);

                if (!filteredQuality) {
                    Lampa.Noty.show('No quality 1080p or higher');
                    return;
                }

                const quality = this.processor.prepareQuality(filteredQuality);

                const hash = Lampa.Utils.hash(
                    this.object.movie.original_title || this.object.movie.title
                );

                const playData = {
                    title: this.object.movie.title || this.object.movie.name,
                    url: Lampa.Player.getUrlQuality(quality),
                    quality: quality,
                    timeline: Lampa.Timeline.view(hash),
                    subtitles: streams.subtitles || false,
                    translate_name: getVoiceName(voice)
                };

                Lampa.Favorite.add('history', this.object.movie, 100);
                Lampa.Player.play(playData);
                Lampa.Player.playlist([]);

            } catch (e) {
                console.error('[UA Online] Play error:', e);
                Lampa.Noty.show('Playback error: ' + (e.message || ''));
            }
        }
    }

    class SeriesPlayer {
        constructor(object) {
            this.object = object;
            this.api = new LampacAPI(object.movie);
            this.processor = new ContentProcessor();
            this.voiceStorage = new VoiceStorage(object.movie);
        }

        async loadSeasonData(season) {
            try {
                Lampa.Loading.start();

                const results = await this.api.queryAll(season);

                if (results.length === 0) {
                    throw new Error('Content not found');
                }

                let translates = this.processor.extractTranslates(results);
                translates = this.processor.filterUkrainian(translates);

                if (translates.length === 0) {
                    return { translates: [], episodes: [] };
                }

                const episodes = [];
                for (let translate of translates) {
                    const streams = await this.processor.getStreams(translate);
                    if (streams && streams.data && Array.isArray(streams.data)) {
                        streams.data.forEach(ep => {
                            ep.translate = getVoiceName(translate);
                            ep.source = translate.source;
                            episodes.push(ep);
                        });
                    }
                }

                return { translates, episodes };

            } finally {
                Lampa.Loading.stop();
            }
        }
    }

    class EpisodesComponent {
        constructor(object) {
            this.object = object;
            this.player = new SeriesPlayer(object);
            this.processor = new ContentProcessor();
            this.voiceStorage = new VoiceStorage(object.movie);

            this.currentSeason = 1;
            this.translates = [];
            this.episodes = [];

            this.activity = Lampa.Activity.active();
        }

        create() {
            this.scroll = new Lampa.Scroll({ mask: true, over: true });
            this.filter = new Lampa.Filter(this.object);

            this.filter.onSelect = (type, item) => {
                if (type === 'season') {
                    this.currentSeason = item.season;
                    this.load();
                }
            };

            this.filter.onBack = () => {
                Lampa.Activity.backward();
            };

            this.filter.render().find('.filter--search, .filter--sort').remove();
            this.scroll.body().addClass('torrent-list');
            this.activity.loader(true);

            this.setupSeasons();
            this.load();

            return this.render();
        }

        setupSeasons() {
            const seasons = [];
            const totalSeasons = this.object.movie.number_of_seasons || 1;

            for (let i = 1; i <= totalSeasons; i++) {
                seasons.push({
                    title: `Season ${i}`,
                    season: i,
                    selected: i === this.currentSeason
                });
            }

            this.filter.set('season', seasons);
            this.filter.chosen('season', [`Season ${this.currentSeason}`]);
        }

        async load() {
            this.activity.loader(true);
            this.scroll.clear();

            try {
                const data = await this.player.loadSeasonData(this.currentSeason);
                this.translates = data.translates;
                this.episodes = data.episodes;

                if (this.episodes.length === 0) {
                    this.empty();
                } else {
                    this.build();
                }

            } catch (e) {
                console.error('[UA Online] Load error:', e);
                this.empty();
            } finally {
                this.activity.loader(false);
            }
        }

        build() {
            const episodesMap = {};

            this.episodes.forEach(ep => {
                const num = ep.episode || ep.e;
                if (!episodesMap[num]) {
                    episodesMap[num] = [];
                }
                episodesMap[num].push(ep);
            });

            Lampa.Api.seasons(this.object.movie, [this.currentSeason], data => {
                const seasonData = data[this.currentSeason];
                const tmdbEpisodes = seasonData && seasonData.episodes ? seasonData.episodes : [];

                tmdbEpisodes.forEach(tmdbEp => {
                    const onlineEpisodes = episodesMap[tmdbEp.episode_number];

                    if (onlineEpisodes && onlineEpisodes.length > 0) {
                        const card = this.createEpisodeCard(tmdbEp, onlineEpisodes);
                        this.scroll.append(card);
                    }
                });

                Lampa.Controller.enable('content');
            });
        }

        createEpisodeCard(tmdbEpisode, onlineEpisodes) {
            const hash = Lampa.Utils.hash([
                this.currentSeason,
                tmdbEpisode.episode_number,
                this.object.movie.original_title
            ].join(''));

            const view = Lampa.Timeline.view(hash);

            const card = Lampa.Template.get('online_folder', {
                title: tmdbEpisode.name,
                quality: `${this.currentSeason}x${tmdbEpisode.episode_number}`,
                info: tmdbEpisode.air_date ? tmdbEpisode.air_date.split('-')[0] : ''
            });

            const episode = {
                number: tmdbEpisode.episode_number,
                title: tmdbEpisode.name,
                season: this.currentSeason,
                timeline: view,
                img: tmdbEpisode.still_path ?
                    Lampa.TMDB.image('t/p/w300' + tmdbEpisode.still_path) : ''
            };

            if (view.percent) {
                card.find('.online-folder__timeline').css('width', view.percent + '%');
            }

            if (view.time) {
                card.find('.online-folder__timeline-value').text(Lampa.Utils.secondsToTime(view.time, true));
            }

            card.on('hover:enter', () => {
                this.playEpisode(episode, onlineEpisodes);
            });

            return card;
        }

        playEpisode(episode, onlineEpisodes) {
            const savedVoice = this.voiceStorage.get();

            const voicesMap = {};
            onlineEpisodes.forEach(ep => {
                const voice = ep.translate || 'Ukrainian';
                if (!voicesMap[voice]) {
                    voicesMap[voice] = [];
                }
                voicesMap[voice].push(ep);
            });

            const voices = Object.keys(voicesMap);
            let selectedVoice = savedVoice && voicesMap[savedVoice] ?
                savedVoice : voices[0];

            if (voices.length > 1) {
                const items = voices.map(v => ({
                    title: v,
                    subtitle: voicesMap[v][0].source || '',
                    selected: v === selectedVoice,
                    voice: v
                }));

                Lampa.Select.show({
                    title: 'Select voice',
                    items: items,
                    onSelect: (item) => {
                        Lampa.Select.close();
                        this.voiceStorage.set(item.voice);
                        this.startEpisodePlayback(episode, voicesMap[item.voice][0]);
                    },
                    onBack: () => {
                        Lampa.Select.close();
                    }
                });
            } else {
                this.startEpisodePlayback(episode, voicesMap[selectedVoice][0]);
            }
        }

        async startEpisodePlayback(episode, onlineData) {
            try {
                Lampa.Loading.start();

                const filteredQuality = this.processor.filterQuality(onlineData.quality);

                if (!filteredQuality) {
                    Lampa.Noty.show('No quality 1080p or higher');
                    return;
                }

                const quality = this.processor.prepareQuality(filteredQuality);

                const playData = {
                    title: episode.title,
                    url: Lampa.Player.getUrlQuality(quality),
                    quality: quality,
                    timeline: episode.timeline,
                    subtitles: onlineData.subtitles || false,
                    translate_name: onlineData.translate
                };

                episode.mark = () => {
                    Lampa.Timeline.add({
                        title: episode.title,
                        time: 0,
                        duration: 0,
                        percent: 100
                    });
                };

                Lampa.Player.play(playData);
                Lampa.Player.playlist([]);

                episode.mark();

            } catch (e) {
                console.error('[UA Online] Playback error:', e);
                Lampa.Noty.show('Playback error');
            } finally {
                Lampa.Loading.stop();
            }
        }

        empty() {
            const empty = Lampa.Template.get('online_folder', {
                title: 'No content found on UA sources',
                quality: '',
                info: ''
            });

            this.scroll.append(empty);
        }

        render() {
            return this.scroll.render();
        }

        destroy() {
            this.scroll.destroy();
            this.filter.destroy();
        }
    }

    function setupSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'ukr_online',
            name: 'UA Online',
            icon: '<svg viewBox="0 0 48 48"><rect fill="#005BBB" width="48" height="24"/><rect fill="#FFD500" y="24" width="48" height="24"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'ukr_online',
            param: {
                name: 'ukr_online_server',
                type: 'input',
                default: CONFIG.server
            },
            field: {
                name: 'Lampac Server',
                placeholder: '192.168.1.100:9118'
            },
            onChange: (value) => {
                CONFIG.server = value;
                Lampa.Storage.set('ukr_online_server', value);
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'ukr_online',
            param: {
                name: 'ukr_online_min_quality',
                type: 'select',
                default: '1080',
                values: {
                    '720': '720p (HD)',
                    '1080': '1080p (FHD)',
                    '1440': '1440p (2K)',
                    '2160': '2160p (4K)'
                }
            },
            field: {
                name: 'Min Quality'
            },
            onChange: (value) => {
                CONFIG.minQuality = parseInt(value);
                Lampa.Storage.set('ukr_online_min_quality', value);
            }
        });

        const savedServer = Lampa.Storage.get('ukr_online_server');
        if (savedServer) CONFIG.server = savedServer;

        const savedQuality = Lampa.Storage.get('ukr_online_min_quality');
        if (savedQuality) CONFIG.minQuality = parseInt(savedQuality);
    }

    function init() {
        setupSettings();
        Lampa.Component.add('ukr_episodes', EpisodesComponent);

        Lampa.Listener.follow('full', e => {
            if (e.type === 'complite') {
                const button = $(`
                    <div class="full-start__button selector view--ukr-online">
                        <svg viewBox="0 0 48 48" style="width: 1.8em; height: 1.8em;">
                            <rect fill="#005BBB" width="48" height="24"/>
                            <rect fill="#FFD500" y="24" width="48" height="24"/>
                        </svg>
                        <span>UA Online</span>
                    </div>
                `);

                const subtitle = `Server: ${CONFIG.server.split(':')[0]} | Min: ${CONFIG.minQuality}p`;
                button.attr('data-subtitle', subtitle);

                e.object.activity.render()
                    .find('.view--torrent')
                    .after(button);

                button.on('hover:enter', () => {
                    if (e.data.movie.name) {
                        Lampa.Activity.push({
                            url: '',
                            title: 'Episodes',
                            component: 'ukr_episodes',
                            movie: e.data.movie,
                            page: 1
                        });
                    } else {
                        const player = new MoviePlayer(e.data);
                        player.play();
                    }
                });
            }
        });

        console.log('[UA Online] Plugin loaded with sources:', CONFIG.sources);
    }

    if (window.Lampa) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();