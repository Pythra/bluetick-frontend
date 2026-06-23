import { MdDashboard, MdPeople, MdShoppingCart, MdInventory2, MdArticle, MdEditNote, MdEmail, MdHandshake, MdLogout, MdChat, MdInsertChart, MdReceipt, MdStorefront } from 'react-icons/md'
import '../../styles/admin.css'

const menuItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
	{ id: 'users', label: 'User Management', icon: MdPeople },
	{ id: 'carts', label: 'Shopping Carts', icon: MdShoppingCart },
	{ id: 'orders', label: 'Orders', icon: MdInventory2 },
	{ id: 'services', label: 'Services', icon: MdStorefront },
	{ id: 'invoices', label: 'Invoices', icon: MdReceipt },
	{ id: 'submissions', label: 'Submissions', icon: MdArticle },
	{ id: 'partnerships', label: 'Partnerships', icon: MdHandshake },
	{ id: 'messages', label: 'Messages', icon: MdChat },
	{ id: 'reports', label: 'Reports', icon: MdInsertChart },
	{ id: 'blog', label: 'Blog', icon: MdEditNote },
	{ id: 'broadcast', label: 'Email Broadcast', icon: MdEmail },
]

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, brandName = 'Bluetick', brandSub = 'Admin Panel' }) => {
	const handleMenuItemClick = (tabId) => {
		setActiveTab(tabId)
		if (window.innerWidth <= 1024) {
			setIsOpen(false)
		}
	}

	return (
		<>
			{isOpen && <div className="adm-overlay" onClick={() => setIsOpen(false)} />}

			<aside className={`adm-sidebar${isOpen ? ' open' : ''}`}>
				<div className="adm-sidebar-brand">
					<div className="adm-sidebar-brand-badge">{brandName.charAt(0).toUpperCase()}</div>
					<div>
						<div className="adm-sidebar-brand-name">{brandName}</div>
						<div className="adm-sidebar-brand-sub">{brandSub}</div>
					</div>
				</div>

				<nav className="adm-nav">
					{menuItems.map((item) => {
						const IconComponent = item.icon
						return (
							<button
								key={item.id}
								type="button"
								className={`adm-nav-item${item.id === activeTab ? ' active' : ''}`}
								onClick={() => handleMenuItemClick(item.id)}
							>
								<IconComponent size={20} />
								<span>{item.label}</span>
							</button>
						)
					})}

					<button
						type="button"
						className="adm-nav-item danger"
						onClick={() => handleMenuItemClick('signout')}
					>
						<MdLogout size={20} />
						<span>Sign out</span>
					</button>
				</nav>
			</aside>
		</>
	)
}
