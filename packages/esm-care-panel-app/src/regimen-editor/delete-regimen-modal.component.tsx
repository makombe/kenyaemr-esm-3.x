import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { showNotification, showToast } from '@openmrs/esm-framework';
import { deleteEncounter } from './regimen.resource';
import { mutate } from 'swr';
import { closeOverlay } from '../hooks/useOverlay';

interface deleteRegimenModalProps {
  closeCancelModal: () => void;
  regimenEncounterUuid: string;
  patientUuid: string;
  category: string;
}

const DeleteRegimenModal: React.FC<deleteRegimenModalProps> = ({
  closeCancelModal,
  regimenEncounterUuid,
  patientUuid,
  category,
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = useCallback(
    (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      deleteEncounter(regimenEncounterUuid)
        .then((response) => {
          if (response.status === 204) {
            closeCancelModal();
            showToast({
              critical: true,
              kind: 'success',
              description: t('regimenDeletedSuccessfully', 'Regimen successfully'),
              title: t('regimenDeleted', 'Regimen deleted'),
            });
            mutate(`/ws/rest/v1/kenyaemr/regimenHistory?patientUuid=${patientUuid}&category=${category}`);
            mutate(`/ws/rest/v1/kenyaemr/currentProgramDetails?patientUuid=${patientUuid}`);
            mutate(`/ws/rest/v1/kenyaemr/patientSummary?patientUuid=${patientUuid}`);
            closeOverlay();
          }
        })
        .catch((err) => {
          showNotification({
            title: t('regimenDeletedError', 'Error deleting regimen'),
            kind: 'error',
            critical: true,
            description: err?.message,
          });
        });
    },
    [t, regimenEncounterUuid, closeCancelModal, category, patientUuid],
  );

  return (
    <div>
      <ModalHeader closeModal={closeCancelModal} title={t('deleteRegimen', 'Delete Regimen')} />
      <ModalBody>
        <p>{t('deleteRegimenModalConfirmationText', 'Are you sure you want to delete regimen?')}</p>
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeCancelModal}>
          {t('discard', 'Discard')}
        </Button>
        <Button kind="danger" onClick={handleCancel} disabled={isSubmitting}>
          {t('deleteRegimen', 'Delete Regimen')}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default DeleteRegimenModal;
