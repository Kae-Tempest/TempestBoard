<script setup lang="ts">
import type {Activity, User} from "~/types/global";
import moment from "moment/moment";

interface Props {
  activity: Activity
}
const props = defineProps<Props>()
const user = ref<User>()

onMounted(async () => {
  const {data: fetchedUser} = await useCustomFetch<User>(`users/${props.activity.user}`)
  if(fetchedUser) user.value = fetchedUser.value as User
})

</script>

<template>
  <div v-if="user">
    {{ user.username }} - {{ useCapitalize(activity.content) }} - {{ moment(activity.updated_at).fromNow() }}
  </div>

</template>

<style scoped>

</style>


