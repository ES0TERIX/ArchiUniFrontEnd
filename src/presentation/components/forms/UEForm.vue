<script setup lang="ts">
import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { UE } from '@/domain/entities/UE';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import { UeDAO } from '@/domain/daos/UEDAO';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
import type { Parcours } from '@/domain/entities/Parcours';

const currentUe = ref<UE>(new UE(null, null, null, []));
const isOpen = ref(false);
const parcoursOptions = ref<Parcours[]>([]);

const openForm = (ue: UE | null = null) => {
  isOpen.value = true;
  if (ue) {
    // Create a new instance to avoid reference issues
    currentUe.value = new UE(
      ue.ID,
      ue.NumeroUe,
      ue.Intitule,
      [...(ue.Parcours || [])] // Ensure we make a copy of the parcours array
    );
  } else {
    currentUe.value = new UE(null, null, null, []);
  }
};

const closeForm = () => {
  isOpen.value = false;
  currentUe.value = new UE(null, null, null, []);
};

const emit = defineEmits(['create:ue', 'update:ue']);

const saveUE = async () => {
  if (formErrors.value.NumeroUe || formErrors.value.Intitule || !currentUe.value.Parcours?.length) {
    alert('Veuillez corriger les erreurs avant de sauvegarder');
    return;
  }

  try {
    if (currentUe.value.ID) {
      const updatedUE = await UeDAO.getInstance().update(
        currentUe.value.ID,
        currentUe.value
      );
      emit('update:ue', updatedUE);
      alert('UE modifiée avec succès');
    } else {
      const newUE = await UeDAO.getInstance().create(currentUe.value);
      emit('create:ue', newUE);
      alert('UE créée avec succès');
    }
    closeForm();
  } catch (ex: any) {
    alert(ex.message);
  }
};

const props = defineProps({
  ue: {
    type: Object as () => UE | null,
    required: false,
    default: null,
  },
});

const formErrors = ref<{
  NumeroUe: string | null;
  Intitule: string | null;
}>({
  NumeroUe: null,
  Intitule: null,
});

watch(() => currentUe.value.Intitule, () => {
  if (!currentUe.value.Intitule || currentUe.value.Intitule.trim() === '' || currentUe.value.Intitule.length < 3) {
    formErrors.value.Intitule = 'L\'intitulé doit faire au moins 3 caractères';
  } else {
    formErrors.value.Intitule = null;
  }
});

watch(() => currentUe.value.NumeroUe, () => {
  if (!currentUe.value.NumeroUe || currentUe.value.NumeroUe.trim() === '' || currentUe.value.NumeroUe.length < 3) {
    formErrors.value.NumeroUe = 'Le numéro d\'UE doit faire au moins 3 caractères';
  } else {
    formErrors.value.NumeroUe = null;
  }
});

onBeforeMount(() => {
  if (props.ue) {
    currentUe.value = new UE(
      props.ue.ID,
      props.ue.NumeroUe,
      props.ue.Intitule,
      [...(props.ue.Parcours || [])]
    );
  }

  // Load parcours list
  ParcoursDAO.getInstance().list().then((parcours) => {
    parcoursOptions.value = parcours;
  });
});

defineExpose({
  openForm,
  closeForm,
});
</script>

<template>
  <div v-if="isOpen" class="custom-modal">
    <div class="card new-ue">
      <div class="card-header" style="background: #273656">
        <template v-if="ue && ue.ID"> Modification de l'UE </template>
        <template v-else> Nouvelle UE </template>
      </div>
      <div class="card-body">
        <div class="card-text mt-1 mb-1">
          <form>
            <CustomInput
              v-model="currentUe.NumeroUe"
              id="numeroue"
              libelle="Numéro"
              type="text"
              placeholder="Numéro d'UE"
              :error="formErrors.NumeroUe"
            />
            <CustomInput
              class="mt-2"
              v-model="currentUe.Intitule"
              id="intitule"
              libelle="Intitulé"
              type="text"
              placeholder="Intitulé de l'UE"
              :error="formErrors.Intitule"
            />
            <div class="form-group mt-2">
              <label for="parcours">Parcours :</label>
              <select
                v-model="currentUe.Parcours"
                class="form-control"
                id="parcours"
                multiple
              >
                <option v-for="parcours in parcoursOptions"
                        :key="parcours.ID"
                        :value="parcours">
                  {{ parcours.NomParcours }}
                </option>
              </select>
              <small class="form-text text-muted">
                Maintenez Ctrl pour sélectionner plusieurs parcours
              </small>
            </div>
          </form>
        </div>
        <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger"
                      @click="closeForm">
          Annuler
        </CustomButton>
        <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveUE">
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
  width: 300px;
}

.card-header {
  background: #273656;
  color: white;
  text-align: left;
}

.card-text {
  text-align: left;
}

select[multiple] {
  min-height: 100px;
}
</style>