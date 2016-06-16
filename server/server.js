var app = require('express')();
var config = require('./config');
var fs = require('fs');


function sub(data, start, finish){
	var d = [];
	finish = start + finish;
	for(var i = start; i < data.length; i += 128){
		if(finish > data.length){
			break;
		}
		d.push(data[i]);
	}

	return d;
}

app.get('/read',function(req,res){
	var rs = fs.createReadStream('server/20160316.lbd');
	var data = [];
	rs.on('data',function(chunk){
		//console.log(chunk);
		for(var i = 0; i < chunk.length / 128; i++) {
			//console.log(chunk[i * 128]);
			//var temp =  [];
			var temp = sub(chunk, i, 128).toString();
			console.log(temp);
			data.push(temp);
		}
	});
	res.send(data);
});

app.listen(config.server.port,function(){
	console.log('server started on port: ', config.server.port);
});
