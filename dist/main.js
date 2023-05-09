async function loadImageBytes(url) {
    const response = await fetch(url);
    return await response.arrayBuffer();
}

function drawPixels(pixels, x) {
    const canvas = document.getElementById("canv");
    const ctx = canvas.getContext("2d");
    ctx.putImageData(new ImageData(pixels, x), 0, 0);
}

window.onload = async () => {
    const allocations = {};
    let heapPtr, memory;
    const w = await WebAssembly.instantiateStreaming(fetch("stb_image.wasm"), {
        env: {
            "malloc": (s) => {
                const result = heapPtr;
                heapPtr += s;
                allocations[result] = s;
                return result;
            },
            "free": (p) => {},
            "memset": (s, c, n) => {
                new Uint8Array(memory, s, n).fill(c);
                return s;
            },
            "realloc": (oldp, news) => {
                const olds = allocations[oldp];
                if (olds >= news) {
                    allocations[oldp] = news;
                    return oldp;
                }
                const newp = heapPtr;
                heapPtr += news;
                allocations[newp] = news;
                new Uint8Array(memory, newp, news).set(new Uint8Array(oldp, news));
                return newp;
            },
            "memcpy": (dest, src, n) => {
                new Uint8Array(memory, dest, n).set(new Uint8Array(memory, src, n));
                return dest;
            }
        },
    });
    const heapBase = w.instance.exports.__heap_base.value;
    heapPtr = heapBase;
    memory = w.instance.exports.memory.buffer;
    const buffer = await loadImageBytes("test-image.png");
    const imgBuf = heapPtr;
    const imgLen = buffer.byteLength;
    new Uint8Array(memory, imgBuf, imgLen).set(new Uint8Array(buffer));
    heapPtr += imgLen;
    const pX = heapPtr; heapPtr += 4;
    const pY = heapPtr; heapPtr += 4;
    const ppixels = w.instance.exports.stbi_load_from_memory(imgBuf, imgLen, pX, pY, 0, 4);
    const x = new Uint32Array(new Uint8Array(memory, pX, 4))[0];
    const y = new Uint32Array(new Uint8Array(memory, pY, 4))[0];
    const pixels = new Uint8ClampedArray(memory, ppixels).slice(0, x * y * 4);
    drawPixels(pixels, x);
};
