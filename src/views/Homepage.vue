<script setup lang="ts">
import Socket from "@/plugins/socket";
import Chat from "@/components/Chat.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { nextTick } from "vue";
const userSelectedToSend = ref<any>({});
const listUser = ref<any[]>([]);
const router = useRouter();

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

const handleLogout = () => {
    nextTick(() => {
        document.cookie = 'email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'password=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push({ path : '/login' });
    })
}

if(!getCookie('email')){
    nextTick(() => {
        router.push({ path : '/login' })
    })
}
// else {
//     Socket.auth = {
//         email: getCookie('email'),
//         password: getCookie('password')
//     };
//     Socket.connect();
// }

onMounted(() => {
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
    <button @click="handleLogout" class="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group">
        <span class="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
        <span class="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
        <svg class="rotate-180 w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </span>
        <span class="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
        <svg class="rotate-180 w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </span>
        <span class="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Logout</span>
    </button>
    <Chat :list-user-active="listUser" :messages="userSelectedToSend?.messages" @on-send-message="onSendMessage" @on-selected-user="onSelectUser"/>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
