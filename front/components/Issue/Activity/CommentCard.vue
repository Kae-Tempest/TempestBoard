<script setup lang="ts">
import type {Comment, User} from '~/types/global';
import {useDayjs} from '#dayjs'

const dayjs = useDayjs()

interface Props {
  comment: Comment
}
const props = defineProps<Props>()
const user = ref<User | null>(null)

onMounted(async () => {

  const {data} = await useCustomFetch<User>(`/users/${props.comment.user}`)
  user.value = data.value
})


</script>

<template>
  <div class="comment">
    <div class="info">
      <div v-if="user" class="user-info">
        <img v-if="user.thumbnail" :src="user.thumbnail" alt="user thumbnail" class="thumbnail"/>
        <img v-else src="assets/image/user.png" alt="user thumbnail" class="thumbnail"/>
        <span>{{ user.username }}</span>
      </div>
      <!--   formated date / hour  -->
      <span>-</span>
      <span> {{ dayjs().to(dayjs(comment.updated_at)) }}</span>
    </div>
    <div class="content">
      {{ comment.content }}
      <!-- if attachment show attchment -->
    </div>



    <!-- if reply show reply input else show at click -->
  </div>
</template>