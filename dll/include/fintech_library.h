#ifndef FINTECH_LIBRARY_H
#define FINTECH_LIBRARY_H

#ifdef MYLIBRARY_EXPORTS
#define MYLIBRARY_API __declspec(dllexport)
#else
#define MYLIBRARY_API __declspec(dllimport)
#endif

extern "C" MYLIBRARY_API double PriceEuropeanCallOption();

#endif // FINTECH_LIBRARY_H
