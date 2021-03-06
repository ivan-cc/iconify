"use strict";

(function() {
    var isBrowser = (typeof module !== 'object' || !module.exports);

    var Storage = isBrowser ? Iconify.modules.Storage : require('../../src/common/storage');
    var SVG = isBrowser ? Iconify.modules.Storage : require('../../src/node/svg');

    var chai = isBrowser ? self.chai : require('chai'),
        expect = chai.expect,
        should = chai.should();

    describe('Testing generated SVG', function() {
        it('default dimensions', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16,
                inlineHeight: 24
            });
            svg = new SVG(storage.getIcon('test'));

            expect(svg.toString()).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.84em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 24"><path d="" /></svg>');
            expect(svg.toString({
                'data-inline': false
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1.25em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" data-inline="false"><path d="" /></svg>');
        });

        it('custom dimensions', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            svg = new SVG(storage.getIcon('test'));

            expect(svg.toString({
                width: '40px'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="40px" height="32px" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');

            // Custom scale
            expect(svg.toString({
                width: 30,
                height: 50
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="30" height="50" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');
        });

        it('without width or height', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            svg = new SVG(storage.getIcon('test'));

            // No width and no height
            expect(svg.toString({
                width: false,
                height: false
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');

            // No height
            expect(svg.toString({
                width: 40,
                height: false
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="40" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');

            // Invalid width value
            expect(svg.toString({
                width: 'none',
                height: 8
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="none" height="8" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><path d="" /></svg>');
        });

        it('title attribute', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            svg = new SVG(storage.getIcon('test'));

            expect(svg.toString({
                title: 'Icon Title'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><title>Icon Title</title><path d="" /></svg>');

            // Test escaping attribute
            expect(svg.toString({
                title: '<script>alert("hax!")</script>'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16"><title>&lt;script&gt;alert(&quot;hax!&quot;)&lt;/script&gt;</title><path d="" /></svg>');
        });

        it('custom attributes', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test', {
                body: '<path d="" />',
                width: 20,
                height: 16
            });
            svg = new SVG(storage.getIcon('test'));

            expect(svg.toString({
                id: 'test',
                style: 'margin:0; transform: scale(0.5);',
                'class': 'iconify test-class loading'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);margin:0; transform: scale(0.5);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" id="test" class="iconify test-class loading"><path d="" /></svg>');

            // Values that must be escaped
            expect(svg.toString({
                'data-foo': 'Test" quote',
                'data-<bar': 'Test >\''
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1.25em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 16" data-foo="Test&quot; quote" data-&lt;bar="Test &gt;&#039;"><path d="" /></svg>');
        });

        it('transformation', function() {
            var storage = new Storage(),
                svg;

            storage.addIcon('test-icon', {
                body: '<path d="" />',
                width: 20,
                height: 16,
                inlineHeight: 24,
                inlineTop: -4
            });
            storage.addIcon('test-alias1', {
                parent: 'test-icon',
                hFlip: true
            });
            storage.addIcon('test-alias2', {
                parent: 'test-alias1',
                vFlip: true,
                rotate: 1
            });

            // Icon without transformation
            svg = new SVG(storage.getIcon('test-icon'));
            expect(svg.toString()).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.84em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 -4 20 24"><path d="" /></svg>');

            // Horizontal flip from parent icon
            svg = new SVG(storage.getIcon('test-alias1'));
            expect(svg.toString()).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.84em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 24"><g transform="translate(20 4) scale(-1 1)"><path d="" /></g></svg>');

            // Horizontal flip from attributes
            svg = new SVG(storage.getIcon('test-icon'));
            expect(svg.toString({
                'data-flip': 'horizontal'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.84em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 20 24" data-flip="horizontal"><g transform="translate(20 4) scale(-1 1)"><path d="" /></g></svg>');

            // Double horizontal flip
            svg = new SVG(storage.getIcon('test-alias1'));
            expect(svg.toString({
                'data-flip': 'horizontal'
            })).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.84em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 -4 20 24" data-flip="horizontal"><path d="" /></svg>');

            // Many attributes from merging aliases
            svg = new SVG(storage.getIcon('test-alias2'));
            expect(svg.toString()).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1.2em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="-4 0 24 20"><g transform="rotate(-90 10 10)"><path d="" /></g></svg>');
        });

        it('unique ids', function() {
            var storage = new Storage(),
                body = '<g fill="none"><path d="M 10,50 v -20 h 40 v -20" stroke="red" style="marker: url(#diamond-red)"/><path d="M 30,70 v -20 h 40 v -20" stroke="green" style="marker: url(#diamond-green)"/><path d="M 50,90 v -20 h 40 v -20" stroke="blue" style="marker: url(#diamond-blue)"/><marker id="diamond-red" markerWidth="12" markerHeight="12" refX="6" refY="6" markerUnits="userSpaceOnUse"><circle cx="6" cy="6" r="4" fill="white" stroke="red" stroke-width="3"/></marker><marker id="diamond-green" markerWidth="12" markerHeight="12" refX="6" refY="6" markerUnits="userSpaceOnUse"><circle cx="6" cy="6" r="4" fill="white" stroke="green" stroke-width="3"/></marker><marker id="diamond-blue" markerWidth="12" markerHeight="12" refX="6" refY="6" markerUnits="userSpaceOnUse"><circle cx="6" cy="6" r="4" fill="white" stroke="blue" stroke-width="3"/></marker></g>',
                svg, result;

            storage.addIcon('test', {
                body: body,
                width: 100,
                height: 100
            });
            svg = new SVG(storage.getIcon('test'));

            result = svg.toString();

            // Check for ids
            expect(result.indexOf('IconifyId-')).to.not.be.equal(-1);
            expect(result.indexOf('url(#diamond')).to.be.equal(-1);

            // Remove random stuff
            result = result.replace(/IconifyId\-[a-f0-9]+\-[a-f0-9]+\-/g, 'IconifyId-');
            expect(result).to.be.equal('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100"><g fill="none"><path d="M 10,50 v -20 h 40 v -20" stroke="red" style="marker: url(#IconifyId-0)"/><path d="M 30,70 v -20 h 40 v -20" stroke="green" style="marker: url(#IconifyId-1)"/><path d="M 50,90 v -20 h 40 v -20" stroke="blue" style="marker: url(#IconifyId-2)"/><marker id="IconifyId-0" markerWidth="12" markerHeight="12" refX="6" refY="6" markerUnits="userSpaceOnUse"><circle cx="6" cy="6" r="4" fill="white" stroke="red" stroke-width="3"/></marker><marker id="IconifyId-1" markerWidth="12" markerHeight="12" refX="6" refY="6" markerUnits="userSpaceOnUse"><circle cx="6" cy="6" r="4" fill="white" stroke="green" stroke-width="3"/></marker><marker id="IconifyId-2" markerWidth="12" markerHeight="12" refX="6" refY="6" markerUnits="userSpaceOnUse"><circle cx="6" cy="6" r="4" fill="white" stroke="blue" stroke-width="3"/></marker></g></svg>');
        });

    });
})();
