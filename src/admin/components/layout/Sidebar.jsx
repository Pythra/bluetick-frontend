import React from 'react'
import { Logo } from '../ui/Logo'
import { MdDashboard, MdPeople, MdShoppingCart, MdInventory2, MdArticle, MdLogout } from 'react-icons/md'

const menuItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: MdDashboard },
	{ id: 'users', label: 'User Management', icon: MdPeople },
	{ id: 'carts', label: 'Shopping Carts', icon: MdShoppingCart },
	{ id: 'orders', label: 'Orders', icon: MdInventory2 },
	{ id: 'submissions', label: 'Submissions', icon: MdArticle },
	{ id: 'signout', label: 'Sign out', icon: MdLogout },
]

export const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
	const handleMenuItemClick = (tabId) => {
		setActiveTab(tabId)
		// Close sidebar on mobile after clicking an item
		if (window.innerWidth <= 768) {
			setIsOpen(false)
		}
	}

	return (
		<>
			{/* Overlay for mobile */}
			{isOpen && (
				<div
					onClick={() => setIsOpen(false)}
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						zIndex: 98,
					}}
					className="mobile-overlay"
				/>
			)}

			{/* Sidebar */}
			<div
				style={{
					width: 'clamp(280px, 100vw, 380px)',
					minHeight: '100vh',
					backgroundColor: 'white',
					boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
					display: 'flex',
					flexDirection: 'column',
					padding: '24px 0',
					position: 'fixed',
					left: isOpen ? 0 : '-100%',
					top: 0,
					height: '100vh',
					overflowY: 'auto',
					zIndex: 100,
					transition: 'left 0.3s ease',
					flexShrink: 0,
				}}
				className="sidebar"
			>
				<div style={{ padding: '0 24px', marginBottom: '32px'}}>
					<Logo />
				</div>

				<nav style={{ padding: '0 16px', flex: 1 }}>
					<ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
						{menuItems.map((item) => {
							const isActive = item.id === activeTab
							const IconComponent = item.icon
							return (
								<li key={item.id} style={{ marginBottom: '24px' }}>
									<button
										onClick={() => handleMenuItemClick(item.id)}
										style={{
											width: '100%',
											display: 'flex',
											alignItems: 'center',
											fontSize: '16px',
											gap: '16px',
											padding: '10px 12px',
											borderRadius: '8px',
											border: 'none',
											textAlign: 'left',
											cursor: 'pointer',
											backgroundColor: isActive ? '#0066FF' : 'white',
											transition: 'all 0.2s ease',
										}}
									>
										<IconComponent size={24} style={{
											color: isActive ? 'white' : '#121212',
											flexShrink: 0
										}} />
										<span style={{ 
											fontSize: '16px', 
											fontWeight: '600', 
											lineHeight:'24px',
											color: isActive ? '#ffffff' : item.id === 'signout' ? '#FF0000' : '#121212'
										}}>
											{item.label}
										</span>
									</button>
								</li>
							)
						})}
					</ul>
				</nav>
			</div>

			{/* Inline styles for media queries */}
			<style>{`
				@media (max-width: 768px) {
					.mobile-menu-btn {
						display: flex !important;
					}
				}

				@media (min-width: 769px) {
					.mobile-menu-btn {
						display: none !important;
					}
					.mobile-overlay {
						display: none !important;
					}
					.sidebar {
						position: relative !important;
						left: 0 !important;
						top: 0 !important;
						height: auto !important;
						min-height: auto !important;
						width: 380px !important;
						max-width: 380px !important;
						margin-left: 0 !important;
						flex-shrink: 0 !important;
					}
				}
			`}</style>
		</>
	)
}
