function tF() {
  post('speed', {
    speed: 1
  }, function() {
    // callback
  });
  console.log('forwards');
}

function tS() {
  get('stop', function(){
    // callback
  });
  console.log('stop');
}

function tB() {
  post('speed', {
    speed: -1
  }, function() {
    // callback
  });
  console.log('backwards');
}

function cUp() {
  console.log('up');
}

function cDown() {
  console.log('down');
}

function cLeft() {
  console.log('left');
}

function cCenter() {
  console.log('center');
}

function cRight() {
  console.log('right');
}

function cBottom() {
  console.log('bottom');
}

/*
* Request functions
*/
function get(path, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", path, true); // true for asynchronous
  xmlHttp.send(null);
}

function post(path, data, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("POST", path, true); // true for asynchronous
  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xmlHttp.send(encodeJSON(data));
}

function encodeJSON(obj) {
  str = [];
  for(var p in obj)
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
  return str.join("&");
}
