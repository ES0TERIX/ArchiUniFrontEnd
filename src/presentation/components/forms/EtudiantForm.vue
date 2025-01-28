<script setup lang="ts">
import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { Etudiant } from '@/domain/entities/Etudiant';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import CustomModal from '@/presentation/components/modals/CustomModal.vue';
import { EtudiantDAO } from '@/domain/daos/EtudiantDAO';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
import type { Parcours } from '@/domain/entities/Parcours';

const currentEtudiant = ref<Etudiant>(new Etudiant(null, null, null, null));
const isOpen = ref(false);
const formErrors = ref<{
  NumeroEtudiant: string | null;
  NomEtudiant: string | null;
  parcours: string | null;
}>({
  NumeroEtudiant: null,
  NomEtudiant: null,
  parcours: null,
});

const parcoursOptions = ref<Parcours[]>([]);

const openForm = (etudiant: Etudiant | null = null) => {
  isOpen.value = true;
  if (etudiant) {
    currentEtudiant.value = etudiant;
  }
};

const closeForm = () => {
  isOpen.value = false;
  currentEtudiant.value = new Etudiant(null, null, null, null);
};

const saveEtudiant = () => {
  if (formErrors.value.NomEtudiant) {
    return;
  }

  if (currentEtudiant.value.ID) {
    // Mise à jour d'un étudiant
  } else {
    EtudiantDAO.getInstance().create(currentEtudiant.value).then((newEtudiant) => {
      alert('Étudiant créé avec succès');
      emit('create:etudiant', newEtudiant);
      closeForm();
    }).catch((ex) => {
      alert(ex.message);
    });
  }
};

const props = defineProps({
  etudiant: {
    type: Object as () => Etudiant | null,
    required: false,
    default: null,
  },
});

const emit = defineEmits(['create:etudiant', 'update:etudiant']);

onBeforeMount(() => {
  if (props.etudiant) {
    currentEtudiant.value = props.etudiant;
  }

  // Chargement de la liste des parcours
  ParcoursDAO.getInstance().list().then((parcours) => {
    parcoursOptions.value = parcours
  });
});

defineExpose({
  openForm,
  closeForm,
});

watch(() => props.etudiant, (newEtudiant) => {
  if (newEtudiant) {
    currentEtudiant.value = newEtudiant;
    openForm();
  }
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
</script>

<template>
  <CustomModal :isOpen="isOpen">
    <template v-slot:title>
      <template v-if="etudiant && etudiant.ID"> Modification de l'étudiant</template>
      <template v-else> Nouvel étudiant</template>
    </template>
    <template v-slot:body>
      <div class="text-start mt-1 mb-1">
        <form>
          <CustomInput v-model="currentEtudiant.NumeroEtudiant" class="mt-2" id="numeroetudiant" libelle="Numéro" type="text"
                       placeholder="Numéro d'étudiant" :error="formErrors.NumeroEtudiant" />
          <CustomInput v-model="currentEtudiant.NomEtudiant" id="nometudiant" libelle="Nom" type="text"
                       placeholder="Nom de l'étudiant" :error="formErrors.NomEtudiant" />
          <div class="form-group">
            <label for="parcours">Parcours :</label>
            <v-select label="NomParcours" v-model="currentEtudiant.Parcours"
                      :options="parcoursOptions"></v-select>
            <div v-if="formErrors.parcours" class="invalid-feedback">
              {{ formErrors.parcours }}
            </div>
          </div>
        </form>
      </div>
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.danger" @click="closeForm">
        Annuler
      </CustomButton>
      <CustomButton class="mt-1" style="margin-left: 5px" :color="BootstrapButtonEnum.primary" @click="saveEtudiant">
        Enregistrer
      </CustomButton>
    </template>
  </CustomModal>
</template>