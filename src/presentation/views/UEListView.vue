<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import UeForm from '@/presentation/components/forms/UEForm.vue';
import CustomTable from '../components/tables/CustomTable.vue';
import { UE } from '@/domain/entities/UE';
import { UeDAO } from '@/domain/daos/UEDAO';
import Swal from 'sweetalert2';

const ueForm = ref<typeof UeForm | null>(null);
const ue = ref<UE[]>([]);

const formatterEdition = (ue: UE) => {
  return '<i class="bi bi-pen-fill text-primary"></i>';
};

const formatterSuppression = (ue: UE) => {
  return '<i class="bi bi-trash-fill text-danger"></i>';
};

const formatterParcours = (ue: UE) => {
  return ue.Parcours?.map(p => p.NomParcours).join(', ') || '';
};

const onUeCreated = (newUe: UE) => {
  ue.value.unshift(newUe);
};

const onUeUpdate = (updatedUe: UE) => {
  const index = ue.value.findIndex((ue) => ue.ID === updatedUe.ID);
  ue.value[index] = updatedUe;
};

const onDeleteUe = (u: UE) => {
  Swal.fire({
    title: 'Êtes-vous sûr de vouloir supprimer cette UE ?',
    showCancelButton: true,
    confirmButtonText: 'Supprimer',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      UeDAO.getInstance().delete(u.ID!).then(() => {
        ue.value = ue.value.filter((ue) => ue.ID !== u.ID);
      }).catch(() => {
        alert('Une erreur est survenue lors de la suppression de l\'UE');
      });
    }
  })
}

const columns = [
  { field: 'EditionUe', label: 'Edition', formatter: formatterEdition, onClick: (u: UE) => ueForm.value?.openForm(u), style: 'width: 5px; text-align: center;' },
  { field: 'ID', label: 'ID', formatter: null, onClick: null, style: null },
  { field: 'NumeroUe', label: 'Numéro', formatter: null, onClick: null, style: null },
  { field: 'Intitule', label: 'Intitulé', formatter: null, onClick: null, style: null },
  { field: 'parcours', label: 'Parcours', formatter: formatterParcours, onClick: null, style: null },
  { field: 'DeleteUe', label: 'Suppression', formatter: formatterSuppression, onClick: onDeleteUe, style: 'width: 5px; text-align: center;' },
]

onMounted(() => {
  UeDAO.getInstance().list().then((data) => {
    ue.value = data;
  });
});
</script>

<template>
  <div class="container-fluid">
    <div class="card mt-5">
      <div class="card-header">
        <div class="card-title">
          <h4>Liste des UEs</h4>
        </div>
        <CustomButton :color="BootstrapButtonEnum.info" @click="() => ueForm?.openForm()">
          Ajouter une UE
        </CustomButton>
      </div>
      <div class="card-body">
        <CustomTable idAttribute="ID" :columns="columns" :data="ue" />
      </div>
    </div>
  </div>
  <ueForm ref="ueForm" @create:ue="onUeCreated" @update:ue="onUeUpdate" />
</template>