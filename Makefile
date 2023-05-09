CC=clang
WASM_BIN=dist/stb_image.wasm

.PHONY = clean wasm

all: wasm

wasm: stb_image.c
	$(CC) --target=wasm32 --no-standard-libraries -Wl,--no-entry -Wl,--allow-undefined -Wl,--export=stbi_load_from_memory -Wl,--export=__heap_base -o $(WASM_BIN) stb_image.c

clean:
	rm $(WASM_BIN)
