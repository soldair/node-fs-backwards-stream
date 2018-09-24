

fs-backwards-stream
===================

exact same api as fs.createReadStream except reads chunks backwards. similar to fs-reverse except doesnt parse lines.

Stream data from start to end. if start is less than end they are switched rather then just not being useful.


```js
var backwardsStream = require('fs-backwards-stream')

var s = backwardsStream(filename)

s.on('data',function(buf){
  console.log(buf.toString());
})

```

```txt
[1 2 3 4 5 6 7 8 9 10 11 12 13 14]
start of file  <---- end of file
```

options
-------

- start
  - where to start reading. defaults to the end of the file

- end
  - where to stop reading. defaults to 0. ie i start from 1000 and stop at 10

- block
  - number of bytes to read at a time (default: 1024 bytes)

- shorterFirst
  - if the filesize is not a multiple of the blocksize, make the first block read (from the nd of the file) shorter, instead of the last (in the beginning of the file) (default: false)