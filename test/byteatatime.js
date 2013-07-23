var backwards = require('../')
var test = require('tape')

test("can get a range 1 byte at a time",function(t){
  var s = backwards(__dirname+'/smallfile.txt',{block:1,start:2,end:1})

  var out = '';

  s.on('data',function(d){
    out += d.toString();
  })

  s.on('end',function(){
    t.equals(out,'21','should read only specified range')
    t.end()
  })

});


test("can get a range 2 bytes at a time",function(t){
  var s = backwards(__dirname+'/smallfile.txt',{block:2,start:5,end:1})

  var out = '';

  s.on('data',function(d){
    out += d.toString();
  })

  s.on('end',function(){
    // this doesnt reverse bytes. im reading 2 bytes at a time from the end.
    t.equals(out,'45231','should read only specified range');
    t.end();
  })

});

