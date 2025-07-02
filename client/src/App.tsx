import { useState } from 'react';
import CostAndUsageDashboard from './cost-and-usage/CostAndUsageDashboard';
import CustomerDashboard from './customer/CustomerDashboard';

function App() {
  const [currentDashboard, setCurrentDashboard] = useState<'cost-and-usage' | 'customers'>('cost-and-usage');

  if (currentDashboard === 'customers') {
    return <CustomerDashboard onSwitchToCostAndUsage={() => setCurrentDashboard('cost-and-usage')} />;
  }
  return <CostAndUsageDashboard onSwitchToCustomerDashboard={() => setCurrentDashboard('customers')} />;
}

export default App;
