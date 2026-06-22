import AdminMessagesPanel from '../../components/AdminMessagesPanel'

export default function AdminMessages({ apiUrl, adminToken }) {
  return (
    <div className="adm-panel admin-messages-page-wrap">
      <AdminMessagesPanel
        apiUrl={apiUrl}
        token={adminToken}
        variant="page"
      />
    </div>
  )
}
