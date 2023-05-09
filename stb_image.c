#define STB_IMAGE_IMPLEMENTATION
#define STBI_NO_STDIO
#define STBI_NO_LINEAR
#define STBI_NO_HDR
#define STBI_ASSERT(...)

//stdlib.h
typedef unsigned long size_t;
void free(void *);
void *malloc(size_t);
void *realloc(void *, size_t);
// string.h
void *memset(void *, int, size_t);
void *memcpy(void *, const void *, size_t);
int strcmp(const char *, const char *);
int strncmp(const char *, const char *, size_t);
long strtol(const char *, char **, int);

#define abs(x)  ({ typeof(x) _x = (x); _x >= 0 ? _x : (-_x); })

#include "stb_image.h"
