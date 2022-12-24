/*****************function get_date********************************
 *  to return the current date in france : dd/mm/yyyy hours/min/sec
 * ****************************************************************/
 function get_date(){
    //execute tache dans un certains nb de temps
    setInterval(()=>{
        var date = new Date();
        // var full_date =  date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
        var hours = date.getHours() + ":" + date.getMinutes();
        var text = document.getElementById("jacket_time");
        text.innerHTML = hours + " GMT+01";
    }, 1000);
}

/*****************function get_meteo_info******************
 *  to return the current condition 
 * *********************************************************/

function get_meteo(city){
    var url = "https://api.openweathermap.org/data/2.5/weather?q="+city+",fr&appid=c21a75b667d6f7abb81f118dcf8d4611&units=metric";

    fetch(url)
    .then(function(res) {
    if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        console.log(value);
        get_temperature(value.main);
        get_meteo_info(value.clouds);
        
    })
    .catch(function(err) {
        // Une erreur est survenue
    });
}

/*****************function get_tempretaure******************
 *  to return the current temp and the feel_like
 * *********************************************************/

function get_temperature(data){
    var temperature = data.temp;
    var unit = " °C";
    var text = document.getElementById("jacket_temperature_text");
    var img = document.getElementById("jacket_temperature");
    text.innerHTML = temperature + unit;
    if(temperature > 20){
        img.src = "../img/icone_temp_chaud.png";
    }
    else{
        img.src = "../img/icone_temp_froid.png";
    }
}


function get_meteo_info(data){
    var nb_clouds = data.all;
    var img = document.getElementById("jacket_meteo");
    if(nb_clouds > 50 && nb_clouds <= 80){
        img.src = "../img/icone_meteo_cloudy.png";
    }
    else if(nb_clouds > 15 && nb_clouds <= 50){
        img.src = "../img/icone_meteo_few_cloud.png";
    }
    else if(nb_clouds <= 15){
        img.src = "../img/icone_meteo_sun.png";
    }
    else { // car il pleut souvent
        img.src="../img/icone_meteo_rainy.png";
    }
}

/*****************function get_sos_call******************
 *  to call someone if you encounter an issue
 * *********************************************************/
/*change le fond de body et enlève la heatmap 
utilise un fichier sonore d'appel sos*/

function get_sos_call(){
    document.getElementById("jacket_section").style.display = "none";
    document.getElementById("jacket_popup").style.display = "block";
    document.getElementById("jacket_button_sos").style.backgroundColor = "#A6F1A6";
    document.getElementById("jacket_sos").src = "../img/jacket_call_click.png";
    document.getElementById("jacket_button_save_mike").style.backgroundColor = "#32B232";
    document.getElementById("jacket_play_button").style.backgroundColor = "#358600";
    document.getElementById("jacket_stop_recording").style.backgroundColor = "#358600";
    document.getElementById("jacket_button_save_mike").style.backgroundColor = "#358600";
    document.getElementById("jacket_download_button").style.backgroundColor = "#358600";
    document.getElementById("jacket_send_sos").style.backgroundColor = "#358600";
}

function send_sos(){
    document.getElementById("jacket_section").style.display = "block";
    document.getElementById("jacket_popup").style.display = "none";
    document.getElementById("jacket_sos").src = "../img/jacket_call.png";
    document.getElementById("jacket_button_sos").style.backgroundColor = "#27A5B7";
}

function save_message(){
    document.getElementById("jacket_section").style.display = "none";
    document.getElementById("jacket_popup").style.display = "block";
    document.getElementById("save_message").style.display = "block";
    document.getElementById("jacket_sos").src = "../img/jacket_call_click.png";
    document.getElementById("jacket_button_sos").style.backgroundColor = "#A6F1A6";
    document.getElementById("jacket_button_save_mike").style.backgroundColor = "#A6F1A6";
    var bflat =  document.getElementById("sound_message");
    bflat.src = "../ressources/Beeper_Emergency_Call.mp3";
    bflat.play();
}

var leftchannel = [];
var rightchannel = [];
var recorder = null;
var recordingLength = 0;
var volume = null;
var mediaStream = null;
var sampleRate = 44100;
var context = null;
var blob = null;

function recording_a_message(){

    // Initialize recorder
    document.getElementById("jacket_button_save_mike").style.backgroundColor = "#9EE37D";
    document.getElementById("jacket_stop_recording").style.backgroundColor = "#FF312E";
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia(
    {
        audio: true
    },
    function (e) {
        console.log("user consent");

        // creates the audio context
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();

        // creates an audio node from the microphone incoming stream
        mediaStream = context.createMediaStreamSource(e);

        // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
        // bufferSize: the onaudioprocess event is called when the buffer is full
        var bufferSize = 2048;
        var numberOfInputChannels = 2;
        var numberOfOutputChannels = 2;
        if (context.createScriptProcessor) {
            recorder = context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
        } else {
            recorder = context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
        }

        recorder.onaudioprocess = function (e) {
            leftchannel.push(new Float32Array(e.inputBuffer.getChannelData(0)));
            rightchannel.push(new Float32Array(e.inputBuffer.getChannelData(1)));
            recordingLength += bufferSize;
        }

        // we connect the recorder
        mediaStream.connect(recorder);
        recorder.connect(context.destination);
    },

    function (e) {
        console.error(e);
    });
}

function stop_recording()
{
        document.getElementById("jacket_play_button").style.backgroundColor = "#43DBB7";
        document.getElementById("jacket_stop_recording").style.backgroundColor = "#358600";
        document.getElementById("jacket_button_save_mike").style.backgroundColor = "#358600";
        // stop recording
        recorder.disconnect(context.destination);
        mediaStream.disconnect(recorder);

        // we flat the left and right channels down
        // Float32Array[] => Float32Array
        var leftBuffer = flattenArray(leftchannel, recordingLength);
        var rightBuffer = flattenArray(rightchannel, recordingLength);
        // we interleave both channels together
        // [left[0],right[0],left[1],right[1],...]
        var interleaved = interleave(leftBuffer, rightBuffer);

        // we create our wav file
        var buffer = new ArrayBuffer(44 + interleaved.length * 2);
        var view = new DataView(buffer);

        // RIFF chunk descriptor
        writeUTFBytes(view, 0, 'RIFF');
        view.setUint32(4, 44 + interleaved.length * 2, true);
        writeUTFBytes(view, 8, 'WAVE');
        // FMT sub-chunk
        writeUTFBytes(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // chunkSize
        view.setUint16(20, 1, true); // wFormatTag
        view.setUint16(22, 2, true); // wChannels: stereo (2 channels)
        view.setUint32(24, sampleRate, true); // dwSamplesPerSec
        view.setUint32(28, sampleRate * 4, true); // dwAvgBytesPerSec
        view.setUint16(32, 4, true); // wBlockAlign
        view.setUint16(34, 16, true); // wBitsPerSample
        // data sub-chunk
        writeUTFBytes(view, 36, 'data');
        view.setUint32(40, interleaved.length * 2, true);

        // write the PCM samples
        var index = 44;
        var volume = 1;
        for (var i = 0; i < interleaved.length; i++) {
            view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
            index += 2;
        }

        // our final blob
        blob = new Blob([view], { type: 'audio/wav' });
}

function playButton(){

    document.getElementById("jacket_play_button").style.backgroundColor = "#43DBB7";
    document.getElementById("jacket_stop_recording").style.backgroundColor = "#358600";
    document.getElementById("jacket_button_save_mike").style.backgroundColor = "#358600";
    document.getElementById("jacket_download_button").style.backgroundColor = "#63C132";
    document.getElementById("jacket_send_sos").style.backgroundColor = "#27A5B7";
    if (blob == null) {
        return;
    }

    var url = window.URL.createObjectURL(blob);
    var audio = new Audio(url);
    audio.play();
}

function downloadButton() {
    document.getElementById("jacket_play_button").style.backgroundColor = "#358600";
    document.getElementById("jacket_stop_recording").style.backgroundColor = "#358600";
    document.getElementById("jacket_button_save_mike").style.backgroundColor = "#358600";
    document.getElementById("jacket_download_button").style.backgroundColor = "#358600";
    if (blob == null) {
        return;
    }

    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "sample.wav";
    a.click();
    window.URL.revokeObjectURL(url);
}

function flattenArray(channelBuffer, recordingLength) {
    var result = new Float32Array(recordingLength);
    var offset = 0;
    for (var i = 0; i < channelBuffer.length; i++) {
        var buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
    }
    return result;
}

function interleave(leftChannel, rightChannel) {
    var length = leftChannel.length + rightChannel.length;
    var result = new Float32Array(length);

    var inputIndex = 0;

    for (var index = 0; index < length;) {
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
    }
    return result;
}

function writeUTFBytes(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

