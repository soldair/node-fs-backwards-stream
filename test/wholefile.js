var backwards = require('../')
var test = require('tape')

test('whole file',function(t){
  var s = backwards(__dirname+'/file.txt')
  var data = '';
  s.on('data',function(buf){
    data += buf.toString()
  });

  s.on('end',function(){
    t.equals(data.length,1089,'should have read whole file')
    t.end();
  });

});
