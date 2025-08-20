# @mrpelz/misc-utils

Miscellaneous TypeScript helpers.

## `data`

Miscellaneous data conversion helpers.

### `emptyBuffer`

Empty/zero-length Buffer.

### `falseBuffer`

One-byte `0` Buffer.

### `trueBuffer`

One-byte `1` Buffer.

### arrayCompare

```ts
const arrayCompare = <
  A extends Array<unknown>,
  B extends Array<unknown>,
>(
  a: A,
  b: B,
): b is B
```

Returns `true` if all elements of array `a` strict-equal array `b`.

### arrayPadLeft

```ts
const arrayPadLeft = <T>(
  input: T[],
  length: number,
  value: T = null as unknown as T,
): T[]
```

Inserts `length`-n of `value` at the start of array `input`.  
Modifies array in-place and returns it.

### arrayPadRight

```ts
const arrayPadRight = <T>(
  input: T[],
  length: number,
  value: T = null as unknown as T,
): T[]
```

Inserts `length`-n of `value` at the end of array `input`.  
Modifies array in-place and returns it.

### bufferChunks

```ts
const bufferChunks = (input: Buffer, chunkSize = 1): Buffer[]
```

Splits Buffer `input` into chunks of size `chunkSize` each.  
Returns array of Buffer chunks. Throws if `input` Buffer is smaller than `chunkSize`.

### concatBytes

```ts
const concatBytes = (input: number[]): Buffer
```

Concatenates number-array as bytes and returns as Buffer.

### humanPayload

```ts
const humanPayload = (input: Buffer): string
```

Pretty-prints Buffer `input`’s binary contents in a human readable format, represented as binary, decimal and hexadecimal:

```txt
0b00000000 | 0b00000001 | 0b00000010 | 0b00001111 | 0b00010000
         0 |          1 |          2 |         15 |         16
      0x00 |       0x01 |       0x02 |       0x0f |       0x10
```

Returns pre-formatted multi-line string.

### jsonParseGuarded

```ts
const jsonParseGuarded = <T>(input: unknown): T | Error
```

Guarded JSON-parse. Tries to parse _anything_ in `input`, returns `JSON.parse` result. Returns Error if input is not a string. If parsing of the string fails, catches the Error and returns it. Error is returned instead of thrown to ease implementation of fallback code paths.

### numberToDigits

```ts
const numberToDigits = (
  input: number,
  pad = 0,
  radix = 10,
): number[]
```

Splits number in `input` into single digits and returns them as number-array. Throws if input is not an integer.

### readNumber

```ts
const readNumber = (input: Buffer, bytes = 1): number
```

Read number value from Buffer `input` with number of `bytes`. Throws if the buffer isn’t long enough to fit the desired byte count.

* `bytes` = 1 → UInt8
* `bytes` = 2 → UInt16LE
* `bytes` = 4 → UInt32LE

Throws otherwise.

### booleanToBuffer

```ts
const booleanToBuffer = (input: boolean): Buffer
```

Turns boolean `input` into `trueBuffer` or `falseBuffer` respectively.

### bufferToBoolean

```ts
const bufferToBoolean = (input: Buffer): boolean
```

Turns Buffer `input` into boolean. A buffer whose first byte is zero is considered false, everything else is considered true. Throws if Buffer isn’t long enough.

### swapByte

```ts
const swapByte = (input: number): number
```

Bitwise-invert the the `input` value. Use for single byte values.

### writeNumber

```ts
const writeNumber = (input: number, bytes = 1): Buffer
```

Write number value from `input` with number of `bytes` into Buffer. Throws if the number cannot be represented using the desired byte count.

* `bytes` = 1 → UInt8
* `bytes` = 2 → UInt16LE
* `bytes` = 4 → UInt32LE

Throws otherwise.

## number

### bitRange

```ts
const bitRange = (count: number): number
```

Returns the number bit range of given bit length in `count`, e.g.

* 4 → 15
* 8 → 255
* 16 → 65535

### byteRange

```ts
const byteRange = (count: number): number
```

Returns the number range of given byte length in `count`, e.g. 4 → 4294967295.
