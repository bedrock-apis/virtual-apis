> All numbers and NBT format are in little endian
## General Header Format
| Type | Name |
|------|------|
| `byte[4]`  | Magic pattern 'vami'
| `uint16`    | Format Version 
| `uint32`    | Size of the body in bytes

## Body Format

| Type | Name |
|------|------|
| `NBTCompoud()`  | Metadata
| `container()`   | Representation of the module