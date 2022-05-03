const AdminLayout = ({ children }) => {
  return <>
  {children}
  <style global jsx>{`
  :root {
    font-size: 16px !important;
  }
  body {
    font-size: 1rem;
  }
  `}</style>
  </>
}

export default AdminLayout;
