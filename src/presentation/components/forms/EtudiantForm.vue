<script setup lang="ts">
import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { Etudiant } from '@/domain/entities/Etudiant';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import { EtudiantDAO } from '@/domain/daos/EtudiantDAO';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
import type { Parcours } from '@/domain/entities/Parcours';

const currentEtudiant = ref<Etudiant>(new Etudiant(null, null, null, null));
const isOpen = ref(false);
const parcoursOptions = ref<Parcours[]>([]);

const openForm = (etudiant: Etudiant | null = null) => {
  isOpen.value = true;
  if (etudiant) {
    currentEtudiant.value = new Etudiant(
      etudiant.ID,
      etudiant.NomEtudiant,
      etudiant.NumeroEtudiant,
      etudiant.Parcours
    );
  } else {
    currentEtudiant.value = new Etudiant(null, null, null, null);
  }
};

const closeForm = () => {
  isOpen.value = false;
  currentEtudiant.value = new Etudiant(null, null, null, null);
};

const emit = defineEmits(['create:etudiant', 'update:etudiant']);

const saveEtudiant = async () => {
  if (formErrors.value.NumeroEtudiant || formErrors.value.NomEtudiant || !currentEtudiant.value.Parcours) {
    alert('Veuillez corriger les erreurs avant de sauvegarder');
    return;
  }

  try {
    if (currentEtudiant.value.ID) {
      const updatedEtudiant = await EtudiantDAO.getInstance().update(
        currentEtudiant.value.ID,
        currentEtudiant.value
      );
      emit('update:etudiant', updatedEtudiant);
      alert('Étudiant modifié avec succès');
    } else {
      const newEtudiant = await EtudiantDAO.getInstance().create(currentEtudiant.value);
      emit('create:etudiant', newEtudiant);
      alert('Étudiant créé avec succès');
    }
    closeForm();
  } catch (ex: any) {
    alert(ex.message);
  }
};

const props = defineProps({
  etudiant: {
    type: Object as () => Etudiant | null,
    required: false,
    default: null,
  },
});

const formErrors = ref<{
  NumeroEtudiant: string | null;
  NomEtudiant: string | null;
}>({
  NumeroEtudiant: null,
  NomEtudiant: null,
});

watch(() => currentEtudiant.value.NomEtudiant, () => {
  if (!currentEtudiant.value.NomEtudiant || currentEtudiant.value.NomEtudiant.trim() === '' || currentEtudiant.value.NomEtudiant.length < 3) {
    formErrors.value.NomEtudiant = 'Le nom doit faire au moins 3 caractères';
  } else {
    formErrors.value.NomEtudiant = null;
  }
});

watch(() => currentEtudiant.value.NumeroEtudiant, () => {
  if (!currentEtudiant.value.NumeroEtudiant || currentEtudiant.value.NumeroEtudiant.trim() === '' || currentEtudiant.value.NumeroEtudiant.length < 3) {
    formErrors.value.NumeroEtudiant = 'Le numéro d\'étudiant doit faire au moins 3 caractères';
  } else {
    formErrors.value.NumeroEtudiant = null;
  }
});

onBeforeMount(() => {
  if (props.etudiant) {
    // Create a new instance to avoid reference issues
    currentEtudiant.value = new Etudiant(
      props.etudiant.ID,
      props.etudiant.NomEtudiant,
      props.etudiant.NumeroEtudiant,
      props.etudiant.Parcours
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
    <div class="card new-etudiant">
      <div class="card-header" style="background: #273656">
        <template v-if="etudiant && etudiant.ID"> Modification de l'étudiant </template>
        <template v-else> Nouvel étudiant </template>
      </div>
      <div class="card-body">
        <div class="card-text mt-1 mb-1">
          <form>
            <CustomInput
              v-model="currentEtudiant.NumeroEtudiant"
              id="numeroetudiant"
              libelle="Numéro"
              type="text"
              placeholder="Numéro d'étudiant"
              :error="formErrors.NumeroEtudiant"
            />
            <CustomInput
              class="mt-2"
              v-model="currentEtudiant.NomEtudiant"
              id="nometudiant"
              libelle="Nom"
              type="text"
              placeholder="Nom de l'étudiant"
              :error="formErrors.NomEtudiant"
            />
            <div class="form-group mt-2">
              <label for="parcours">Parcours :</label>
              <select
                v-model="currentEtudiant.Parcours"
                class="form-control"
                id="parcours"
              >
                <option value="" disabled selected>Sélectionnez un parcours</option>
                <option v-for="parcours in parcoursOptions"
                        :key="parcours.ID"
                        :value="parcours">
                  {{ parcours.NomParcours }}
                </option>
              </select>
            </div>
          </form>
        </div>
        <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger"
                      @click="closeForm">
          Annuler
        </CustomButton>
        <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveEtudiant">
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
</style>