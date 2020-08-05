(function() {
	console.log("hai");
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;
  var localstream;
  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
 
  var startbutton = null;
  
  
  function vidOff() {
	  //clearInterval(theDrawLoop);
	  //ExtensionData.vidStatus = 'off';
	  
	  video.pause();
	  video.src = "";
	   if (window.stream) {
		window.stream.getTracks().forEach(function(track) {
		  track.stop();
		});
	  }
	  
	  console.log("Vid off");
  }
  
var currentSource=0;
var videosources = [];
var lastStream;



/*

MediaStreamTrack.getSources(function (sourceInfos) {

    for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        if (sourceInfo.kind === 'audio') {
            console.log(sourceInfo.id, sourceInfo.label || 'microphone');
            //audioSource=sourceInfo.id;

        } else if (sourceInfo.kind === 'video') {
            console.log(sourceInfo.id, sourceInfo.facing, sourceInfo.label || 'camera');
            videosources.push(sourceInfo);

        } else {
            console.log('Some other kind of source: ', sourceInfo);
        }
    }
console.log("sources",videosources)
    next();
});

*/


function gotDevices(deviceInfos) {
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
	
    if (deviceInfo.kind === 'audioinput') {
      //option.text = deviceInfo.label ||
      //  'microphone ' + (audioSelect.length + 1);
      //audioSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
		//alert(option.value);
      option.text = deviceInfo.label || 'camera ' +
        (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Found one other kind of source/device: ', deviceInfo);
    }
  }
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  var constraints = {
    audio: false,
	/*{
      deviceId: {exact: audioSelect.value}
    }*/
    video: {
      deviceId: {exact: videoSelect.value}
    }
  };

  navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  video.srcObject = stream;
  lastStream=stream;
  video.play();
}
function handleError(error) {
  console.log('Error: ', error);
}

var videoSelect=null;

function startup() {
	 
    //document.getElementById('i1').style.visibility='hidden';

    videoSelect = document.getElementById('videoSource');

     videoSelect.onchange = getStream;
	navigator.mediaDevices.enumerateDevices()
     .then(gotDevices).then(getStream).catch(handleError);

  
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
	
    startbutton = document.getElementById('startbutton');
/*
    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video:  true,
           
     
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
		  localstream = stream;
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );
*/
    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

    startbutton.addEventListener('click', function(ev){
      takepicture();
	  //document.getElementById('i1').style.visibility='visible';
      ev.preventDefault();
    }, false);
    stopbutton.addEventListener('click', function(ev){
      vidOff();
      ev.preventDefault();
    }, false);
	restartbutton.addEventListener('click', function(ev){
      startup();
      ev.preventDefault();
    }, false);
    
    clearphoto();
	videoSelect.selectedIndex=1;
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

 
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/jpeg');//
	  //var data = canvas.toDataURL();
	  
	 
	  var fd = new FormData();
	  //console.log(data.file);
	  fd.append("files", data);   // myFile
	  //fd.append("filename", data);   // myFile
	  var xhr = new XMLHttpRequest();
	  xhr.open("POST", "/uploadcampic"); 
	  xhr.onreadystatechange = function() {//Call a function when the state changes.
						 document.getElementById('i2').style.visibility='hidden';
						 document.getElementById('i22').style.visibility='hidden';
						 document.getElementById('i1').style.visibility='hidden';
						 document.getElementById('i11').style.visibility='hidden';

						 document.getElementById('i02').style.visibility='hidden';
						 document.getElementById('i022').style.visibility='hidden';
						 document.getElementById('i01').style.visibility='hidden';
						 document.getElementById('i011').style.visibility='hidden';
			 if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				// Request finished. Do processing here.
				 var resp = JSON.parse(this.response);
				 var data = JSON.parse(resp.data);
				 console.log('recieved from ibm watson server:', resp);
				 console.log('recieved from ibm watson server:', data.result);
				 var classi = data.classified;
				 var iurl = data.imageUrl;
				 alert(classi.length);
				 if(classi.length!=0) {
					 alert('in-' +classi[0].label.toString()+"-");
					 //alert();
					 if(classi[0].label.toString()==("smartphone"))
					 {					 
						 document.getElementById('i2').style.visibility='visible';
						 document.getElementById('i22').style.visibility='visible';

						 document.getElementById('i02').style.visibility='visible';
						 document.getElementById('i022').style.visibility='visible';

					 }
					 else if(classi[0].label.toString()==("laptop"))
					 {
						 document.getElementById('i1').style.visibility='visible';
						 document.getElementById('i11').style.visibility='visible';

						 document.getElementById('i01').style.visibility='visible';
						 document.getElementById('i011').style.visibility='visible';
					 }
 					 //document.getElementById('iurlpic').src=iurl.toString();

				 }
				 else{
					 
				 }
				 
			}
		}
      xhr.send(fd);
	  
      photo.setAttribute('src', data);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();
