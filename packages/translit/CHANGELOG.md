# Changelog

## 0.2.0

`transliterate` now takes an options object, and yers are read differently, so this is a breaking minor for 0.x.

### Features

- Options object for `transliterate`, and a `normalize` entry point (#96)
- Read Cyrillic and Latin yers by Havlik's law with `yers: 'havlik'` (#95)
- Write Glagolitic numerals as on the primer page, 1 to 999 999 (#101)

### Fixes

- Read Glagolitic yers by their neighbours, drop word-final yer and titlo (#92, #94)
- Read Glagolitic Izhe as `j`, not `i` (#90)
- Keep `ȯj` apart from `y` in Glagolitic output (#91)
- Convert punctuation when Glagolitic is the source or the target (#93)
- Read a soft sign between consonants as `ė` (#98), and a front yer as `ė` where the dictionary has no soft consonant (#104)
