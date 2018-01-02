var socket = io();

function scrolltoBottom()
{
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight  = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight+lastMessageHeight >= scrollHeight)
  messages.scrollTop(scrollHeight);
}

socket.on('connect',function(){
  console.log('connected to the server');
  var params = jQuery.deparam(window.location.search);
  socket.emit('join',params);
});

socket.on('didnotjoin',function(obj){
  alert(obj.message);
  window.location.href = '/';
});

socket.on('updateUsersList',function(users)
{
  console.log('User list',users);
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user)
{
 ol.append(jQuery('<li></li>').text(user));
});

jQuery('#users').html(ol);
});
//connect and disconnect are predefined
socket.on('disconnect',function(){
  console.log('Disconnected fron the Server');

});

//now we will use custom events

socket.on('newMessage',function(data){
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template,{
    text: data.text,
    from: data.from
  });

  jQuery('#messages').append(html);
// console.log(data.from,': ',data.text);
// var li = jQuery('<li></li>');
// li.text(`${data.from} ${data.createdAt}: ${data.text}`);
//
// jQuery('#messages').append(li);
jQuery('#input_field').val('');
scrolltoBottom();
});



jQuery('#message-form').on('submit',function(e){
  e.preventDefault();


  socket.emit('createMessage',{
    from : 'User',
    text : jQuery('[name=message]').val(),
    createdAt :" "
  });


  });
