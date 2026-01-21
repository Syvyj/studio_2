(function() {
    'use strict';

    const CONFIG = {
        server: '192.168.1.31:12320',
        minQuality: 1080,
        minSeeds: 5,  // ÐœÑ–Ð½Ñ–Ð¼ÑƒÐ¼ ÑÑ–Ð´Ñ–Ð² Ð´Ð»Ñ Ð¿Ð¾ÐºÐ°Ð·Ñƒ
        timeout: 15000
    };

    function addUrlParams(url, params) {
        const separator = url.indexOf('?') >= 0 ? '&' : '?';
        return url + separator + params;
    }

    class PidtorAPI {
        constructor(movie) {
            this.movie = movie;
            this.network = new Lampa.Reguest();
        }

        getRequestParams() {
            const params = [
                `id=${this.movie.id}`,
                `title=${encodeURIComponent(this.movie.title || this.movie.name)}`,
                `original_title=${encodeURIComponent(this.movie.original_title || this.movie.original_name)}`,
                `year=${(this.movie.release_date || this.movie.first_air_date || '0000').slice(0, 4)}`,
                `source=tmdb`
            ];

            return params.join('&');
        }

        async getTorrents() {
            const url = `http://${CONFIG.server}/pidtor`;
            const params = this.getRequestParams();
            const fullUrl = addUrlParams(url, params);

            console.log('[UA Pidtor] Requesting:', fullUrl);

            return new Promise((resolve, reject) => {
                this.network.timeout(CONFIG.timeout);
                this.network.silent(fullUrl,
                    data => {
                        console.log('[UA Pidtor] Response:', data);
                        if (data && data.torrents && data.torrents.length > 0) {
                            resolve(data.torrents);
                        } else {
                            console.log('[UA Pidtor] No torrents found');
                            reject('No torrents');
                        }
                    },
                    err => {
                        console.error('[UA Pidtor] Error:', err);
                        reject(err);
                    }
                );
            });
        }
    }

    class TorrentProcessor {
        constructor() {}

        filterByQuality(torrents) {
            return torrents.filter(t => {
                const quality = this.extractQuality(t.quality || t.title || '');
                return quality >= CONFIG.minQuality;
            });
        }

        filterBySeeds(torrents) {
            return torrents.filter(t => {
                const seeds = parseInt(t.seed || t.seeds || 0);
                return seeds >= CONFIG.minSeeds;
            });
        }

        extractQuality(text) {
            if (/2160|4K|UHD/i.test(text)) return 2160;
            if (/1440|2K/i.test(text)) return 1440;
            if (/1080|FHD/i.test(text)) return 1080;
            if (/720|HD/i.test(text)) return 720;
            return 0;
        }

        getVoiceName(torrent) {
            // ÐŸÑ€Ñ–Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚ Ð½Ð°Ð·Ð² Ð¾Ð·Ð²ÑƒÑ‡Ð¾Ðº
            const title = torrent.title || torrent.name || '';

            // Ð£ÐºÑ€Ð°Ñ—Ð½ÑÑŒÐºÑ– Ð¾Ð·Ð²ÑƒÑ‡ÐºÐ¸
            if (/ÑƒÐºÑ€|ukrainian|ukr/i.test(title)) return 'Ð£ÐºÑ€Ð°Ñ—Ð½ÑÑŒÐºÐ° Ð¾Ð·Ð²ÑƒÑ‡ÐºÐ°';
            if (/Ð±Ð°Ð³Ð°Ñ‚Ð¾Ð³Ð¾Ð»Ð¾Ñ/i.test(title)) return 'Ð‘Ð°Ð³Ð°Ñ‚Ð¾Ð³Ð¾Ð»Ð¾ÑÐ¸Ð¹ Ð¿ÐµÑ€ÐµÐºÐ»Ð°Ð´';
            if (/Ð´ÑƒÐ±Ð»ÑÐ¶/i.test(title)) return 'Ð”ÑƒÐ±Ð»ÑÐ¶';

            // Ð†Ð½ÑˆÑ– Ð¾Ð·Ð²ÑƒÑ‡ÐºÐ¸
            if (/NewStudio/i.test(title)) return 'NewStudio';
            if (/Ukr\.Club/i.test(title)) return 'Ukr.Club';
            if (/LostFilm/i.test(title)) return 'LostFilm';
            if (/Gears/i.test(title)) return 'Gears Media';
            if (/2x2/i.test(title)) return '2x2';

            return 'ÐžÑ€Ð¸Ð³Ñ–Ð½Ð°Ð»';
        }

        groupByVoice(torrents) {
            const groups = {};

            torrents.forEach(t => {
                const voice = this.getVoiceName(t);
                if (!groups[voice]) {
                    groups[voice] = [];
                }
                groups[voice].push(t);
            });

            console.log('[UA Pidtor] Grouped by voice:', Object.keys(groups));

            return groups;
        }

        selectBestTorrent(torrents) {
            // Ð¡Ð¾Ñ€Ñ‚ÑƒÑ”Ð¼Ð¾ Ð·Ð° ÑÑ–Ð´Ð°Ð¼Ð¸ (Ð±Ñ–Ð»ÑŒÑˆÐµ = ÐºÑ€Ð°Ñ‰Ðµ)
            return torrents.sort((a, b) => {
                const seedsA = parseInt(a.seed || a.seeds || 0);
                const seedsB = parseInt(b.seed || b.seeds || 0);
                return seedsB - seedsA;
            })[0];
        }

        formatSize(bytes) {
            if (!bytes) return '';
            const gb = bytes / (1024 * 1024 * 1024);
            return gb.toFixed(2) + ' GB';
        }
    }

    class MoviePlayer {
        constructor(object) {
            this.object = object;
            this.api = new PidtorAPI(object.movie);
            this.processor = new TorrentProcessor();
        }

        async play() {
            try {
                Lampa.Loading.start();

                console.log('[UA Pidtor] Starting playback for:', this.object.movie.title || this.object.movie.name);

                const torrents = await this.api.getTorrents();

                // Ð¤Ñ–Ð»ÑŒÑ‚Ñ€ÑƒÑ”Ð¼Ð¾ Ð·Ð° ÑÐºÑ–ÑÑ‚ÑŽ Ñ‚Ð° ÑÑ–Ð´Ð°Ð¼Ð¸
                let filtered = this.processor.filterByQuality(torrents);
                filtered = this.processor.filterBySeeds(filtered);

                if (filtered.length === 0) {
                    Lampa.Noty.show('ÐÐµ Ð·Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾ Ñ‚Ð¾Ñ€Ñ€ÐµÐ½Ñ‚Ñ–Ð² Ð· ÑÐºÑ–ÑÑ‚ÑŽ 1080p+ Ñ‚Ð° Ð´Ð¾ÑÑ‚Ð°Ñ‚Ð½ÑŒÐ¾ÑŽ ÐºÑ–Ð»ÑŒÐºÑ–ÑÑ‚ÑŽ ÑÑ–Ð´Ñ–Ð²');
                    return;
                }

                // Ð“Ñ€ÑƒÐ¿ÑƒÑ”Ð¼Ð¾ Ð·Ð° Ð¾Ð·Ð²ÑƒÑ‡ÐºÐ°Ð¼Ð¸
                const voiceGroups = this.processor.groupByVoice(filtered);
                const voices = Object.keys(voiceGroups);

                if (voices.length > 1) {
                    this.showVoiceSelector(voiceGroups);
                } else {
                    const torrent = this.processor.selectBestTorrent(filtered);
                    await this.playTorrent(torrent);
                }

            } catch(e) {
                console.error('[UA Pidtor] Error:', e);
                Lampa.Noty.show('Ð¢Ð¾Ñ€Ñ€ÐµÐ½Ñ‚Ð¸ Ð½Ðµ Ð·Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾');
            } finally {
                Lampa.Loading.stop();
            }
        }

        showVoiceSelector(voiceGroups) {
            const voices = Object.keys(voiceGroups);

            const items = voices.map(voice => {
                const torrents = voiceGroups[voice];
                const best = this.processor.selectBestTorrent(torrents);
                const seeds = best.seed || best.seeds || 0;
                const size = this.processor.formatSize(best.size);

                return {
                    title: voice,
                    subtitle: `${seeds} ÑÑ–Ð´Ñ–Ð² â€¢ ${size}`,
                    voice: voice,
                    torrents: torrents
                };
            });

            Lampa.Select.show({
                title: 'ÐžÐ±ÐµÑ€Ñ–Ñ‚ÑŒ Ð¾Ð·Ð²ÑƒÑ‡ÐºÑƒ',
                items: items,
                onSelect: async (item) => {
                    Lampa.Select.close();
                    Lampa.Loading.start();
                    const torrent = this.processor.selectBestTorrent(item.torrents);
                    await this.playTorrent(torrent);
                    Lampa.Loading.stop();
                },
                onBack: () => {
                    Lampa.Select.close();
                    Lampa.Controller.toggle('content');
                }
            });
        }

        async playTorrent(torrent) {
            try {
                console.log('[UA Pidtor] Playing torrent:', torrent);

                // Lampac Ð²Ð¶Ðµ Ð¾Ð±Ñ€Ð¾Ð±Ð»ÑÑ” Ñ‚Ð¾Ñ€Ñ€ÐµÐ½Ñ‚Ð¸ Ñ‡ÐµÑ€ÐµÐ· /lite/pidtor
                const playUrl = torrent.url || torrent.link;

                if (!playUrl) {
                    throw new Error('ÐÐµÐ¼Ð°Ñ” URL Ð´Ð»Ñ Ð²Ñ–Ð´Ñ‚Ð²Ð¾Ñ€ÐµÐ½Ð½Ñ');
                }

                const hash = Lampa.Utils.hash(
                    this.object.movie.original_title || this.object.movie.title
                );

                const playData = {
                    title: this.object.movie.title || this.object.movie.name,
                    url: playUrl,
                    timeline: Lampa.Timeline.view(hash)
                };

                Lampa.Favorite.add('history', this.object.movie, 100);
                Lampa.Player.play(playData);
                Lampa.Player.playlist([]);

            } catch(e) {
                console.error('[UA Pidtor] Play error:', e);
                Lampa.Noty.show('ÐŸÐ¾Ð¼Ð¸Ð»ÐºÐ° Ð²Ñ–Ð´Ñ‚Ð²Ð¾Ñ€ÐµÐ½Ð½Ñ');
            }
        }
    }

    class SeriesPlayer {
        constructor(object) {
            this.object = object;
            this.api = new PidtorAPI(object.movie);
            this.processor = new TorrentProcessor();
        }

        async loadSeasonData() {
            try {
                const torrents = await this.api.getTorrents();

                // Ð¤Ñ–Ð»ÑŒÑ‚Ñ€ÑƒÑ”Ð¼Ð¾ Ð·Ð° ÑÐºÑ–ÑÑ‚ÑŽ Ñ‚Ð° ÑÑ–Ð´Ð°Ð¼Ð¸
                let filtered = this.processor.filterByQuality(torrents);
                filtered = this.processor.filterBySeeds(filtered);

                if (filtered.length === 0) {
                    throw new Error('Ð¢Ð¾Ñ€Ñ€ÐµÐ½Ñ‚Ð¸ Ð½Ðµ Ð·Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾');
                }

                // Ð“Ñ€ÑƒÐ¿ÑƒÑ”Ð¼Ð¾ Ð·Ð° Ð¾Ð·Ð²ÑƒÑ‡ÐºÐ°Ð¼Ð¸
                const voiceGroups = this.processor.groupByVoice(filtered);

                return { voiceGroups, torrents: filtered };

            } catch(e) {
                console.error('[UA Pidtor] Load error:', e);
                throw e;
            }
        }
    }

    class EpisodesComponent {
        constructor(object) {
            this.object = object;
            this.player = new SeriesPlayer(object);
            this.processor = new TorrentProcessor();

            this.voiceGroups = {};
            this.activity = Lampa.Activity.active();
        }

        create() {
            this.scroll = new Lampa.Scroll({ mask: true, over: true });

            const info = Lampa.Template.get('info');
            info.find('.info__title').text('Ð¡ÐµÑ€Ñ–Ð°Ð»Ð¸ Ñ‡ÐµÑ€ÐµÐ· Ñ‚Ð¾Ñ€Ñ€ÐµÐ½Ñ‚Ð¸');
            info.find('.info__create').text('Ð’Ð¸Ð±ÐµÑ€Ñ–Ñ‚ÑŒ Ñ‚Ð¾Ñ€Ñ€ÐµÐ½Ñ‚ Ð´Ð»Ñ Ð·Ð°Ð²Ð°Ð½Ñ‚Ð°Ð¶ÐµÐ½Ð½Ñ Ð²ÑÑŒÐ¾Ð³Ð¾ ÑÐµÐ·Ð¾Ð½Ñƒ');

            this.scroll.append(info);
            this.activity.loader(true);

            this.load();

            return this.scroll.render();
        }

        async load() {
            this.activity.loader(true);
            this.scroll.clear();

            try {
                const data = await this.player.loadSeasonData();
                this.voiceGroups = data.voiceGroups;

                if (Object.keys(this.voiceGroups).length === 0) {
                    this.empty();
                } else {
                    this.build();
                }

            } catch(e) {
                console.error('[UA Pidtor] Load error:', e);
                this.empty();
            } finally {
                this.activity.loader(false);
            }
        }

        build() {
            const voices = Object.keys(this.voiceGroups);

            voices.forEach(voice => {
                const torrents = this.voiceGroups[voice];
                const best = this.processor.selectBestTorrent(torrents);

                const seeds = best.seed || best.seeds || 0;
                const size = this.processor.formatSize(best.size);
                const quality = this.processor.extractQuality(best.quality || best.title || '');

                const card = Lampa.Template.get('online_folder', {
                    title: voice,
                    quality: quality + 'p',
                    info: `${seeds} ÑÑ–Ð´Ñ–Ð² â€¢ ${size}`
                });

                card.on('hover:enter', () => {
                    this.playTorrent(best);
                });

                this.scroll.append(card);
            });

            Lampa.Controller.enable('content');
        }

        playTorrent(torrent) {
            const playUrl = torrent.url || torrent.link;

            if (!playUrl) {
                Lampa.Noty.show('ÐÐµÐ¼Ð°Ñ” URL Ð´Ð»Ñ Ð²Ñ–Ð´Ñ‚Ð²Ð¾Ñ€ÐµÐ½Ð½Ñ');
                return;
            }

            const hash = Lampa.Utils.hash(
                this.object.movie.original_title || this.object.movie.title
            );

            const playData = {
                title: this.object.movie.title || this.object.movie.name,
                url: playUrl,
                timeline: Lampa.Timeline.view(hash)
            };

            Lampa.Favorite.add('history', this.object.movie, 100);
            Lampa.Player.play(playData);
            Lampa.Player.playlist([]);
        }

        empty() {
            const empty = Lampa.Template.get('online_folder', {
                title: 'Ð¢Ð¾Ñ€Ñ€ÐµÐ½Ñ‚Ð¸ Ð½Ðµ Ð·Ð½Ð°Ð¹Ð´ÐµÐ½Ð¾',
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
        }
    }

    function setupSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'ua_pidtor',
            name: 'UA Pidtor',
            icon: '<svg viewBox="0 0 48 48"><rect fill="#005BBB" width="48" height="24"/><rect fill="#FFD500" y="24" width="48" height="24"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'ua_pidtor',
            param: {
                name: 'ua_pidtor_server',
                type: 'input',
                default: CONFIG.server
            },
            field: {
                name: 'Lampac Server',
                placeholder: '192.168.1.31:12320'
            },
            onChange: (value) => {
                CONFIG.server = value;
                Lampa.Storage.set('ua_pidtor_server', value);
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'ua_pidtor',
            param: {
                name: 'ua_pidtor_min_quality',
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
                name: 'ÐœÑ–Ð½Ñ–Ð¼Ð°Ð»ÑŒÐ½Ð° ÑÐºÑ–ÑÑ‚ÑŒ'
            },
            onChange: (value) => {
                CONFIG.minQuality = parseInt(value);
                Lampa.Storage.set('ua_pidtor_min_quality', value);
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'ua_pidtor',
            param: {
                name: 'ua_pidtor_min_seeds',
                type: 'select',
                default: '5',
                values: {
                    '0': 'Ð‘ÑƒÐ´ÑŒ-ÑÐºÐ° ÐºÑ–Ð»ÑŒÐºÑ–ÑÑ‚ÑŒ',
                    '5': 'ÐœÑ–Ð½Ñ–Ð¼ÑƒÐ¼ 5 ÑÑ–Ð´Ñ–Ð²',
                    '10': 'ÐœÑ–Ð½Ñ–Ð¼ÑƒÐ¼ 10 ÑÑ–Ð´Ñ–Ð²',
                    '20': 'ÐœÑ–Ð½Ñ–Ð¼ÑƒÐ¼ 20 ÑÑ–Ð´Ñ–Ð²'
                }
            },
            field: {
                name: 'ÐœÑ–Ð½Ñ–Ð¼ÑƒÐ¼ ÑÑ–Ð´Ñ–Ð²'
            },
            onChange: (value) => {
                CONFIG.minSeeds = parseInt(value);
                Lampa.Storage.set('ua_pidtor_min_seeds', value);
            }
        });

        const savedServer = Lampa.Storage.get('ua_pidtor_server');
        if (savedServer) CONFIG.server = savedServer;

        const savedQuality = Lampa.Storage.get('ua_pidtor_min_quality');
        if (savedQuality) CONFIG.minQuality = parseInt(savedQuality);

        const savedSeeds = Lampa.Storage.get('ua_pidtor_min_seeds');
        if (savedSeeds) CONFIG.minSeeds = parseInt(savedSeeds);
    }

    function init() {
        setupSettings();
        Lampa.Component.add('ua_pidtor_episodes', EpisodesComponent);

        Lampa.Listener.follow('full', e => {
            if (e.type === 'complite') {
                const button = $(`
                    <div class="full-start__button selector view--ua-pidtor">
                        <svg viewBox="0 0 48 48" style="width: 1.8em; height: 1.8em;">
                            <rect fill="#005BBB" width="48" height="24"/>
                            <rect fill="#FFD500" y="24" width="48" height="24"/>
                        </svg>
                        <span>UA Pidtor</span>
                    </div>
                `);

                const subtitle = `Ð¢Ð¾Ñ€Ñ€ÐµÐ½Ñ‚Ð¸ | ${CONFIG.minQuality}p+ | ${CONFIG.minSeeds}+ ÑÑ–Ð´Ñ–Ð²`;
                button.attr('data-subtitle', subtitle);

                e.object.activity.render()
                    .find('.view--torrent')
                    .after(button);

                button.on('hover:enter', () => {
                    if (e.data.movie.name) {
                        Lampa.Activity.push({
                            url: '',
                            title: 'Ð¢Ð¾Ñ€Ñ€ÐµÐ½Ñ‚Ð¸',
                            component: 'ua_pidtor_episodes',
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

        console.log('[UA Pidtor] âœ… Plugin loaded');
        console.log('[UA Pidtor] ðŸ–¥ï¸  Server:', CONFIG.server);
        console.log('[UA Pidtor] ðŸŽ¬ Min quality:', CONFIG.minQuality + 'p');
        console.log('[UA Pidtor] ðŸŒ± Min seeds:', CONFIG.minSeeds);
    }

    if (window.Lampa) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
