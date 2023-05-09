async function loadImageBytes(url) {
    const response = await fetch(url);
    return await response.arrayBuffer();
}

window.onload = async () => {
    const wasm = await WebAssembly.instantiateStreaming(fetch("stb_image.wasm"), {
        env: {}
    });
    const buffer = await loadImageBytes("test-image.png");
    console.log(buffer);
};
