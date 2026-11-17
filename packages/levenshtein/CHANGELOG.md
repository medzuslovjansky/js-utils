# Changelog

## 0.1.1

Same API. Normalization changed, so distances for the same word pairs differ from 0.1.0.

- ISV `å` and `ę` stay as their own graphemes, cheap to both regional reflexes (`kråva` ~ `krava`/`krowa`, `męso` ~ `meso`/`maso`)
- Stress and tone marks are stripped for ru, be, uk, bg, mk, sr, hr and sl (`бо́гом→bogom`, `rȉjeka→rěka`); this replaces the Slovene-only accent step
- East Slavic pleophony folds for ru and uk (`город→gråd`, `берег→brěg`)
- ru and uk adjective endings fold (`бедный→bedny`, `бідний→bidny`)
- Polish `ie` after labials, velars and `l` reads as `e` (`bieda→beda`)
- ru hushers drop a soft sign or glide (`ночь→noč`, `шёпот→šopot`)
- Belarusian apostrophe and `ў` are handled (`сям'я→sjamja`)
- Croatian jat: stop-list for non-jat `ije` (`nije`), short jat (`mjesto→město`)
- New weight pair `i↔j`

## 0.1.0

First release.
