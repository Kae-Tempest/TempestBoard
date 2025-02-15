<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {reactive} from "vue";
import type {User} from "~/types/global";
import {ContentType} from "~/enums/content-type.enum";

type formType = {
  creator: number | undefined,
  name: string,
  description: string,
  thumbnail: File | null,
  status: string
}

const showModal = defineModel()
const user: User | null = useUserStore().getUser;
const {isRefresh} = useRefreshData()
const defaultStates = ['backlog', 'open', 'in_progress', 'completed', 'canceled']

onBeforeUnmount(() => {
  document.removeEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showModal.value = false
    }
  })
})

onMounted(() => {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showModal.value = false
      resetForm()
    }
  })
})

const resetForm = () => {
  data.name = ''
  data.description = ''
  data.thumbnail = null
  data.status = 'in_progress'
  error.name = ''
  error.description = ''
  error.thumbnail = ''
}

const data = reactive<formType>({
  creator: user?.id,
  name: '',
  description: '',
  thumbnail: null,
  status: 'in_progress'
})

const error = reactive({
  name: '',
  description: '',
  thumbnail: '',
})

const handleSetThumb = (e: Event) => {
  const target = e.target
  if (target instanceof HTMLInputElement && target.files) {
    data.thumbnail = target.files?.[0]
  }
}
const handleCreate = async () => {
  const formData = new FormData()
  formData.append('creator', data.creator?.toString() || '')
  formData.append('name', data.name)
  formData.append('description', data.description)
  formData.append('thumbnail', data.thumbnail as Blob || '')
  formData.append('status', data.status)

  const res = await useCustomFetch('/projects/', {
    method: 'POST',
    body: formData,
  }, ContentType.applicationMultipartFormData)

  if (res) {
    const createdProjectId = res.id
    for (const state of defaultStates) {
      await useCustomFetch('/states/', {
        method: 'POST',
        body: JSON.stringify({
          name: state,
          project: createdProjectId,
          is_default: true
        })
      })
    }

    resetForm()
    isRefresh.value = true
    showModal.value = false
  }
}

</script>

<template>
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <form @submit.prevent="handleCreate" class="box create-box">
        <h3>Create Project</h3>
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" name="name" v-model="data.name"/>
            <span class="error">{{ error.name }}</span>
          </div>
        </div>
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea class="textarea" name="description" v-model="data.description"></textarea>
            <span class="error">{{ error.description }}</span>
          </div>
        </div>
        <div class="field">
          <div class="file is-small">
            <label class="file-label">
              <input class="file-input" type="file" name="resume" @input="handleSetThumb($event)"/>
              <span class="file-cta">
                <span class="file-icon">
                    <font-awesome-icon icon="fa-solid fa-upload"/>
                </span>
                <span class="file-label" v-if="data.thumbnail">{{ data.thumbnail?.name }}</span>
                <span v-else class="file-label">Thumbnail..</span>
            </span>
              <span class="error">{{ error.thumbnail }}</span>
            </label>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button" @click="showModal=false; resetForm()" type="reset">Cancel</button>
            <button class="button is-dark" type="submit">Create</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
