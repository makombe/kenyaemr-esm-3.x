import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, Tile, DataTableSkeleton } from '@carbon/react';
import styles from './referral-chart-view.component.scss';
import { formatDate, isDesktop, useLayoutType, usePatient } from '@openmrs/esm-framework';
import { EmptyDataIllustration } from '@openmrs/esm-patient-common-lib';
import { useCommunityReferral } from '../community-refferals.resource';

export interface ReferralReasonsDialogPopupProps {
  patientUuid: string;
}

const ReferralReasonsView: React.FC<ReferralReasonsDialogPopupProps> = ({ patientUuid }) => {
  const { patient } = usePatient(patientUuid);
  const { t } = useTranslation();
  const layout = useLayoutType();
  const patientNupiNumber = patient?.identifier.find((item) => {
    return item.type.coding.some((coding) => coding.code === 'f85081e2-b4be-4e48-b3a4-7994b69bb101'); // nupi identifier
  })?.value;
  const { referral, isLoading, isValidating } = useCommunityReferral(patientNupiNumber);

  const headerTitle = t('referral', 'Referrals');

  if (isLoading) {
    return <DataTableSkeleton rowCount={5} />;
  }
  if (referral == null) {
    return (
      <Layer>
        <Tile className={styles.tile}>
          <div className={!isDesktop(layout) ? styles.tabletHeading : styles.desktopHeading}>
            <h4>{headerTitle}</h4>
          </div>
          <EmptyDataIllustration />
          <p className={styles.content}>There is no referral data to display for this patient.</p>
        </Tile>
      </Layer>
    );
  }
  return (
    <Layer>
      <Tile>
        <div className={!isDesktop(layout) ? styles.tabletHeading : styles.desktopHeading}>
          <h4>{headerTitle}</h4>
        </div>
        <div className={styles.container}>
          <div className={styles.content}>
            <p>{t('referralDate', 'Referral Date')} </p>
            <p>
              <span className={styles.value}>{formatDate(new Date(referral?.referralReasons?.referralDate))}</span>
            </p>
          </div>
          <div className={styles.content}>
            <p> {t('status', 'Status')}</p>
            <p>
              <span className={styles.value}> {referral?.status} </span>
            </p>
          </div>

          <div className={styles.content}>
            <p> {t('ReasonCode', 'Reason Code')}</p>
            <p>
              <span className={styles.value}> {referral?.referralReasons?.reasonCode} </span>
            </p>
          </div>
          <div className={styles.content}>
            <p> {t('clinicalNote', 'Clinical Note')}</p>
            <p>
              <span className={styles.value}> {referral?.referralReasons?.clinicalNote} </span>
            </p>
          </div>
          <div className={styles.content}>
            <p> {t('referredFrom', 'Referred From')}</p>
            <p>
              <span className={styles.value}> {referral?.referredFrom} </span>
            </p>
          </div>
        </div>
      </Tile>
    </Layer>
  );
};

export default ReferralReasonsView;
