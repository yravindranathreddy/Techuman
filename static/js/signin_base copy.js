$(function()
{

    // $("#language").on("change", function(){
    //     console.log($("#language").val());
    // });

    const checkpoint = 700;
    window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
        if (currentScroll <= checkpoint) 
        {
            opacity = 1 - currentScroll / checkpoint;
        } 
        else 
        {
            opacity = 0;
        }
    document.querySelector("#IntroBG").style.opacity = opacity;
    });

    $('#Dialect').select2({
        allowClear: false,
        minimumResultsForSearch: 5,
        width:'100%'
    });

    $('#Dialect').on('change', function(){
        GetDialectInfo();
    })

    $(".toggle-password").click(function() 
    {
        $(this).toggleClass("fa-eye fa-eye-slash");
        input = $(this).parent().find("input");
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });

    $("#ContributeButton").click(function(){
        $('#navigationBar button[data-bs-target="#login"]').tab('show');
    });

    $("#AnonymousLogin").click(function(){
        $('#navigationBar button[data-bs-target="#contribute"]').tab('show');
    });

    $("#GenerateOTP").click(function()
    {
        $("#UserSigninDetails").validate({
            rules: {
               mobile: 'required'
            }
         });
        if($("#mobile").val())
        {
            $("#otp").show();
            $("#Login").show();
            Generate_OTP();
            $("#mobile").attr("disable",true);
        }
    });

    $("#login-tab").click(function(){

        if($("#login-tab").html() == "Logout")
        {
            $("#login-tab").html("Login")
            $('#navigationBar button[data-bs-target="#home"]').tab('show');
        }
    });

    $("#Login").click(function(){

        if($("#otp").val())
        {
            Verify_OTP();
        }
    });

    $("#Save").click(function(){
        SaveRecording();
    });

    $("#ShufflePrompt").click(function(){
        GetPromptsText();
    });

    $("#LoginSelected").click(function()
    {
        $("#Conditions").modal("show");
        // $('#LoginContainer').show();
    });

    $("#Agree").click(function(){
        $("#LoginOptionContainer").hide();
        $("#Conditions").modal("hide");
        $('#LoginContainer').show();
    });

    $("#ContributeSelected").click(function(){
        $('#navigationBar button[data-bs-target="#contribute"]').tab('show');
    });

    $("#login-tab").click(function(){
        $("#LoginOptionContainer").show();
        $("#Conditions").modal("hide");
        $('#LoginContainer').hide();
    })

    $("#DeteleContainer").click(function(){
        $("#player").attr("src","");
    });
    
    window.voiceRecorder = new VoiceRecorder()
    GetPromptsText();
    GetDialectInfo();
});

class VoiceRecorder 
{
	constructor() 
    {
		if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) 
        {
			console.log("getUserMedia supported")
		} 
        else 
        {
			console.log("getUserMedia is not supported on your browser!")
		}

		this.mediaRecorder
		this.stream
		this.chunks = []
		this.isRecording = false

		this.recorderRef = document.querySelector("#recorder")
		this.playerRef = document.querySelector("#player")
        this.AudioRef = document.querySelector("#Record")
		
        this.AudioRef.onclick = this.AudioControl.bind(this)

		this.constraints = {
			audio: true,
			video: false
		}
		
	}

	handleSuccess(stream) 
    {
		this.stream = stream
		this.stream.oninactive = () => 
        {
			console.log("Stream ended!")
		};
		this.recorderRef.srcObject = this.stream
		this.mediaRecorder = new MediaRecorder(this.stream)
		// console.log(this.mediaRecorder)
		this.mediaRecorder.ondataavailable = this.onMediaRecorderDataAvailable.bind(this)
		this.mediaRecorder.onstop = this.onMediaRecorderStop.bind(this)
		this.recorderRef.play()
		this.mediaRecorder.start()
	}

	handleError(error) 
    {
		console.log("navigator.getUserMedia error: ", error)
	}

	onMediaRecorderDataAvailable(e) { this.chunks.push(e.data) }
	
	onMediaRecorderStop(e) 
    { 
        const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' })
        const audioURL = window.URL.createObjectURL(blob)
        this.playerRef.src = audioURL
        this.chunks = []
        this.stream.getAudioTracks().forEach(track => track.stop())
        this.stream = null
	}

    HandleRecording() 
    {
        if (this.isRecording) 
        {
            // stop recording
            this.isRecording = false
            $("#RecordButtonLabel").html("Recording...");
            this.recorderRef.pause()
            this.mediaRecorder.stop()
        }
        else
        {
            // start recording
            this.isRecording = true
            this.playerRef.src = ''
            $("#RecordButtonLabel").html("Record");
            navigator.mediaDevices
            	.getUserMedia(this.constraints)
            	.then(this.handleSuccess.bind(this))
            	.catch(this.handleError.bind(this))
        }
	}

    AudioControl()
    {
        if(this.isRecording)
        {
            this.isRecording = false
            $("#Record").html('<i class="fa fa-microphone">');
            this.recorderRef.pause()
            this.mediaRecorder.stop()
        }
        else
        {
            this.isRecording = true
            $("#Record").html('<i class="fa fa-stop-circle">');
            this.playerRef.src = ''
            navigator.mediaDevices
                .getUserMedia(this.constraints)
                .then(this.handleSuccess.bind(this))
                .catch(this.handleError.bind(this))
        }
    }
}

function Generate_OTP()
{
    var form_data = $("#UserSigninDetails").serialize();
    $.ajax(
    {
        url: "/"+$('html')[0].lang+"/generate_otp/",
        type: 'POST',
        dataType:'json',
        data: form_data,
        success: function(result)
        {
            if(result.is_first_time == true)
            {
                $(".OTPForm").show();
                $("#GenerateOTP").hide();
            }
            $("#GenerateOTP").hide();
            bootbox.alert(
            {
                size: "small",
                title: "OTP Detail",
                message: result.msg,
                buttons:
                {
                    ok:
                    {
                       label: "OK",
                       className: "EPassButton"
                    }
                },
                className: "EPassModal",
            })
        },
        error:function(err)
        {
            console.log(err);
        }
    });
}

function Verify_OTP()
{
   var form_data = $("#UserSigninDetails").serialize();

    $.ajax(
    {
        url: "/"+$('html')[0].lang+"/verify_otp/",
        type: 'POST',
        dataType:'json',
        data: form_data,
        success: function(value)
        {
            if (value.status == true)
            {
                $("#login-tab").html("Logout");
                window.location.href = value.path;
            }
            else
            {
                bootbox.alert(
                {
                    size: "small",
                    title: "Verification Failed",
                    message: value.data,
                })
            }
        }
    });
    
}

async function SaveRecording()
{
    // $("#LoaderModal").modal("show");
    const blob = await fetch($("#player").attr('src')).then(r => r.blob());
    const recordedFile = new File([blob], `audiorecord.webm`);
    //   grabs the value of the language field
    const language = $("#Dialect").val();
    //   initializes an empty FormData
    let data = new FormData();
    //   appends the recorded file and language value
    data.append("recorded_audio", recordedFile);
    data.append("language", language);
    $.ajax({
        url: "/"+$('html')[0].lang+"/SaveRecording/",
        method: "POST",
        data: data,
        dataType: "json",
        success: function (response) 
        {
            $("#Thankyou").modal('show');
            // bootbox.alert(
            // {
            //     size: "small",
            //     title: "Success",
            //     message:'Recording Saved',
            //     buttons:
            //     {
            //         ok:
            //         {
            //             label: "OK",
            //             className: "EPassButton"
            //         }
            //     },
            //     className: "EPassModal",
            // })
            // console.log(response);
            
        },
        error: function (error) 
        {
            console.error(error);
            // $("#LoaderModal").modal('hide');
        },
        cache: false,
        processData: false,
        contentType: false,
    });
}

function GetDialectInfo()
{
    $.ajax(
    {
        url: "/"+$('html')[0].lang+"/GetDialectDetails/",
        type: 'POST',
        dataType:'json',
        data: {"DialectId":$('#Dialect').val()},
        success: function(value)
        {
            if (value.HasError == false)
            {
                // console.log(value.data);
                DialectDetails = $.parseJSON(value.data);
                if(DialectDetails.length > 0)
                {   
                    if(DialectDetails[0].fields.dialectInfo && DialectDetails[0].fields.file && DialectDetails[0].fields.AudioText)
                    {
                        $("#DialectInfo").show();
                        $("#DialectInfoText").html(DialectDetails[0].fields.dialectInfo);
                        $("#DialectAudio").attr("src","/media/"+DialectDetails[0].fields.file);
                        $("#DialectAudioText").html(DialectDetails[0].fields.AudioText);
                    }
                    else
                    {
                        $("#DialectInfo").hide();
                    }
                }
                else
                {
                    $("#DialectInfo").hide();
                }
            }
            else
            {
                bootbox.alert(
                {
                    size: "small",
                    title: "Verification Failed",
                    message: value.data,
                })
            }
        }
    });
    
}

function GetPromptsText()
{
    $.ajax(
    {
        url: "/"+$('html')[0].lang+"/GetPrompts/",
        type: 'POST',
        dataType:'json',
        success: function(value)
        {
            if (value.HasError == false)
            {
                // console.log(value.data);
                promptDetails = $.parseJSON(value.data);
                if(promptDetails.length > 0)
                {   
                    if(promptDetails[0].fields.Text)
                    {
                        $("#PromptText").html(promptDetails[0].fields.Text);
                    }
                }
            }
            else
            {
                bootbox.alert(
                {
                    size: "small",
                    title: "Verification Failed",
                    message: value.data,
                })
            }
        }
    });
    
}