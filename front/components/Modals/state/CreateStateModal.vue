<script setup lang="ts">

const openCreateStateModal = defineModel()

const data = reactive({
  name: ""
})

const error = reactive({
  name: ""
})

const handleAddState = async () => {
  console.log(data.name)
}
</script>

<template>
  <div :class="{'is-active': openCreateStateModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="control">
          <div class="field">
            <label for="name">State Name</label>
            <input id="name" placeholder="State Name..." type="text" class="input" v-model="data.name">
            <span class="error">{{ error.name }}</span>
          </div>
        </div>
        <div class="btn-action">
          <button class="button" @click="openCreateStateModal=false">Cancel</button>
          <button class="button is-dark" @click="handleAddState()">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>