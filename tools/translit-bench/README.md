# translit-bench

Measures transliteration throughput, and refuses to rank anything that is not
byte-identical to the shipped engine.

```bash
node run.mjs                    # all four runtimes
BENCH_RUNTIMES=node node run.mjs   # one, for iterating
```

## What it measures

Two workloads, because a win on one is not a win on the other. `prose` is
running text — short words, heavy repetition, the shape a caller actually
passes in, and the shape a cache flatters itself on. `lexicon` is 11 000
distinct dictionary forms with no repetition at all, where a cache can only
lose and the rules themselves are what is being timed.

Four targets, cheapest to dearest, so an optimisation cannot look good by
helping only the easy case: `isv-Latn` (2 passes), `isv-x-fonipa` (8),
`isv-Cyrl-x-iotated` (11), `isv-Latn-PL` (45).

Four runtimes from one bundle, handed to each unchanged, so a difference in
the table is the runtime and not the build. Node, Deno and headless Chrome are
all V8 — and not the same V8, which matters more than it sounds. Bun is
JavaScriptCore, the engine Safari ships, and it is what keeps a V8-only
optimisation honest.

## The correctness gate

Both corpora go through all twenty BCP 47 tags and are compared byte for byte
against the shipped engine. A candidate that differs anywhere is printed as
WRONG OUTPUT and is not ranked, however fast it is. A faster wrong answer is
worth nothing.

## `candidates/old-engine`

The engine as it shipped before the table rewrite, kept as the number to beat.
It fails the gate on the five Glagolitic tags and only those, because
Glagolitic now goes through a different converter by choice — see
[`GLAGOLITIC-DIFF.md`](../../packages/translit/src/transliterate/GLAGOLITIC-DIFF.md). That it still matches
on the other fifteen is what says the wrapper around it is honest.

Measured across all four runtimes, the current engine is slower than it by:

| target             | passes | prose | lexicon |
| ------------------ | -----: | ----: | ------: |
| isv-Latn           |      2 |  1.6x |    2.7x |
| isv-x-fonipa       |      8 |  2.5x |    3.8x |
| isv-Cyrl-x-iotated |     11 |  2.5x |    3.5x |
| isv-Latn-PL        |     45 |  5.2x |    7.8x |

The cost tracks the number of sequential passes, not the table idea. Each pass
is a fresh scan of the whole word, and `createReplacer` scans character by
character in JavaScript where the old engine handed the work to a native
regex. Anything that fuses passes, or compiles a table into one regex, is
aiming at the right thing; anything that caches results is aiming at the
workload instead.

## A note on measuring

Absolute rates can vary depending on system load — avoid comparing numbers
taken at different times or across different machines. The relative ratios
measured within the same run are what the tool is designed to provide.
