#ifndef FINTECH_LIBRARY_H
#define FINTECH_LIBRARY_H

#ifdef MYLIBRARY_EXPORTS
#define MYLIBRARY_API __declspec(dllexport)
#else
#define MYLIBRARY_API __declspec(dllimport)
#endif

extern "C" MYLIBRARY_API int Add(int a, int b);
extern "C" MYLIBRARY_API const char* GetMessage();

#endif // FINTECH_LIBRARY_H
