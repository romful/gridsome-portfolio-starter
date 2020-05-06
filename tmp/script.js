var xhr = new XMLHttpRequest();
var url = "https://api.hsforms.com/submissions/v3/integration/submit/7568331/a3a3813d-79b6-4819-ae74-f82372d68398";
xhr.open("POST", url, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
	if(xhr.readyState === 4){
		var json = JSON.parse(xhr.responseText);
		if(xhr.status === 200 && json.inlineMessage) {
			console.log(json.inlineMessage);
		}else if(json.errors && json.errors[0] && json.errors[0].message){
			console.log(json.errors[0].message);
		}else if(json.message){
			console.log(json.message);
		}else{
			console.log("ERROR!!!");
		}
	}
};
var data = JSON.stringify(
{
	"fields": [{
		"name": "email",
		"value": "smsreferat@gmail.com"
	}, {
		"name": "firstname",
		"value": "First Name"
	}, {
		"name": "lastname",
		"value": "Last Name"
	}, {
		"name": "message",
		"value": "Test Message"
	}]
});
xhr.send(data);
