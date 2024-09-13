const drone = new ScaleDrone('EysghIgjliEb1VAN') //Scaledrone 인스턴스
let members = []; //온라인 멤버 표시 변수

drone.on('open', error => {
  if (error) {
	return console.error(error);
  }})

const room = drone.subscribe('my-room', {
  historyCount: 100 //메시지 100개 불러오기
});
room.on('history_message', message => 
	printmsg(message)
);
room.on('open', error => {
  if (error) {
	console.error(error);
  } else {
	console.log('Connected to room');
  }
}); //채팅방 connect 됬을 때 console.log

room.on('message', message => {
	printmsg(message);
});

room.on("members", m => { //처음 실행할 때 온라인 멤버 불러오기
	members = m;
})

room.on("join", member => { //새로운 멤버가 들어오면 members배열에 추가하기
	members.push(member); 
})

room.on('member_leave', ({id}) => { //멤버가 떠나면 members배열에서 삭제하기
	const index = members.findIndex(member => member.id === id);
	members.splice(index, 1);
});

drone.on('error', error => console.error(error));

//전송버튼이 눌렸을 때 텍스트박스 안에 있는 텍스트를 메시지로 보낸다. 또한 텍스트박스의 내용을 비운다.
function sendmsg()  {
	const msginput = document.getElementById('msginput');
	drone.publish({
		room: 'my-room',
		message: nameinput.value + " : " + msginput.value
	})
	
	msginput.value = '';
}
document.getElementById('members').innerHTML = members;
document.getElementById('sendbtn').addEventListener('click', event => sendmsg());

document.getElementById('msginput').addEventListener('keyup', event => enterkey());

function enterkey(){ //엔터키 누를때 메시지 보내게하기
	if (window.event.keyCode == 13) {
		sendmsg();
	}
}

const msgs = document.getElementById('messages');
function printmsg(message){
	const msgdiv = document.createElement('div'); //message를 담을 div생성
	const msgspan = document.createElement('span'); //message를 담을 span생성
	const timespan = document.createElement('span'); //시간을 담을 span생성

	msgdiv.setAttribute('class','msgbox'); //msgdiv	의 class설정
	if (drone.clientId != message.clientId){
		msgdiv.setAttribute('class','msgbox notme');
	}

	msgspan.setAttribute('class', 'msg'); //msgspan의 class설정
	timespan.setAttribute('class', 'time'); //msgspan의 class설정
    let today = new Date();   

let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1;  // 월
let date = today.getDate();  // 날짜

	const msg = document.createTextNode(message.data);
	const msgtime = new Date(message.timestamp * 1000); //msg작성한 시간 변수에 저장
	const msgtimetext = document.createTextNode(year + '/' + month + '/' + date+" "+msgtime.getHours()+":"+(msgtime.getMinutes() >= 10 ? msgtime.getMinutes() : "0" + msgtime.getMinutes())); //10시 9분 -> 10:09


	msgspan.appendChild(msg);
	timespan.append(msgtimetext);
    
	
	msgdiv.appendChild(msgspan); //만든 div에 message넣기
	msgdiv.appendChild(timespan);
	msgs.appendChild(msgdiv); // #messages div에 저장하기

	msgs.scrollTop = msgs.scrollHeight; //스크롤 맨 아래로 내리기
}
window.onload = function() {
    const name = document.getElementById('nameinput')
    name.value = localStorage.getItem("name")
}
document.getElementById("sendbtn").addEventListener('click', save);
        function save() {
            var name = document.getElementById('nameinput')
            localStorage.setItem("name", name.value)
            button.onclick = buttonClickHandler;
        } //이름 저장
