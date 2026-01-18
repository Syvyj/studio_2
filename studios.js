(function () {
    'use strict';

    /**
     * STUDIOS MASTER (Unified)
     * Developed by: Syvyj & Gemini Thought Partner
     * Version: 1.3.0
     * Description: Unified studio collections for Lampa with dynamic Netflix-style UI
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
                { "title": "Кримінальні драми", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "80", "sort_by": "popularity.desc" } },
                { "title": "K-Dramas", "url": "discover/tv", "params": { "with_networks": "213", "with_original_language": "ko", "sort_by": "popularity.desc" } },
                { "title": "Вибір критиків", "url": "discover/movie", "params": { "with_companies": "213", "vote_average.gte": "7.5", "vote_count.gte": "300", "sort_by": "vote_average.desc" } }
            ]
        },
        'apple': {
            title: 'Apple TV+',
            style_class: 'lampa--apple',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
            categories: [
                { "title": "Хіти Apple TV+", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "popularity.desc" } },
                { "title": "Apple Original Films", "url": "discover/movie", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "release_date.desc" } }
            ]
        },
        'disney': {
            title: 'Disney+',
            style_class: 'lampa--disney',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19,3V7m2-2H17m-10.31,4L8.69,21m-5.69-7c0-3,5.54-4.55,9-2m-9,2s12.29-2,13.91,6.77c1.09,5.93-6.58,6.7-9.48,5.89S3,16.06,3,14.06"/></svg>',
            categories: [
                { "title": "Marvel: Кіновсесвіт", "url": "discover/movie", "params": { "with_companies": "420", "sort_by": "release_date.desc" } },
                { "title": "Зоряні Війни", "url": "discover/tv", "params": { "with_companies": "1", "sort_by": "popularity.desc" } }
            ]
        },
        'educational_and_reality': {
            title: 'Пізнавальне',
            icon: '<svg viewBox="0 0 24 24" fill="#FF9800"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>',
            categories: [
                { "title": "Discovery Channel", "url": "discover/tv", "params": { "with_networks": "64", "sort_by": "popularity.desc" } },
                { "title": "National Geographic", "url": "discover/tv", "params": { "with_networks": "43", "sort_by": "popularity.desc" } }
            ]
        }
    };

    // -----------------------------------------------------------------
    // UI LOGIC (Spotlight & Background)
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
                container.insertBefore(this.info.render(true), this.background.nextSibling);
                this.attached = true;
            },
            update(data) {
                if (!data) return;
                this.info.update(data);
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
                this.info.destroy();
                if (this.background && this.background.parentNode) {
                    this.background.parentNode.removeChild(this.background);
                }
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
            if (!this.html) this.create();
            this.html.find('.new-interface-info__title').text(data.title || data.name || '');
            this.html.find('.new-interface-info__description').text(data.overview || '');
            this.loadLogo(data);
        }
        loadLogo(data) {
            if (!Lampa.TMDB || !data.id) return;
            const type = data.media_type || (data.name ? 'tv' : 'movie');
            const url = Lampa.TMDB.api(`${type}/${data.id}/images?api_key=${Lampa.TMDB.key()}`);

            $.getJSON(url, (res) => {
                const logo = res.logos && res.logos.find(l => l.iso_639_1 === 'uk' || l.iso_639_1 === 'en') || (res.logos && res.logos[0]);
                if (logo) {
                    const imgUrl = Lampa.TMDB.image('/t/p/w500' + logo.file_path);
                    this.html.find('.new-interface-info__title').html(`<img src="${imgUrl}" style="max-height: 120px">`);
                }
            });
        }
        destroy() { if (this.html) this.html.remove(); }
    }

    // -----------------------------------------------------------------
    // MAIN COMPONENTS
    // -----------------------------------------------------------------

    function StudiosMain(object) {
        var comp = new Lampa.InteractionMain(object);
        var config = SERVICE_CONFIGS[object.service_id];
        var state = null;

        comp.create = function () {
            var _this = this;
            if (config.style_class) this.activity.render().addClass(config.style_class);

            // Ініціалізація банера для Netflix
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
                    if (data && data.results && data.results.length) {
                        Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                        fulldata.push({
                            title: config.categories[parseInt(key)].title,
                            results: data.results,
                            url: config.categories[parseInt(key)].url,
                            params: config.categories[parseInt(key)].params
                        });
                    }
                });

                if (fulldata.length) {
                    _this.build(fulldata);
                    if (state) {
                        state.attach();
                        // Беремо перший фільм для початкового фону
                        if (fulldata[0] && fulldata[0].results[0]) state.update(fulldata[0].results[0]);
                    }
                } else {
                    _this.empty();
                }
                _this.activity.loader(false);
            };

            // ДИНАМІЧНИЙ ФОКУС: Обробка зміни картки
            this.onFocus = function (item) {
                if (state && item.data) {
                    state.update(item.data);
                }
            };

            config.categories.forEach((cat, index) => {
                let params = ['api_key=' + Lampa.TMDB.key(), 'language=uk'];
                if (cat.params) {
                    for (let k in cat.params) {
                        let v = cat.params[k].toString().replace('{current_date}', new Date().toISOString().split('T')[0]);
                        params.push(`${k}=${v}`);
                    }
                }
                let url = Lampa.TMDB.api(cat.url + '?' + params.join('&'));
                network.silent(url, (json) => status.append(index.toString(), json), status.error.bind(status));
            });

            return this.render();
        };

        // Коректне видалення при виході
        const baseDestroy = comp.destroy;
        comp.destroy = function () {
            if (state) state.destroy();
            if (baseDestroy) baseDestroy.call(this);
        };

        return comp;
    }

    // -----------------------------------------------------------------
    // STYLES & INJECTION
    // -----------------------------------------------------------------

    function startPlugin() {
        if (window.plugin_studios_master_ready) return;
        window.plugin_studios_master_ready = true;

        Lampa.Component.add('studios_main', StudiosMain);
        Lampa.Component.add('studios_view', function (object) {
            var comp = new Lampa.InteractionCategory(object);
            comp.create = function () {
                var _this = this;
                var url = Lampa.TMDB.api(object.url + '?api_key=' + Lampa.TMDB.key() + '&language=uk&page=1');
                if (object.params) {
                    for (let k in object.params) url += `&${k}=${object.params[k]}`;
                }
                new Lampa.Reguest().silent(url, (json) => _this.build(json), _this.empty.bind(_this));
            };
            return comp;
        });

        if (!$('#studios-master-styles').length) {
            $('body').append(`<style id="studios-master-styles">
                /* Основний контейнер */
                .lampa--netflix { background: #141414 !important; }
                
                /* Динамічний фон */
                .new-interface .full-start__background {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    object-fit: cover; opacity: 0; transition: opacity 1s ease; z-index: 0;
                    mask-image: linear-gradient(to bottom, black 20%, transparent 95%);
                    -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 95%);
                }
                .new-interface .full-start__background.loaded { opacity: 0.45; }
                
                /* Інфо-панель (Spotlight) */
                .new-interface-info { 
                    position: relative; z-index: 2; padding: 40px 4% 0; height: 320px; 
                    pointer-events: none; display: flex; align-items: flex-end;
                }
                .new-interface-info__body { width: 50%; padding-bottom: 20px; }
                .new-interface-info__title { font-size: 3.8em; font-weight: bold; margin-bottom: 12px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); }
                .new-interface-info__description { 
                    font-size: 1.15em; line-height: 1.5; opacity: 0.9; 
                    display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; 
                    overflow: hidden; text-shadow: 1px 1px 4px rgba(0,0,0,0.8);
                }
                
                /* Картки та Фокус */
                .lampa--netflix .card--wide { width: 21em !important; border-radius: 4px; transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1) !important; }
                .lampa--netflix .card.focus { 
                    transform: scale(1.08) !important; 
                    border: 3px solid #fff !important; 
                    box-shadow: 0 10px 30px rgba(229, 9, 20, 0.5) !important;
                    z-index: 100; 
                }
                
                .lampa--netflix .category__title { font-size: 1.6em; font-weight: bold; margin: 15px 0 10px 15px; color: #fff; }
                .lampa--netflix .interaction-main__row { position: relative; z-index: 5; margin-top: -20px; }
                
                /* Приховуємо стандартні назви на картках для Netflix-стилю */
                .lampa--netflix .card__title { display: none; }
            </style>`);
        }

        function addButtons() {
            const list = $('.menu__list').eq(0);
            if (!list.length) return;
            Object.keys(SERVICE_CONFIGS).forEach(sid => {
                if (list.find(`[data-sid="${sid}"]`).length) return;
                const conf = SERVICE_CONFIGS[sid];
                const item = $(`<li class="menu__item selector" data-sid="${sid}">
                    <div class="menu__ico">${conf.icon}</div>
                    <div class="menu__text">${conf.title}</div>
                </li>`);
                item.on('hover:enter', () => {
                    Lampa.Activity.push({ title: conf.title, component: 'studios_main', service_id: sid });
                });
                list.append(item);
            });
        }

        if (window.appready) addButtons();
        else Lampa.Listener.follow('app', e => { if (e.type === 'ready') addButtons(); });
        setInterval(addButtons, 4000);
    }

    startPlugin();
})();