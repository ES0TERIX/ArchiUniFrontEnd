<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import EtudiantForm from '@/presentation/components/forms/EtudiantForm.vue';
import CustomTable from '../components/tables/CustomTable.vue';
import { Etudiant } from '@/domain/entities/Etudiant';
import { EtudiantDAO } from '@/domain/daos/EtudiantDAO';
import Swal from 'sweetalert2';

const etudiantForm = ref<typeof EtudiantForm | null>(null);
const etudiants = ref<Etudiant[]>([]);

const formatterEdition = (etudiant: Etudiant) => {
  return '<i class="bi bi-pen-fill text-primary"></i>';
};

const formatterSuppression = (etudiant: Etudiant) => {
  return '<i class="bi bi-trash-fill text-danger"></i>';
};

const formatterParcours = (etudiant: Etudiant) => {
  return etudiant.Parcours?.NomParcours || '';
};

const onEtudiantCreated = (newEtudiant: Etudiant) => {
  etudiants.value.unshift(newEtudiant);
};

const onEtudiantUpdate = (updatedEtudiant: Etudiant) => {
  const index = etudiants.value.findIndex((etudiant) => etudiant.ID === updatedEtudiant.ID);
  etudiants.value[index] = updatedEtudiant;
};

const onDeleteEtudiant = (e: Etudiant) => {
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cet étudiant ?',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      EtudiantDAO.getInstance().delete(e.ID!).then(() => {
        etudiants.value = etudiants.value.filter((etudiant) => etudiant.ID !== e.ID);
      }).catch(() => {
        alert('Une erreur est survenue lors de la suppression de l\'étudiant');
      });
    }
  })
}

const columns = [
  { field: 'EditionEtudiant', label: 'Edition', formatter: formatterEdition, onClick: (e: Etudiant) => etudiantForm.value?.openForm(e), style: 'width: 5px; text-align: center;' },
  { field: 'ID', label: 'ID', formatter: null, onClick: null, style: null },
  { field: 'NumeroEtudiant', label: 'Numéro', formatter: null, onClick: null, style: null },
  { field: 'NomEtudiant', label: 'Nom', formatter: null, onClick: null, style: null },
  { field: 'parcours', label: 'Parcours', formatter: formatterParcours, onClick: null, style: null },
  { field: 'DeleteEtudiant', label: 'Suppression', formatter: formatterSuppression, onClick: onDeleteEtudiant, style: 'width: 5px; text-align: center;' },
]

onMounted(() => {
  EtudiantDAO.getInstance().list().then((data) => {
    etudiants.value = data;
  });
});
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header">
        <div class="card-title">
          <h4>Liste des étudiants</h4>
        </div>
        <CustomButton :color="BootstrapButtonEnum.info" @click="() => etudiantForm?.openForm()">
          Ajouter un étudiant
        </CustomButton>
      </div>
      <div class="card-body">
        <CustomTable idAttribute="ID" :columns="columns" :data="etudiants" />
      </div>
    </div>
  </div>
  <etudiantForm ref="etudiantForm" @create:etudiant="onEtudiantCreated" @update:etudiant="onEtudiantUpdate" />
</template>