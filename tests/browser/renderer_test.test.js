(function() {
    "use strict";

    var expect = chai.expect,
        should = chai.should();

    function load(Iconify, local, global) {
        /* Modules() */
    }

    describe('Testing renderer', function() {
        it('rendering svg images', function(done) {
            var Iconify = {
                    isReady: false
                },
                local = {
                    config: {}
                },
                global = {
                    IconifyConfig: {
                        _readyEvent: 'RendererTestReadyEvent1'
                    }
                },
                containerID = 'renderer-svg',
                containerRoot,
                pending = 0;

            function init() {
                // Add dummy code
                jQuery('#debug2').append('<div id="' + containerID + '">' +
                    '<i class="iconify" data-icon="fa-home" />' +
                    '<iconify-icon data-icon="fa-arrow-left" data-flip="horizontal" height="20px" />' +
                    // Append icon as child
                    '<i class="iconify" data-icon="fa:android" data-rotate="90deg" data-icon-append="true" height="24px" />' +
                    // Test class names instead of attributes (class overrides attribute!)
                    '<span class="iconify icon:fa-arrow-top icon-flip:vertical icon-rotate:90deg" data-rotate="180deg" />' +
                    '<iconify-icon class="icon:fa-arrow-top icon-flip:vertical icon-rotate:90deg" data-flip="horizontal" />' +
                    '</div>');

                containerRoot = document.getElementById(containerID);

                // Setup fake Iconify instance
                local.scanDOM = renderImages;
                load(Iconify, local, global);
                if (local.config.defaultAPI.indexOf('{callback}') === -1) {
                    local.config.defaultAPI += (local.config.defaultAPI.indexOf('?') === -1 ? '?' : '&') + 'callback=window.SSVGRenderTest';
                } else {
                    local.config.defaultAPI = local.config.defaultAPI.replace('{callback}', 'window.SSVGRenderTest');
                }
                window.SSVGRenderTest = Iconify._loaderCallback;

                Iconify.ready(function() {
                    // Load images, start tests when images are available
                    local.findNewImages(containerRoot).forEach(function(image) {
                        if (!local.loadImage(image)) {
                            pending ++;
                        } else {
                            local.renderSVG(image);
                        }
                    });
                    if (!pending) {
                        test();
                    }
                });
            }

            // Callback to load pending images
            function renderImages() {
                local.findNewImages(containerRoot).forEach(function(image) {
                    local.renderSVG(image);
                });
                test();
            }

            // Do test
            function test() {
                var image1 = containerRoot.childNodes[0],
                    image2 = containerRoot.childNodes[1],
                    image3 = containerRoot.childNodes[2],
                    image4 = containerRoot.childNodes[3],
                    image5 = containerRoot.childNodes[4],
                    svg3;

                expect(image1.tagName.toLowerCase()).to.be.equal('svg', 'First node supposed to be SVG');
                expect(image2.tagName.toLowerCase()).to.be.equal('svg', 'Second node supposed to be SVG');
                expect(image3.tagName.toLowerCase()).to.be.equal('i', 'Third node supposed to be I');
                expect(image3.childNodes.length).to.be.equal(1, 'Third node must have child node');
                expect(image4.tagName.toLowerCase()).to.be.equal('svg', 'Fourth node supposed to be SVG');
                expect(image5.tagName.toLowerCase()).to.be.equal('svg', 'Fifth node supposed to be SVG');

                expect(image1.getAttribute('class')).to.be.equal('iconify', 'Class name should be iconify');
                expect(image1.getAttribute('data-icon')).to.be.equal('fa-home', 'data-icon attribute is missing or invalid');
                expect(image1.getAttribute('style').indexOf('rotate(360deg)')).to.not.be.equal(-1, 'Style should contain 360deg rotation');
                expect(image1.hasAttribute('xmlns')).to.be.equal(true, 'xmlns is missing');

                expect(image2 === void 0).to.be.equal(false, 'image2 is undefined');
                expect(image2.getAttribute('style').indexOf('rotate(360deg)')).to.not.be.equal(-1, 'Style should contain 360deg rotation');
                if (image2.innerHTML !== void 0) {
                    // Skip tests on IE
                    expect(image2.innerHTML.indexOf('<g ')).to.be.equal(0, 'Content should start with group');
                    expect(image2.innerHTML.indexOf('transform="translate') !== -1).to.be.equal(true, 'Content should include transformation');
                    expect(image2.innerHTML.indexOf('scale(-1 1)')).to.not.be.equal(-1, 'Content should contain scale');
                }

                svg3 = image3.childNodes[0];
                expect(svg3.tagName.toLowerCase()).to.be.equal('svg', 'Third node child node supposed to be SVG');
                expect(svg3.getAttribute('style').indexOf('rotate(360deg)')).to.not.be.equal(-1, 'Style should contain 360deg rotation');

                expect(image4 === void 0).to.be.equal(false, 'image4 is undefined');
                expect(image4.getAttribute('style').indexOf('rotate(360deg)')).to.not.be.equal(-1, 'Style should contain 360deg rotation');
                if (image4.innerHTML !== void 0) {
                    // Skip tests on IE
                    expect(image4.innerHTML.indexOf('<g ')).to.be.equal(0, 'Content should start with group');
                    expect(image4.innerHTML.indexOf('transform="') !== -1).to.be.equal(true, 'Content should include transformation');
                    expect(image4.innerHTML.indexOf('rotate(90 ') !== -1).to.be.equal(true, 'Content should include 90deg rotation');
                    expect(image4.innerHTML.indexOf('translate') !== -1).to.be.equal(true, 'Content should include translate');
                    expect(image4.innerHTML.indexOf('scale(1 -1)')).to.not.be.equal(-1, 'Content should contain scale');
                }

                expect(image5 === void 0).to.be.equal(false, 'image5 is undefined');
                expect(image5.getAttribute('style').indexOf('rotate(360deg)')).to.not.be.equal(-1, 'Style should contain 360deg rotation');
                if (image5.innerHTML !== void 0) {
                    // Skip tests on IE
                    expect(image5.innerHTML).to.be.equal(image4.innerHTML, 'Fourth and fifth image should have same content');
                }

                done();
            }

            init();
        });

        it('rendering with custom finder', function(done) {
            var Iconify = {
                    isReady: false
                },
                local = {
                    config: {}
                },
                global = {
                    IconifyConfig: {
                        _readyEvent: 'RendererTestReadyEvent2'
                    }
                },
                containerID = 'renderer-svg2',
                containerRoot,
                pending = 0;

            function init() {
                // Add dummy code
                jQuery('#debug2').append('<div id="' + containerID + '">' +
                    '<i class="svg-test1 fa-home" />' +
                    '<i class="svg-test2 fa-arrow-left" />' +
                    '<i class="svg-test2 fa-shield" data-inline="true" />' +
                    '</div>');

                containerRoot = document.getElementById(containerID);

                // Setup fake Iconify instance
                local.scanDOM = renderImages;
                load(Iconify, local, global);
                if (local.config.defaultAPI.indexOf('{callback}') === -1) {
                    local.config.defaultAPI += (local.config.defaultAPI.indexOf('?') === -1 ? '?' : '&') + 'callback=window.SSVGRenderTestCustom';
                } else {
                    local.config.defaultAPI = local.config.defaultAPI.replace('{callback}', 'window.SSVGRenderTestCustom');
                }
                window.SSVGRenderTestCustom = Iconify._loaderCallback;

                // Add finders
                Iconify.addFinder('svg-test1', {
                    selector: '.svg-test1',
                    icon: function(element) {
                        var item;

                        for (var i = 0; i < element.classList.length; i++) {
                            item = element.classList[i];
                            if (item.slice(0, 3) === 'fa-') {
                                return item;
                            }
                        }

                        return '';
                    }
                });
                Iconify.addFinder('svg-test2', {
                    selector: '.svg-test2',
                    icon: function(element) {
                        var item;

                        for (var i = 0; i < element.classList.length; i++) {
                            item = element.classList[i];
                            if (item.slice(0, 3) === 'fa-') {
                                return item;
                            }
                        }

                        return '';
                    },
                    filterAttributes: function(image, attributes) {
                        if (attributes['data-inline'] === void 0) {
                            attributes['data-inline'] = false;
                        }
                        return attributes;
                    }
                });

                Iconify.ready(function() {
                    // Load images, start tests when images are available
                    local.findNewImages(containerRoot).forEach(function(image) {
                        if (!local.loadImage(image)) {
                            pending ++;
                        } else {
                            local.renderSVG(image);
                        }
                    });
                    if (!pending) {
                        test();
                    }
                });
            }

            // Callback to load pending images
            function renderImages() {
                local.findNewImages(containerRoot).forEach(function(image) {
                    local.renderSVG(image);
                });
                test();
            }

            // Do test
            function test() {
                var image1 = containerRoot.childNodes[0],
                    image2 = containerRoot.childNodes[1],
                    image3 = containerRoot.childNodes[2];

                expect(image1.tagName.toLowerCase()).to.be.equal('svg', 'First node supposed to be SVG');
                expect(image2.tagName.toLowerCase()).to.be.equal('svg', 'Second node supposed to be SVG');
                expect(image3.tagName.toLowerCase()).to.be.equal('svg', 'Third node supposed to be SVG');

                // Check for correct icons
                expect(image1.getAttribute('data-icon')).to.be.equal('fa-home', 'data-icon attribute is missing or invalid in first image');
                expect(image2.getAttribute('data-icon')).to.be.equal('fa-arrow-left', 'data-icon attribute is missing or invalid in second image');
                expect(image3.getAttribute('data-icon')).to.be.equal('fa-shield', 'data-icon attribute is missing or invalid in third image');

                // Check for correct inline status
                expect(image1.getAttribute('style').indexOf('vertical-align')).to.not.be.equal(-1, 'Style for first icon should contain vertical-align');
                expect(image2.getAttribute('style').indexOf('vertical-align')).to.be.equal(-1, 'Style for second icon should not contain vertical-align');
                expect(image3.getAttribute('style').indexOf('vertical-align')).to.not.be.equal(-1, 'Style for third icon should contain vertical-align');

                done();
            }

            init();
        });

        it('rendering with custom tags', function(done) {
            var Iconify = {
                    isReady: false
                },
                local = {
                    config: {}
                },
                global = {
                    IconifyConfig: {
                        _readyEvent: 'RendererTestReadyEvent3'
                    }
                },
                containerID = 'renderer-svg3',
                containerRoot,
                pending = 0;

            function init() {
                // Add dummy code
                jQuery('#debug2').append('<div id="' + containerID + '">' +
                        '<inline-icon data-icon="fa-home" />' +
                        '<block-icon data-icon="fa-arrow-left" />' +
                        '<fa-icon data-icon="chevron-up" />' +
                    '</div>');

                containerRoot = document.getElementById(containerID);

                // Setup fake Iconify instance
                local.scanDOM = renderImages;
                load(Iconify, local, global);
                if (local.config.defaultAPI.indexOf('{callback}') === -1) {
                    local.config.defaultAPI += (local.config.defaultAPI.indexOf('?') === -1 ? '?' : '&') + 'callback=window.SSVGRenderTestCustom';
                } else {
                    local.config.defaultAPI = local.config.defaultAPI.replace('{callback}', 'window.SSVGRenderTestCustom');
                }
                window.SSVGRenderTestCustom = Iconify._loaderCallback;

                // Add basic custom tags
                Iconify.addTag('inline-icon', true);
                Iconify.addTag('block-icon', false);

                Iconify.addTag('fa-icon', false, function(element) {
                    var result = element.getAttribute(Iconify.getConfig('iconAttribute'));
                    return typeof result === 'string' ? 'fa:' + result : '';
                });

                Iconify.ready(function() {
                    // Load images, start tests when images are available
                    local.findNewImages(containerRoot).forEach(function(image) {
                        if (!local.loadImage(image)) {
                            pending ++;
                        } else {
                            local.renderSVG(image);
                        }
                    });
                    if (!pending) {
                        test();
                    }
                });
            }

            // Callback to load pending images
            function renderImages() {
                local.findNewImages(containerRoot).forEach(function(image) {
                    local.renderSVG(image);
                });
                test();
            }

            // Do test
            function test() {
                var image1 = containerRoot.childNodes[0],
                    image2 = containerRoot.childNodes[1],
                    image3 = containerRoot.childNodes[2];

                expect(image1.tagName.toLowerCase()).to.be.equal('svg', 'First node supposed to be SVG');
                expect(image2.tagName.toLowerCase()).to.be.equal('svg', 'Second node supposed to be SVG');
                expect(image3.tagName.toLowerCase()).to.be.equal('svg', 'Third node supposed to be SVG');

                // Check for correct icons
                expect(image1.getAttribute('data-icon')).to.be.equal('fa-home', 'data-icon attribute is missing or invalid in first image');
                expect(image2.getAttribute('data-icon')).to.be.equal('fa-arrow-left', 'data-icon attribute is missing or invalid in second image');
                expect(image3.getAttribute('data-icon')).to.be.equal('fa:chevron-up', 'data-icon attribute is missing or invalid in third image');

                // Check for correct inline status
                expect(image1.getAttribute('style').indexOf('vertical-align')).to.not.be.equal(-1, 'Style for first icon should contain vertical-align');
                expect(image2.getAttribute('style').indexOf('vertical-align')).to.be.equal(-1, 'Style for second icon should not contain vertical-align');
                expect(image3.getAttribute('style').indexOf('vertical-align')).to.be.equal(-1, 'Style for third icon should not contain vertical-align');

                done();
            }

            init();
        });

        it('testing title attribute', function(done) {
            var Iconify = {
                    isReady: false
                },
                local = {
                    config: {}
                },
                global = {
                    IconifyConfig: {
                        _readyEvent: 'RendererTestReadyEvent4'
                    }
                },
                containerID = 'renderer-svg4',
                containerRoot,
                pending = 0;

            function init() {
                // Add dummy code
                jQuery('#debug2').append('<div id="' + containerID + '">' +
                    '<i class="iconify" data-icon="fa-home" title="Home Icon" />' +
                    '<i class="iconify" data-icon="fa-arrow-left" title="&lt;script&gt;" />' +
                    '</div>');

                containerRoot = document.getElementById(containerID);

                // Setup fake Iconify instance
                local.scanDOM = renderImages;
                load(Iconify, local, global);
                if (local.config.defaultAPI.indexOf('{callback}') === -1) {
                    local.config.defaultAPI += (local.config.defaultAPI.indexOf('?') === -1 ? '?' : '&') + 'callback=window.SSVGRenderTestTitle';
                } else {
                    local.config.defaultAPI = local.config.defaultAPI.replace('{callback}', 'window.SSVGRenderTestTitle');
                }
                window.SSVGRenderTestTitle = Iconify._loaderCallback;

                Iconify.ready(function() {
                    // Load images, start tests when images are available
                    local.findNewImages(containerRoot).forEach(function(image) {
                        if (!local.loadImage(image)) {
                            pending ++;
                        } else {
                            local.renderSVG(image);
                        }
                    });
                    if (!pending) {
                        test();
                    }
                });
            }

            // Callback to load pending images
            function renderImages() {
                local.findNewImages(containerRoot).forEach(function(image) {
                    local.renderSVG(image);
                });
                test();
            }

            // Do test
            function test() {
                var image1 = containerRoot.childNodes[0],
                    image2 = containerRoot.childNodes[1];

                expect(image1.tagName.toLowerCase()).to.be.equal('svg', 'First node supposed to be SVG');
                expect(image1.hasAttribute('title')).to.be.equal(false, 'Title attribute should not be set');
                if (image1.innerHTML !== void 0) {
                    // Skip tests on IE
                    expect(image1.innerHTML.indexOf('<title>Home Icon</title>') !== -1).to.be.equal(true, 'Content should include title');
                }

                expect(image2.tagName.toLowerCase()).to.be.equal('svg', 'Second node supposed to be SVG');
                expect(image2.hasAttribute('title')).to.be.equal(false, 'Title attribute should not be set');
                if (image2.innerHTML !== void 0) {
                    // Skip tests on IE
                    expect(image2.innerHTML.indexOf('<title>&lt;script&gt;</title>') !== -1).to.be.equal(true, 'Content should include title and title should be escaped');
                }

                done();
            }

            init();
        });

        it('testing getSVGObject and getSVG', function(done) {
            var Iconify = {
                    isReady: false
                },
                local = {
                    config: {}
                },
                global = {
                    IconifyConfig: {
                        _readyEvent: 'RendererTestReadyEvent5'
                    }
                },
                pending = 0;

            function init() {
                // Setup fake Iconify instance
                local.scanDOM = function() {};
                load(Iconify, local, global);
                if (local.config.defaultAPI.indexOf('{callback}') === -1) {
                    local.config.defaultAPI += (local.config.defaultAPI.indexOf('?') === -1 ? '?' : '&') + 'callback=window.SSVGRenderTestGetIcon';
                } else {
                    local.config.defaultAPI = local.config.defaultAPI.replace('{callback}', 'window.SSVGRenderTestGetIcon');
                }
                window.SSVGRenderTestGetIcon = function(data) {
                    Iconify._loaderCallback(data);

                    if (!Iconify.iconExists('fa-home')) {
                        return;
                    }

                    test();
                };

                Iconify.preloadImages(['fa-home']);
            }

            // Do test
            function test() {
                var defaultAttributes = {
                    xmlns: 'http://www.w3.org/2000/svg',
                    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                    'aria-hidden': 'true',
                    focusable: 'false',
                    width: '1em',
                    height: '1em',
                    style: 'vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);',
                    preserveAspectRatio: 'xMidYMid meet'
                };

                // Check fa-home without changes
                expect(Iconify.getSVGObject('fa-home')).to.be.eql({
                    append: false,
                    elementAttributes: {},
                    attributes: Object.assign({}, defaultAttributes, {
                        width: '0.93em',
                        height: '1em',
                        style: 'vertical-align: -0.143em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);',
                        viewBox: '0 -224 1664 1792'
                    }),
                    body: '<path d="M1408 768v480q0 26-19 45t-45 19H960V928H704v384H320q-26 0-45-19t-19-45V768q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69l-62 74q-8 9-21 11h-3q-13 0-21-7L832 200 140 777q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5T37 654L756 55q32-26 76-26t76 26l244 204V64q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z" fill="currentColor"/>'
                });
                expect(Iconify.getSVG('fa-home')).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.93em" height="1em" style="vertical-align: -0.143em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 -224 1664 1792"><path d="M1408 768v480q0 26-19 45t-45 19H960V928H704v384H320q-26 0-45-19t-19-45V768q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69l-62 74q-8 9-21 11h-3q-13 0-21-7L832 200 140 777q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5T37 654L756 55q32-26 76-26t76 26l244 204V64q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z" fill="currentColor"/></svg>');

                // Append, rotate and set custom size to fa-home
                expect(Iconify.getSVGObject('fa-home', {
                    'data-icon-append': true,
                    'data-rotate': '90deg',
                    'data-height': '256px'
                })).to.be.eql({
                    append: true,
                    elementAttributes: {
                        'data-icon-append': true,
                        'data-rotate': '90deg',
                        'data-height': '256px'
                    },
                    attributes: Object.assign({}, defaultAttributes, {
                        width: '275.7px',
                        height: '256px',
                        style: 'vertical-align: -0.143em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);',
                        viewBox: '-224 0 1792 1664'
                    }),
                    body: '<g transform="rotate(90 672 672)"><path d="M1408 768v480q0 26-19 45t-45 19H960V928H704v384H320q-26 0-45-19t-19-45V768q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69l-62 74q-8 9-21 11h-3q-13 0-21-7L832 200 140 777q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5T37 654L756 55q32-26 76-26t76 26l244 204V64q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z" fill="currentColor"/></g>'
                });
                expect(Iconify.getSVG('fa-home', {
                    'data-icon-append': true,
                    'data-rotate': '90deg',
                    'data-height': '256px'
                })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="275.7px" height="256px" style="vertical-align: -0.143em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="-224 0 1792 1664"><g transform="rotate(90 672 672)"><path d="M1408 768v480q0 26-19 45t-45 19H960V928H704v384H320q-26 0-45-19t-19-45V768q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69l-62 74q-8 9-21 11h-3q-13 0-21-7L832 200 140 777q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5T37 654L756 55q32-26 76-26t76 26l244 204V64q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z" fill="currentColor"/></g></svg>');

                done();
            }

            init();
        });
    });
})();
