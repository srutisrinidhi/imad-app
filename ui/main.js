var button = document.getElementById('counter');
button.onclick = function() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
      if (request.readyState === XMLHttpREquest.DONE) {
          if (request.status === 200) {
              var counter = request.responseText;
              var span = document.getElementById('count');
            span.innerHTML = counter.toString();
          }
          
      }
  };
  request.open('GET', 'http://srutisrinidhi.imad.hasura-app.io', true);
  request.send(null);
  
};