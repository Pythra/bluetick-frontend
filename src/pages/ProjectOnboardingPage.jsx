import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { IoCheckmarkCircle, IoDocumentTextOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import DynamicProjectForm from '../components/DynamicProjectForm';
import { FORM_TYPES } from '../data/projectOnboardingForms';
import './ProjectOnboardingPage.css';

function ProjectOnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { isAuthenticated, apiUrl, authFetch, user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTaskId, setActiveTaskId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setError('Order ID is missing. Open the link from your payment confirmation email.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await authFetch(`${apiUrl}/api/orders/${orderId}`);
      const data = await response.json();
      if (!response.ok || !data.success || !data.order) {
        throw new Error(data.error || 'Unable to load order');
      }
      if (data.order.paymentStatus !== 'paid') {
        throw new Error('Payment must be confirmed before you can submit project details.');
      }
      setOrder(data.order);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load order');
    } finally {
      setLoading(false);
    }
  }, [orderId, apiUrl, authFetch]);

  useEffect(() => {
    if (!isAuthenticated) {
      const returnPath = `/project-onboarding?orderId=${orderId || ''}`;
      navigate('/login', { state: { from: returnPath } });
      return;
    }
    loadOrder();
  }, [isAuthenticated, navigate, orderId, loadOrder]);

  const handleTaskSelect = (task) => {
    setSuccessMessage('');
    if (task.formType === FORM_TYPES.PUBLICATION || task.href === 'article-submission') {
      navigate(`/article-submission?orderId=${orderId}`);
      return;
    }
    setActiveTaskId(task.id);
  };

  const handleFormSuccess = async () => {
    setSuccessMessage('Saved successfully.');
    setActiveTaskId('');
    await loadOrder();
  };

  const activeTask = order?.onboardingTasks?.find((task) => task.id === activeTaskId);
  const clientProfileDefaults = {
    fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim(),
    email: user?.email || order?.email || '',
    phone: user?.phone || '',
    ...(order?.clientProfile || {}),
  };

  const scrollToSection = () => navigate('/');

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="project-onboarding-page">
      <Navbar onScrollToSection={scrollToSection} />

      <main className="project-onboarding-main">
        <div className="project-onboarding-shell">
          <header className="project-onboarding-header">
            <h1>Submit your project details</h1>
            <p>
              Payment confirmed. Complete each step below so our team can start your order.
              Forms change automatically based on the services you purchased.
            </p>
            {order?.productName ? (
              <p className="project-onboarding-order-ref">
                Order: <strong>{order.productName}</strong>
              </p>
            ) : null}
          </header>

          {loading ? <p className="project-onboarding-status">Loading order…</p> : null}
          {error ? (
            <p className="project-onboarding-error" role="alert">
              {error}
            </p>
          ) : null}

          {!loading && !error && order && !activeTaskId && (
            <>
              {order.onboardingComplete ? (
                <div className="project-onboarding-complete">
                  <IoCheckmarkCircle aria-hidden="true" />
                  <h2>All requirements submitted</h2>
                  <p>Our team is reviewing your details and will update you on progress.</p>
                  <Button type="button" onClick={() => navigate('/account')}>
                    View your account
                  </Button>
                </div>
              ) : (
                <>
                  {successMessage ? (
                    <p className="project-onboarding-success" role="status">
                      {successMessage}
                    </p>
                  ) : null}
                  <ul className="project-onboarding-task-list">
                    {(order.onboardingTasks || []).map((task) => (
                      <li
                        key={task.id}
                        className={`project-onboarding-task${task.status === 'submitted' ? ' is-done' : ''}`}
                      >
                        <div className="project-onboarding-task-text">
                          <IoDocumentTextOutline aria-hidden="true" />
                          <div>
                            <strong>{task.label}</strong>
                            <span>
                              {task.status === 'submitted' ? 'Submitted' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        {task.status === 'pending' ? (
                          <Button type="button" onClick={() => handleTaskSelect(task)}>
                            {task.formType === FORM_TYPES.PUBLICATION
                              ? 'Submit article'
                              : 'Fill form'}
                          </Button>
                        ) : (
                          <span className="project-onboarding-task-done">Done</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}

          {!loading && !error && order && activeTask && (
            <DynamicProjectForm
              formType={activeTask.formType}
              taskLabel={activeTask.label}
              itemId={activeTask.itemId}
              orderId={orderId}
              apiUrl={apiUrl}
              authFetch={authFetch}
              initialValues={
                activeTask.formType === FORM_TYPES.CLIENT_PROFILE
                  ? clientProfileDefaults
                  : undefined
              }
              onSuccess={handleFormSuccess}
              onCancel={() => setActiveTaskId('')}
            />
          )}

          <p className="project-onboarding-help">
            Need help? Email{' '}
            <a href="mailto:info@bluetickgeng.com">info@bluetickgeng.com</a> or{' '}
            <Link to="/account">view your account</Link>.
          </p>
        </div>
      </main>

      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default ProjectOnboardingPage;
