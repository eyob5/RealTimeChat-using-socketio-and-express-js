const chatform=document.getElementById('chat-form');
const chatmessage=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const usersname=document.getElementById('users')
const socket=io();
const{username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
console.log(username,room);
socket.emit('JoinRoom',{username,room});
socket.on('roomUsers',({room,users})=>{
    OutputRoomName(room);
    OutPutUsers(users);
})
socket.on('message',message=>{
    console.log(message);
    addMessage(message);
    chatmessage.scrollTop=chatmessage.scrollHeight; 
})
chatform.addEventListener('submit',e=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    socket.emit('chatMesssage',msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
    // console.log(msg);
})
function addMessage(message){
 const div=document.createElement('div');
   div.classList.add('message');
   div.innerHTML=`<p class="meta">${message.user}  <span>${message.time}</span></p>
   <p class="text">
       ${message.text}
   </p>`;
   document.querySelector('.chat-messages').appendChild(div);
}
function OutputRoomName(room){
  roomName.innerText=room;
}
function OutPutUsers(users){
usersname.innerHTML=`${users.map(user=>`<li>${user.username}</li>`).join('')}`;
 }