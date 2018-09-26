var fs = require('fs')
var through = require('through');
var undef;

module.exports = function(file,opts){

  opts = opts||{};

  var s = through()
  , pos = 0
  , size = 0
  , block = opts.block||1024
  , doread = true
  , reading = false
  , shorterFirst = opts.shorterFirst || false

  var fileSizeInBytes = fs.statSync(file).size;

  fs.open(file,'r',function(err,fd){
    if(err) return s.emit('error',err);
    s.fd = fd;
    s.emit('open',fd);
    
    fs.fstat(fd,function(err,stat){
      if(err) return s.emit('error',err);
      s.pos = stat.size-1;
      
      s.emit('stat',stat);
      var sundef = false;
      if(opts.start === undef) {
        opts.start = 0;
        sundef = true;
      }

      if(opts.end === undef) opts.end = 0;

      if(opts.end > opts.start){
        var st = opts.start;
        opts.start = opts.end;
        opts.end = st;
      }

      if(opts.start > s.pos) {
        opts.start = s.pos;
      } else if(sundef) {
        opts.start = s.pos;
      }

      s.pos = opts.start+1;
      s.remaining = opts.start-opts.end+1;

      if(doread) s._readLoop();
    })
  })

  s.on('pause',function(){
    doread = false;
  }).on('drain',function(){
    doread = true;
    if(!reading) this._readLoop()
  }).on('end',function(){
    if(opts.close === undef || opts.close) {
      fs.close(this.fd,function(){
        s.emit('close');
      });
    }
  })

  s._readLoop = function (){
    if(s.pos === undef) return;
    var sizeFirstRead = block;
    if (opts.shorterFirst) {
      sizeFirstRead = fileSizeInBytes % block;
    }    
    (function fn(blockSize){

      if(s.remaining < blockSize) blockSize = s.remaining;

      var pos = s.pos-blockSize;

      read(s.fd,blockSize,pos,function(err,bytesRead,buf){

        s.pos -= bytesRead;
        s.remaining -= bytesRead;

        if(err) return;
        if(!s.remaining) return s.queue(null)
        if(doread) fn(block);
      })
    }(sizeFirstRead))
  }

  function read(fd,size,pos,cb){
    reading = true;
    fs.read(fd,Buffer.alloc?Buffer.alloc(size):new Buffer(size),0,size,pos,function(err,bytesRead,buf){
      reading = false;
      if(!err) s.queue(buf)
      process.nextTick(function(){
        cb(err,bytesRead,buf);
      });
    })
  }

  return s;
}
