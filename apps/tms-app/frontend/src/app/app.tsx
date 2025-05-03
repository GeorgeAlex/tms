import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionsTable from '../components/TransactionsTable';
import Nav from '../components/Nav';
import CreateTransactionForm from '../components/CreateTransactionForm';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/transactions" element={<TransactionsTable />} />
      <Route path="/create-transaction" element={<CreateTransactionForm />} />
      <Route path="*" element={<TransactionsTable />} /> 
    </Routes>
  );
}

export function App() {
  return (
    <Router>
      <Nav />
      <AppRoutes />
    </Router>
  );
}

export default App;

// import TransactionsTable from '../components/TransactionsTable';
// import Nav from '../components/Nav';
// import CreateTransactionForm from '../components/CreateTransactionForm';
// import React from 'react';

// export function App() {
//   return (
//     <React.Fragment>
//       <Nav />
//       <TransactionsTable />
//       <CreateTransactionForm />
//     </React.Fragment>
//   );
// }

// export default App;

