# Changelog

## 0.2.0

The API is unchanged, but normalization and distances are not: the same word pairs score differently, so this is a breaking minor for 0.x.

### Features

- Keep ISV `å` and `ę` as their own graphemes, cheap to both regional reflexes (`kråva` ~ `krava`/`krowa`, `męso` ~ `meso`/`maso`)
- Strip dictionary stress and tone marks for ru, be, uk, bg, mk, sr, hr and sl (`бо́гом→bogom`, `rȉjeka→rěka`); replaces the Slovene-only accent step
- Fold East Slavic pleophony for ru and uk (`город→gråd`, `берег→brěg`)
- Fold ru and uk adjective endings (`бедный→bedny`, `бідний→bidny`)
- Read Polish `ie` after labials, velars and `l` as `e` (`bieda→beda`)
- Port from the earlier standalone copy: ru hushers with soft sign or glide (`ночь→noč`, `шёпот→šopot`), Belarusian apostrophe and `ў`, Croatian jat with a stop-list and short jat (`mjesto→město`), and the `i↔j` weight pair

## 0.1.0

First release.
