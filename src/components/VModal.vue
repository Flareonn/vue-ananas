<template>
  <div class="modal" @keyup.esc="closeForm()">
    <div class="container">
      <form action="" class="modal-form" role="form">
        <h2 class="modal-form__title">Добавление новой компании</h2>
        <div class="modal-form__input">
          <label for="companyName">Введите название: </label>
          <input
            type="text"
            id="companyName"
            ref="companyName"
            v-model="formModel.name"
            @blur="v$.name.$touch"
            required
            role="textbox"
          />
        </div>
        <div class="modal-form__input">
          <label for="companyAddress">Введите адрес: </label>
          <input
            type="text"
            id="companyAddress"
            required
            v-model="formModel.address"
            @blur="v$.address.$touch"
            role="textbox"
          />
        </div>
        <div class="modal-form__input">
          <label for="companyOGRN">Введите ОГРН: </label>
          <input
            type="text"
            id="companyOGRN"
            required
            v-model.trim="formModel.OGRN"
            @blur="v$.OGRN.$touch"
            role="textbox"
          />
        </div>
        <button
          @click.prevent="
            v$.INN.$invalid
              ? v$.INN.$touch()
              : getByINN(formModel.INN, createCompany)
          "
        >
          Загрузить
        </button>
        <div class="modal-form__input">
          <label for="companyINN">Введите ИНН: </label>
          <input
            type="text"
            id="companyINN"
            required
            v-model="formModel.INN"
            role="textbox"
          />
        </div>
        <div class="modal-form__input">
          <label for="companyDate">Введите дату регистрации компании: </label>
          <input
            type="date"
            id="companyDate"
            required
            v-model="formModel.date"
            @blur="v$.date.$touch"
            role="textbox"
          />
        </div>
        <input
          type="submit"
          value="Создать"
          class="modal-form__submit"
          @click.prevent="createCompany()"
        />
      </form>
      <button class="modal__close" @click="closeForm()">&times;</button>
      <!-- Если необходимо ознакомиться со ошибками, для деббагинга -->
      <!-- <pre>{{ v$.$silentErrors }}</pre> -->
      <pre v-show="v$.$anyDirty">{{
        v$.$silentErrors.length
          ? "У каждого поля должно быть указание\nв чем именно оно не прошло валидацию\nно это просто тестовое, решил не делать"
          : null
      }}</pre>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "@vue/runtime-core";

import useVuelidate from "@vuelidate/core";
import { required, numeric } from "@vuelidate/validators";

import { LENGTH_VALID_DOUBLE, YEAR_VALIDATOR } from "../use/validators.js";
import { dateNormalize, getByINN } from "../use/helpers.js";

// Изначальная модель для формы
const INITIAL_MODEL = {
  name: "",
  INN: "",
  OGRN: "",
  address: "",
  date: dateNormalize(Date.now()),
};

// Правила валидации
const RULES = {
  name: { required },
  INN: {
    required,
    numeric,
    LENGTH_VALID_DOUBLE: LENGTH_VALID_DOUBLE(10, 12),
  },
  OGRN: {
    required,
    numeric,
    LENGTH_VALID_DOUBLE: LENGTH_VALID_DOUBLE(13, 15),
  },
  address: { required },
  date: {
    required,
    YEAR_VALIDATOR: YEAR_VALIDATOR(1950, new Date().getFullYear()),
  },
};

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  setup(_, { emit }) {
    // REACTIVE & REFS
    const companyName = ref(null);
    let formModel = reactive(Object.assign({}, INITIAL_MODEL));

    const v$ = useVuelidate(RULES, formModel);

    // EMITS

    const createCompany = (data) => {
      // Заполнение формы
      if (data && data.id) {
        Object.assign(formModel, {
          ...data,
          date: dateNormalize(data.date),
        });
        return;
      } else if (v$.value.$invalid) {
        return;
      }

      // Создание уникального ID
      Object.assign(formModel, {
        id: formModel.INN + formModel.date.toString(),
      });

      emit("addCompany", formModel);
      emit("close");
      Object.assign(formModel, INITIAL_MODEL);
    };

    const closeForm = () => {
      emit("close");
      Object.assign(formModel, INITIAL_MODEL);
    };

    return {
      companyName,
      formModel,
      createCompany,
      closeForm,
      dateNormalize,
      getByINN,
      v$,
    };
  },
};
</script>

<style lang="sass">
.container
  background-color: #fff
  padding: 2.5rem 3rem
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  position: relative
.modal
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0,0,0,.25)
  display: flex
  align-items: center
  justify-content: center
  &-form
    background-color: #fff
    &__title, &__input
      margin-bottom: 25px
    &__submit, &__input
      width: 100%
    &__submit
      cursor: pointer
    &__input
      display: flex
      flex-direction: column
      align-items: stretch
      flex-wrap: wrap
      position: relative
      text-align: left
  &__close
    background-color: transparent
    border: none
    cursor: pointer
    position: absolute
    right: 5px
    top: 0
    width: 25px
    height: 25px
    font-size: 29px
h2
  margin: 0
</style>