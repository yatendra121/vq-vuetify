// Global polyfills for running Vuetify components under jsdom.
// jsdom does not implement these browser APIs that several Vuetify
// components (VProgressCircular, VList, VOverlay, useDisplay, ...) rely on.

class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

class IntersectionObserverStub {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
        return [];
    }
}

if (!("ResizeObserver" in globalThis)) {
    globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

if (!("IntersectionObserver" in globalThis)) {
    globalThis.IntersectionObserver =
        IntersectionObserverStub as unknown as typeof IntersectionObserver;
}

if (typeof window !== "undefined" && !window.matchMedia) {
    window.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
            return false;
        }
    })) as unknown as typeof window.matchMedia;
}

// VOverlay's location strategies (used by VDialog / VMenu / VTooltip) read
// window.visualViewport, which jsdom does not provide.
if (typeof window !== "undefined" && !("visualViewport" in window)) {
    (window as unknown as { visualViewport: unknown }).visualViewport = {
        width: 1024,
        height: 768,
        offsetLeft: 0,
        offsetTop: 0,
        pageLeft: 0,
        pageTop: 0,
        scale: 1,
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
            return false;
        }
    };
}
