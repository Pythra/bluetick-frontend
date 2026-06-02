import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { HOME_SERVICE_MENU_ITEMS } from '../data/serviceRoutes';
import './PlaceOrderDropdown.css';

function PlaceOrderDropdown({
  label = 'Place Order',
  triggerClassName = 'landing-btn landing-btn-primary place-order-dropdown-trigger',
  menuId = 'place-order-dropdown-menu',
}) {
  const navigate = useNavigate();
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);

  const updateMenuPosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuWidth = Math.min(360, window.innerWidth - 24);
    const viewportPadding = 12;
    let left = rect.left;

    if (left + menuWidth > window.innerWidth - viewportPadding) {
      left = window.innerWidth - menuWidth - viewportPadding;
    }
    if (left < viewportPadding) {
      left = viewportPadding;
    }

    setMenuPosition({
      top: rect.bottom + 8,
      left,
      width: menuWidth,
    });
  };

  const toggleOpen = () => {
    if (!open) {
      updateMenuPosition();
      setOpen(true);
      return;
    }
    setOpen(false);
  };

  useLayoutEffect(() => {
    if (!open) return undefined;
    updateMenuPosition();

    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleSelect = (item) => {
    setOpen(false);
    navigate(item.path);
  };

  const menu =
    open && menuPosition
      ? createPortal(
          <ul
            ref={menuRef}
            id={menuId}
            className="place-order-dropdown-menu place-order-dropdown-menu--portal"
            role="listbox"
            aria-label="Choose a service"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
            {HOME_SERVICE_MENU_ITEMS.map((item) => (
              <li key={item.path} role="option">
                <button type="button" onClick={() => handleSelect(item)}>
                  <span className="place-order-dropdown-label">{item.label}</span>
                  <span className="place-order-dropdown-desc">{item.description}</span>
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )
      : null;

  return (
    <div className="place-order-dropdown">
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={menuId}
      >
        {label}
      </button>
      {menu}
    </div>
  );
}

export default PlaceOrderDropdown;
