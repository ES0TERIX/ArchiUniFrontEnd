<script setup lang="ts">
import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { Parcours } from '@/domain/entities/Parcours';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';

const currentParcours = ref<Parcours>(new Parcours(null, null, null));
const isOpen = ref(false);

const openForm = (parcours: Parcours | null = null) => {
  isOpen.value = true;

  if (parcours) {
    currentParcours.value = parcours;
  }
};

const getValidYearRange = () => {
  const currentYear = new Date().getFullYear();
  return {
    min: currentYear - 20,
    max: currentYear + 20
  };
};

const closeForm = () => {
  isOpen.value = false;
  currentParcours.value = new Parcours(null, null, null);
};

const emit = defineEmits(['parcoursAdded', 'parcoursUpdated']);

const saveParcours = () => {
  if (formErrors.value.NomParcours || formErrors.value.AnneeFormation) {
    alert('Veuillez corriger les erreurs avant de sauvegarder');
    return;
  }
  if (currentParcours.value.ID) {
    ParcoursDAO.getInstance().update(currentParcours.value.ID, currentParcours.value)
      .then(() => {
        alert('Parcours modifié avec succès');
        emit('parcoursUpdated', currentParcours.value);
        closeForm();
      })
      .catch((ex) => {
        alert(ex.message);
      });
  } else {
    ParcoursDAO.getInstance().create(currentParcours.value).then((newParcours) => {
      alert('Parcours créé avec succès');
      emit('parcoursAdded', newParcours);
      closeForm();
    }).catch((ex) => {
      alert(ex.message);
    });
  }
};
const props = defineProps({
  parcours: {
    type: Object as () => Parcours | null,
    required: false,
    default: null,
  },
});

const formErrors = ref<{
  NomParcours: string | null;
  AnneeFormation: string | null;
}>({
  NomParcours: null,
  AnneeFormation: null,

});

watch(() => currentParcours.value.NomParcours, () => {
  if (!currentParcours.value.NomParcours || currentParcours.value.NomParcours.trim() === '' || currentParcours.value.NomParcours.length < 3) {
    formErrors.value.NomParcours = 'Le nom du parcours doit faire au moins 3 caractères';
  } else {
    formErrors.value.NomParcours = null;
  }
});

watch(() => currentParcours.value.AnneeFormation, (newValue) => {
  const yearRange = getValidYearRange();

  if (!newValue) {
    formErrors.value.AnneeFormation = "L'année de formation est requise";
  } else {
    const year = Number(newValue);
    if (!Number.isInteger(year)) {
      formErrors.value.AnneeFormation = "L'année doit être un nombre entier";
    } else if (year < yearRange.min || year > yearRange.max) {
      formErrors.value.AnneeFormation = `L'année doit être comprise entre ${yearRange.min} et ${yearRange.max}`;
    } else {
      formErrors.value.AnneeFormation = null;
    }
  }
});

onBeforeMount(() => {
  if (props.parcours) {
    currentParcours.value = props.parcours;
  }
});

defineExpose({
  openForm,
  closeForm,
});
</script>

<template>
  <div v-if="isOpen" class="custom-modal">
    <div class="card new-parcours">
      <div class="card-header" style="background: #273656">
        <template v-if="parcours && parcours.ID"> Modification du parcours </template>
        <template v-else> Nouveau parcours </template>
      </div>
      <div class="card-body">
        <div class="card-text mt-1 mb-1">
          <form>
            <CustomInput
              v-model="currentParcours.NomParcours"
              id="intitule"
              libelle="Intitulé"
              type="text"
              placeholder="Intitulé du parcours"
              :error="formErrors.NomParcours"
            />
            <CustomInput
              class="mt-2"
              v-model="currentParcours.AnneeFormation"
              id="annee"
              libelle="Année"
              type="number"
              :placeholder="`Année entre ${getValidYearRange().min} et ${getValidYearRange().max}`"
              :error="formErrors.AnneeFormation"
            />
          </form>
        </div>
        <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger"
                      @click="closeForm">
          Annuler
        </CustomButton>
        <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveParcours">
          Enregistrer
        </CustomButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-modal {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(87, 86, 86, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.custom-modal .card {
  width: 250px;
}

.card-header {
  background: #273656;
  color: white;
  text-align: left;
}

.card-text {
  text-align: left;
}
</style>