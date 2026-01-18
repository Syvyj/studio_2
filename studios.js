(function () {
    'use strict';

    /**
     * STUDIOS MASTER (Unified)
     * Developed by: Syvyj & Gemini Thought Partner
     * Version: 1.4.0
     * Description: Unified studio collections with fixed dynamic Netflix-style UI
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
            style_class: 'lampa--apple',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
            categories: [
                { "title": "Хіти Apple TV+", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "popularity.desc" } },
                { "title": "Apple Original Films", "url": "discover/movie", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "release_date.desc", "vote_count.gte": "10" } },
                { "title": "Фантастика Apple", "url": "discover/tv", "params": { "with_watch_providers": "350", "with_genres": "10765", "sort_by": "vote_average.desc" } }
            ]
        },
        'hbo': {
            title: 'HBO',
            icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor"><path d="M7.042 16.896H4.414v-3.754H2.708v3.754H.01L0 7.22h2.708v3.6h1.706v-3.6h2.628zm12.043.046C21.795 16.94 24 14.689 24 11.978a4.89 4.89 0 0 0-4.915-4.92c-2.707-.002-4.09 1.991-4.432 2.795.003-1.207-1.187-2.632-2.58-2.634H7.59v9.674l4.181.001c1.686 0 2.886-1.46 2.888-2.713.385.788 1.72 2.762 4.427 2.76zm-7.665-3.936c.387 0 .692.382.692.817 0 .435-.305.817-.692.817h-1.33v-1.634zm.005-3.633c.387 0 .692.382.692.817 0 .436-.305.818-.692.818h-1.33V9.373zm1.77 2.607c.305-.039.813-.387.992-.61-.063.276-.068 1.074.006 1.35-.204-.314-.688-.701-.998-.74zm3.43 0a2.462 2.462 0 1 1 4.924 0 2.462 2.462 0 0 1-4.925 0zm2.462 1.936a1.936 1.936 0 1 0 0-3.872 1.936 1.936 0 0 0 0 3.872z"/></svg>',
            categories: [
                { "title": "Нові фільми WB/HBO", "url": "discover/movie", "params": { "with_companies": "174|49", "sort_by": "primary_release_date.desc" } },
                { "title": "HBO: Головні хіти", "url": "discover/tv", "params": { "with_networks": "49", "sort_by": "popularity.desc" } }
            ]
        },
        'amazon': {
            title: 'Prime Video',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.787 15.292c-.336-.43-2.222-.204-3.069-.103-.257.031-.296-.193-.065-.356 1.504-1.056 3.968-.75 4.255-.397.288.357-.076 2.827-1.485 4.007-.217.18-.423.084-.327-.155.317-.792 1.027-2.566.69-2.996"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>',
            categories: [
                { "title": "В тренді на Prime Video", "url": "discover/tv", "params": { "with_networks": "1024", "sort_by": "popularity.desc" } }
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
        'hulu': {
            title: 'Hulu',
            icon: '<svg viewBox="0 0 24 24" fill="#3DBB3D"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>',
            categories: [
                { "title": "Hulu Originals", "url": "discover/tv", "params": { "with_networks": "453", "sort_by": "popularity.desc" } }
            ]
        },
        'paramount': {
            title: 'Paramount+',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22H22L12 2ZM12 6.5L18.5 19.5H5.5L12 6.5Z"/></svg>',
            categories: [
                { "title": "Paramount+ Originals", "url": "discover/tv", "params": { "with_networks": "4330", "sort_by": "popularity.desc" } }
            ]
        },
        'syfy': {
            title: 'Syfy',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>',
            categories: [
                { "title": "Хіти Syfy", "url": "discover/tv", "params": { "with_networks": "77", "sort_by": "popularity.desc" } }
            ]
        },
        'educational_and_reality': {
            title: 'Пізнавальне',
            icon: '<svg viewBox="0 0 24 24" fill="#FF9800"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>',
            categories: [
                { "title": "Discovery Channel", "url": "discover/tv", "params": { "with_networks": "64", "sort_by": "popularity.desc" } },
                { "title": "National Geographic", "url": "discover/tv", "params": { "with_networks": "43", "sort_by": "popularity.desc" } },
                { "title": "Animal Planet", "url": "discover/tv", "params": { "with_networks": "91", "sort_by": "popularity.desc" } },
                { "title": "BBC Earth", "url": "discover/tv", "params": { "with_networks": "4", "sort_by": "vote_average.desc" } }
            ]
        }
    };

    // -----------------------------------------------------------------
    // UI LOGIC (Spotlight)
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
                }, 500);
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
    // COMPONENTS
    // -----------------------------------------------------------------

    function StudiosMain(object) {
        var comp = new Lampa.InteractionMain(object);
        var config = SERVICE_CONFIGS[object.service_id];
        var state = null;
        var _this = comp;

        comp.create = function () {
            if (config.style_class) this.activity.render().addClass(config.style_class);

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
                        if (fulldata[0] && fulldata[0].results[0]) state.update(fulldata[0].results[0]);
                    }
                }
                _this.activity.loader(false);
            };

            // FIX: Глобальний слухач фокусу для динамічного оновлення
            _this.focus_listener = function (e) {
                if (state && e.data && (e.data.title || e.data.name)) {
                    state.update(e.data);
                }
            };
            Lampa.Listener.follow('focus', _this.focus_listener);

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

        // Очистка при закритті
        const baseDestroy = comp.destroy;
        comp.destroy = function () {
            if (_this.focus_listener) Lampa.Listener.remove('focus', _this.focus_listener);
            if (state) state.destroy();
            if (baseDestroy) baseDestroy.call(this);
        };

        return comp;
    }

    // -----------------------------------------------------------------
    // START
    // -----------------------------------------------------------------

    function startPlugin() {
        if (window.plugin_studios_master_ready) return;
        window.plugin_studios_master_ready = true;

        Lampa.Component.add('studios_main', StudiosMain);
        Lampa.Component.add('studios_view', function (object) { return new Lampa.InteractionCategory(object); });

        if (!$('#studios-master-styles').length) {
            $('body').append(`<style id="studios-master-styles">
                .lampa--netflix { background: #141414 !important; }
                .new-interface .full-start__background {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    object-fit: cover; opacity: 0; transition: opacity 0.8s; z-index: 0;
                    mask-image: linear-gradient(to bottom, black 20%, transparent 95%);
                    -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 95%);
                }
                .new-interface .full-start__background.loaded { opacity: 0.45; }
                .new-interface-info { position: relative; z-index: 2; padding: 40px 4% 0; height: 300px; pointer-events: none; }
                .new-interface-info__body { width: 50%; }
                .new-interface-info__title { font-size: 3.5em; font-weight: bold; margin-bottom: 12px; }
                .new-interface-info__description { 
                    font-size: 1.1em; line-height: 1.5; opacity: 0.8; 
                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; 
                }
                .lampa--netflix .card--wide { width: 21em !important; border-radius: 4px; transition: 0.3s !important; }
                .lampa--netflix .card.focus { transform: scale(1.08) !important; border: 3px solid #fff !important; z-index: 100; box-shadow: 0 10px 20px rgba(0,0,0,0.8); }
                .lampa--netflix .category__title { font-size: 1.5em; font-weight: bold; margin: 15px 10px; }
                .lampa--netflix .interaction-main__row { position: relative; z-index: 5; margin-top: -20px; }
                .lampa--netflix .card__title { display: none; }
            </style>`);
        }

        function addButtons() {
            const list = $('.menu__list').eq(0);
            if (!list.length) return;
            Object.keys(SERVICE_CONFIGS).forEach(sid => {
                if (list.find(`[data-sid="${sid}"]`).length) return;
                const item = $(`<li class="menu__item selector" data-sid="${sid}">
                    <div class="menu__ico">${SERVICE_CONFIGS[sid].icon}</div>
                    <div class="menu__text">${SERVICE_CONFIGS[sid].title}</div>
                </li>`);
                item.on('hover:enter', () => {
                    Lampa.Activity.push({ title: SERVICE_CONFIGS[sid].title, component: 'studios_main', service_id: sid });
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