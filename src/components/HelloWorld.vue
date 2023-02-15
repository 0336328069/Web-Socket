<script setup lang="ts">
import Socket from "@/plugins/socket";
import Chat from "@/components/Chat.vue";
import { onMounted, onUnmounted, ref } from "vue";
const userSelectedToSend = ref<any>({});
const listUser = ref<any[]>([]);

const onSelectUser = (user: any) => {
  userSelectedToSend.value = user;
}

const onSendMessage = (message : string) => {
  Socket.emit("privateMessage", {
    message: message,
    to: userSelectedToSend.value?.id
  })
  if(!userSelectedToSend.value.messages) {
    userSelectedToSend.value.messages = [];
  }
  userSelectedToSend.value?.messages.push({
    message,
    isSelf: true
  })
}

const getCookie = (cname : string) => {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

onMounted(() => {
  console.log(getCookie('accountId'))
  Socket.on("getAllUser", (data) => {
    data.forEach((user: any) => {
      user.self = user.id === Socket.id;
    })

    listUser.value = data;
  })

  Socket.on("userConnected", (data) => {
    listUser.value.push(data)
  })

  Socket.on("messageToReceiver", ({ message, from }) => {
    listUser.value.forEach((item) => {
      if(item?.id === from){
        if(!item.messages) {
          item.messages = [];
        }
        item?.messages.push({
          message,
          isSelf: false
        })
      }
    })
  })
})

onUnmounted(() => {
  Socket.off("getAllUser");
  Socket.off("userConnected");
  Socket.off("messageToReceiver");
})
</script>

<template> 
  <Chat :list-user-active="listUser" :messages="userSelectedToSend?.messages" @on-send-message="onSendMessage" @on-selected-user="onSelectUser"/>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
