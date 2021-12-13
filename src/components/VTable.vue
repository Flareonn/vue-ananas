<template>
  <header class="table-header table__row" role="rowheader">
    <div class="table__col" role="columnheader">Наименование</div>
    <div class="table__col" role="columnheader">Адрес</div>
    <div class="table__col" role="columnheader">ОГРН</div>
    <div class="table__col" role="columnheader">ИНН</div>
    <div class="table__col" role="columnheader">Дата регистрации</div>
    <div class="table__col" role="columnheader">Действия</div>
  </header>
  <div class="table-body" role="rowgroup">
    <v-table-item
      v-for="company in data"
      :key="company.id"
      :company="company"
    />
  </div>
</template>

<script>
import VTableItem from "./VTableItem.vue";

export default {
  name: "VTable",
  components: {
    VTableItem,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="sass">
.table
  &-header
    border-top: 1px solid #000
  &__row
    display: flex
    justify-content: space-between
    &:not(.table-header):hover
      background-color: #ccc
  &__col
    padding: 15px 0px
    border-right: 1px solid #000
    border-bottom: 1px solid #000
    width: 50%
    display: flex
    align-items: center
    justify-content: center
    &:first-child
      border-left: 1px solid #000
</style>