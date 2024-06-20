import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExtensionSlot, usePatient } from '@openmrs/esm-framework';
import styles from './claims-header.scss';
import ClaimMainComponent from '../../claims-wrap/claims-main-component';
import { MappedBill } from '../../../types';
import ClaimsPeriod from '../claims-period/claims-period.component';
import { usePatientBillsByPeriod } from '../../../billing.resource';
import { BillsProvider, useBillsContext } from '../claims-period/bills-context';
import isEqual from 'lodash-es/isEqual';

interface ClaimsHeaderProps {
  patient?: fhir.Patient;
  bill: MappedBill;
}

const ClaimsHeaderContent: React.FC<ClaimsHeaderProps> = ({ patient, bill }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const claimUuid = searchParams.get('claimUuid');
  const { patient: currentPatient, isLoading: isLoadingPatient } = usePatient();
  const [dateRange, setDateRange] = useState<{ startDate: string | null; endDate: string | null }>({
    startDate: null,
    endDate: null,
  });
  const { bills, setBills } = useBillsContext();
  const { bills: fetchedBills, isLoading } = usePatientBillsByPeriod(
    currentPatient?.id,
    dateRange.startDate,
    dateRange.endDate,
  );
  useEffect(() => {
    if (!isEqual(fetchedBills, bills)) {
      setBills(fetchedBills);
    }
  }, [fetchedBills, setBills, bills]);

  const handleSetDateRange = (startDate: string | null, endDate: string | null) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <div className={styles.claimContainer}>
      {patient && <ExtensionSlot name="patient-header-slot" state={{ patientUuid: patient.id, patient }} />}
      <div className={styles.detailsContainer}>
        <span className={styles.claimTitle}> {t('createClaim', 'Create Claim')}</span>
      </div>
      {claimUuid && <ClaimsPeriod onSetDateRange={handleSetDateRange} />}
      <ClaimMainComponent bill={bill} />
    </div>
  );
};

const ClaimsHeader: React.FC<ClaimsHeaderProps> = (props) => {
  return (
    <BillsProvider>
      <ClaimsHeaderContent {...props} />
    </BillsProvider>
  );
};

export default ClaimsHeader;
