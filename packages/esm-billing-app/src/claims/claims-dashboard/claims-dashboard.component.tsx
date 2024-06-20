import React from 'react';
import { useTranslation } from 'react-i18next';
import ClaimsDashboardHeader from './claims-dashboard-header/claims-dashboard-header.component';
import ClaimsDashboardTable from './claims-dashboard-table/claims-dashboard-table.component';
import styles from './claims-dashboard.scss';

function ClaimsDashboard() {
  const { t } = useTranslation();

  return (
    <main>
      <ClaimsDashboardHeader title={t('home', 'Home')} />
      <main className={styles.claimsTableContainer}>
        <ClaimsDashboardTable defaultBillPaymentStatus="PENDING" />
      </main>
    </main>
  );
}
export default ClaimsDashboard;
