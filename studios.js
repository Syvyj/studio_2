(function () {
    'use strict';

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
                { "title": "Кримінальні драми", "url": "discover/tv", "params": { "with_networks": "213", "with_genres": "80", "sort_by": "popularity.desc" } },
                { "title": "K-Dramas", "url": "discover/tv", "params": { "with_networks": "213", "with_original_language": "ko", "sort_by": "popularity.desc" } }
            ]
        },
        'apple': {
            title: 'Apple TV+',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
            categories: [
                { "title": "Хіти Apple TV+", "url": "discover/tv", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "popularity.desc" } },
                { "title": "Apple Original Films", "url": "discover/movie", "params": { "with_watch_providers": "350", "watch_region": "UA", "sort_by": "release_date.desc" } }
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
    // NEW INTERFACE LOGIC (Spotlight)
    // -----------------------------------------------------------------

    class InterfaceInfo {
        constructor() { this.html = null; this.loadedLogos = {}; }
        create() {
            this.html = $(`<div class="new-interface-info">
                <div class="new-interface-info__body">
                    <div class="new-interface-info__title"></div>
                    <div class="new-interface-info__description"></div>
                </div>
            </div>`);
        }
        render(js) { if (!this.html) this.create(); return js ? this.html[0] : this.html; }
        update(data) {
            if (!data || !this.html) return;
            this.html.find('.new-interface-info__title').text(data.title || data.name || '');
            this.html.find('.new-interface-info__description').text(data.overview || '');
            this.loadLogo(data);
        }
        loadLogo(data) {
            if (!Lampa.TMDB || !data.id) return;
            const type = data.name ? 'tv' : 'movie';
            const cacheKey = type + '_' + data.id;
            if (this.loadedLogos[cacheKey]) return this.displayLogo(this.loadedLogos[cacheKey]);

            const url = Lampa.TMDB.api(type + '/' + data.id + '/images?api_key=' + Lampa.TMDB.key());
            $.getJSON(url, (res) => {
                const logo = res.logos && res.logos.find(l => l.iso_639_1 === 'uk' || l.iso_639_1 === 'en') || (res.logos && res.logos[0]);
                if (logo) {
                    const imgUrl = Lampa.TMDB.image('/t/p/w500' + logo.file_path);
                    this.loadedLogos[cacheKey] = imgUrl;
                    this.displayLogo(imgUrl);
                }
            });
        }
        displayLogo(url) { this.html.find('.new-interface-info__title').html('<img src="' + url + '" style="max-height: 120px">'); }
        destroy() { if (this.html) this.html.remove(); }
    }

    function createInterfaceState(main) {
        var info = new InterfaceInfo();
        info.create();
        var background = document.createElement('img');
        background.className = 'full-start__background';

        return {
            info: info,
            background: background,
            backgroundLast: '',
            attached: false,
            attach: function () {
                if (this.attached) return;
                var container = main.activity.render()[0];
                if (!container) return;
                container.classList.add('new-interface');
                container.insertBefore(background, container.firstChild);
                container.insertBefore(info.render(true), background.nextSibling);
                this.attached = true;
            },
            update: function (data) {
                if (!data) return;
                info.update(data);
                var path = data.backdrop_path ? Lampa.Api.img(data.backdrop_path, 'w1280') : '';
                if (path && path !== this.backgroundLast) {
                    background.classList.remove('loaded');
                    background.onload = () => background.classList.add('loaded');
                    background.src = path;
                    this.backgroundLast = path;
                }
            },
            destroy: function () {
                info.destroy();
                if (background.parentNode) background.parentNode.removeChild(background);
                this.attached = false;
            }
        };
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
            if (object.service_id === 'netflix') state = createInterfaceState(this);

            this.activity.loader(true);
            var network = new Lampa.Reguest();
            var status = new Lampa.Status(config.categories.length);

            status.onComplite = function () {
                var fulldata = [];
                Object.keys(status.data).sort((a, b) => a - b).forEach(key => {
                    var data = status.data[key];
                    if (data && data.results && data.results.length) {
                        Lampa.Utils.extendItemsParams(data.results, { style: { name: 'wide' } });
                        fulldata.push({ title: config.categories[key].title, results: data.results, url: config.categories[key].url, params: config.categories[key].params });
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

            // Функція для витягування card_data з DOM
            function getDomCardData(node) {
                if (!node) return null;
                var current = node.jquery ? node[0] : node;
                while (current && !current.card_data) {
                    current = current.parentNode;
                }
                return current && current.card_data ? current.card_data : null;
            }

            // Надійний обробник фокусу
            _this.focus_listener = function (e) {
                if (!state || !e.target) return;

                var $t = $(e.target);
                // пробуємо всі варіанти
                var card = $t.data('data')
                    || e.target.card_data
                    || $t.closest('.card').data('data')
                    || getDomCardData(e.target);

                if (card && (card.title || card.name)) {
                    state.update(card);
                }
            };
            Lampa.Listener.follow('focus', _this.focus_listener);

            // Фікс індексу в асинхронних запитах
            config.categories.forEach(function (cat, i) {
                var index = i;
                var url = Lampa.TMDB.api(cat.url + '?api_key=' + Lampa.TMDB.key() + '&language=uk');

                if (cat.params) {
                    for (var k in cat.params) {
                        url += '&' + k + '=' + cat.params[k].replace('{current_date}', new Date().toISOString().split('T')[0]);
                    }
                }

                network.silent(
                    url,
                    function (json) {
                        status.append(index.toString(), json);
                    }
                );
            });

            return this.render();
        };

        var baseDestroy = comp.destroy;
        comp.destroy = function () {
            if (this.focus_listener) Lampa.Listener.remove('focus', this.focus_listener);
            if (state) state.destroy();
            baseDestroy.call(this);
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
        Lampa.Component.add('studios_view', function (object) { return new Lampa.InteractionCategory(object); });

        $('body').append(`<style id="studios-master-styles">
            .lampa--netflix { background: #141414 !important; }
            .new-interface .full-start__background {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                object-fit: cover; opacity: 0; transition: opacity 1s; z-index: 0;
                mask-image: linear-gradient(to bottom, black 20%, transparent 95%);
                -webkit-mask-image: linear-gradient(to bottom, black 20%, transparent 95%);
            }
            .new-interface .full-start__background.loaded { opacity: 0.45; }
            .new-interface-info { position: relative; z-index: 2; padding: 40px 4%; height: 280px; pointer-events: none; }
            .new-interface-info__body { width: 50%; }
            .new-interface-info__title { font-size: 3.5em; font-weight: bold; margin-bottom: 10px; }
            .new-interface-info__description { 
                font-size: 1.1em; line-height: 1.4; opacity: 0.8; 
                display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; 
            }
            .lampa--netflix .card.focus { transform: scale(1.1); border: 3px solid #fff !important; z-index: 10; box-shadow: 0 0 20px rgba(229,9,20,0.5); }
            .lampa--netflix .interaction-main__row { position: relative; z-index: 5; margin-top: -30px; }
            .lampa--netflix .card__title { display: none; }
        </style>`);

        var addButtons = () => {
            var list = $('.menu__list').eq(0);
            if (!list.length) return;
            Object.keys(SERVICE_CONFIGS).forEach(sid => {
                if (list.find('[data-sid="' + sid + '"]').length) return;
                var item = $('<li class="menu__item selector" data-sid="' + sid + '"><div class="menu__ico">' + SERVICE_CONFIGS[sid].icon + '</div><div class="menu__text">' + SERVICE_CONFIGS[sid].title + '</div></li>');
                item.on('hover:enter', () => Lampa.Activity.push({ title: SERVICE_CONFIGS[sid].title, component: 'studios_main', service_id: sid }));
                list.append(item);
            });
        };
        if (window.appready) addButtons();
        else Lampa.Listener.follow('app', e => { if (e.type === 'ready') addButtons(); });
        setInterval(addButtons, 4000);
    }

    startPlugin();
})();