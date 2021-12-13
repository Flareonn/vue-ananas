<template>
  <div class="table__row" role="row">
    <div class="table__col" role="cell">{{ company.name }}</div>
    <div class="table__col" role="cell">
      <input
        v-if="isEdit"
        ref="refInputAddress"
        :value="company.address"
        @blur="isEdit = false"
        @keyup.esc="isEdit = false"
        @keyup.enter="validateAddress($event.target.value)"
        role="textbox"
      />
      <span v-else @click="isEdit = true">
        {{ company.address }}
      </span>
    </div>
    <div class="table__col" role="cell">{{ company.OGRN }}</div>
    <div class="table__col" role="cell">{{ company.INN }}</div>
    <div class="table__col" role="cell">
      {{ dateNormalize(company.date) }}
    </div>
    <div class="table__col" role="cell">
      <button @click="remove(company.id)">Удалить</button>
    </div>
  </div>
</template>

<script>
import { inject, onUpdated, ref } from "vue-demi";
import { dateNormalize } from "../use/helpers.js";

import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

const RULES = {
  required,
};

export default {
  props: {
    company: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const isEdit = ref(false);
    const refInputAddress = ref(null);

    const remove = inject("removeCompany");
    const editCompany = inject("editCompanyAddress");

    const validateAddress = (value) => {
      const v$ = useVuelidate(RULES, value);
      if (v$.value.$invalid) return;

      editCompany(props.company.id, value);
      isEdit.value = false;
    };

    onUpdated(() => {
      if (isEdit.value) refInputAddress.value.focus();
    });

    return {
      isEdit,
      dateNormalize,
      remove,
      editCompany,
      refInputAddress,
      validateAddress,
    };
  },
};
</script>

<style>
</style>