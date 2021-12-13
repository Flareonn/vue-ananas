<template>
  <button class="button-add" @click="isModalOpen = true">Добавить</button>
  <VTable :data="companies" />
  <v-modal
    :isOpen="isModalOpen"
    v-show="isModalOpen"
    @close="isModalOpen = false"
    @addCompany="createCompany"
  />
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { ref } from "@vue/reactivity";
import VTable from "./components/VTable.vue";
import VModal from "./components/VModal.vue";
import { provide } from "vue-demi";
import { getByINN } from "./use/helpers.js";

const remove = (arr, idx) => {
  arr.splice(idx, 1);
};

const edit = (arr, idx, val) => {
  arr[idx].address = val;
};

export default {
  name: "App",
  components: {
    VTable,
    VModal,
  },
  setup() {
    const companies = ref([]);
    const isModalOpen = ref(false);

    const actionById = (id, func, val = null) => {
      let idx = -1;
      Array.from(companies.value).forEach((item, currentIdx) => {
        item.id === id ? (idx = currentIdx) : -1;
      });
      if (idx > -1) {
        func(companies.value, idx, val);
      }
      return idx;
    };

    const createCompany = (data) => {
      companies.value.push({ ...data, date: new Date(data.date) });
    };

    const removeCompany = (id) => {
      actionById(id, remove);
    };

    const editCompanyAddress = (id, val) => {
      actionById(id, edit, val);
    };

    provide("removeCompany", removeCompany);
    provide("editCompanyAddress", editCompanyAddress);

    getByINN("0278962265", createCompany);
    getByINN("7707083893", createCompany);
    getByINN("644802061247", createCompany);
    getByINN("026602372715", createCompany);
    getByINN("230407040019", createCompany);

    return {
      companies,
      isModalOpen,
      createCompany,
      removeCompany,
      editCompanyAddress,
    };
  },
};
</script>

<style lang="sass">
#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
  margin-top: 60px
.button-add
  margin-bottom: 25px
</style>
