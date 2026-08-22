/* ==========================================================================
   ENTERPRISE POLICY ADMINISTRATION & CUSTOMER SERVICE PLATFORM
   Application Logic & State Management
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initial State & Data Store
    const state = {
        theme: 'dark',
        activeView: 'dashboard',
        policies: [
            { id: 'POL-99201', name: 'Apex Global Logistics Corp', type: 'Commercial Auto', limit: '$5,000,000', premium: '$24,500', date: '2026-01-15', status: 'active' },
            { id: 'POL-99202', name: 'Titan Tech Industries LLC', type: 'Cyber Risk', limit: '$10,000,000', premium: '$48,000', date: '2026-02-01', status: 'active' },
            { id: 'POL-99203', name: 'Vanguard Medical Group', type: 'General Liability', limit: '$3,000,000', premium: '$18,200', date: '2025-11-20', status: 'pending' },
            { id: 'POL-99204', name: 'Starlight Retail Partners', type: 'Property & Casualty', limit: '$2,500,000', premium: '$12,800', date: '2025-06-10', status: 'active' },
            { id: 'POL-99205', name: 'Horizon Shipping Freight', type: 'Commercial Auto', limit: '$1,500,000', premium: '$9,400', date: '2024-03-12', status: 'expired' }
        ],
        claims: [
            { id: 'CLM-4091', policy: 'POL-99201', entity: 'Apex Global Logistics', title: 'Vehicle Fleet Collision Loss', amount: '$42,500', stage: 'submitted' },
            { id: 'CLM-4092', policy: 'POL-99204', entity: 'Starlight Retail', title: 'Warehouse Water Leakage Claim', amount: '$18,900', stage: 'submitted' },
            { id: 'CLM-4093', policy: 'POL-99202', entity: 'Titan Tech', title: 'Ransomware Recovery Expense', amount: '$85,000', stage: 'assessment' },
            { id: 'CLM-4094', policy: 'POL-99203', entity: 'Vanguard Medical', title: 'Facility Liability Incident', amount: '$12,400', stage: 'approved' },
            { id: 'CLM-4095', policy: 'POL-99205', entity: 'Horizon Shipping', title: 'Cargo Transit Damage', amount: '$31,000', stage: 'settled' }
        ],
        tickets: [
            { id: 'TCK-8801', customer: 'Sarah Jenkins (Apex Global)', subject: 'Request Endorsement for New Commercial Driver', channel: 'Portal', priority: 'High', agent: 'Chaithanya', status: 'in_progress' },
            { id: 'TCK-8802', customer: 'Robert Vance (Titan Tech)', subject: 'Cyber Policy Premium Billing Query', channel: 'Email', priority: 'Medium', agent: 'Chaithanya', status: 'open' },
            { id: 'TCK-8803', customer: 'Elena Rostova (Vanguard)', subject: 'Certificate of Insurance Request (COI)', channel: 'Chat', priority: 'Low', agent: 'Alex Mercer', status: 'resolved' },
            { id: 'TCK-8804', customer: 'David Kim (Starlight Retail)', subject: 'Claim Filing Status Inquiry #CLM-4092', channel: 'Phone', priority: 'High', agent: 'Chaithanya', status: 'open' }
        ]
    };

    // DOM Elements
    const elements = {
        sidebar: document.getElementById('sidebar'),
        navItems: document.querySelectorAll('.nav-item'),
        viewSections: document.querySelectorAll('.view-section'),
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        tickerConsole: document.getElementById('ticker-console'),
        
        // Tables
        policyTableBody: document.getElementById('policy-table-body'),
        ticketTableBody: document.getElementById('ticket-table-body'),
        
        // Filters
        policySearch: document.getElementById('policy-search-input'),
        policyStatusFilter: document.getElementById('policy-status-filter'),
        policyTypeFilter: document.getElementById('policy-type-filter'),
        ticketSearch: document.getElementById('ticket-search-input'),
        ticketPriorityFilter: document.getElementById('ticket-priority-filter'),
        
        // Modals
        modalPolicy: document.getElementById('modal-policy'),
        btnModalNewPolicy: document.getElementById('btn-modal-new-policy'),
        btnQuickNewPolicy: document.getElementById('btn-quick-new-policy'),
        closePolicyModal: document.getElementById('close-policy-modal'),
        cancelPolicyModal: document.getElementById('cancel-policy-modal'),
        formNewPolicy: document.getElementById('form-new-policy'),
        
        // Badges & Counters
        badgePoliciesCount: document.getElementById('badge-policies-count'),
        badgeClaimsCount: document.getElementById('badge-claims-count'),
        badgeTicketsCount: document.getElementById('badge-tickets-count'),

        // Toast Container
        toastContainer: document.getElementById('toast-container')
    };

    /* -------------------------------------------------------------------------- */
    /* 1. Theme Management                                                        */
    /* -------------------------------------------------------------------------- */
    function toggleTheme() {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        elements.themeIcon.className = state.theme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
        showToast(`Switched to ${state.theme.toUpperCase()} theme mode.`, 'info');
    }

    elements.themeToggle.addEventListener('click', toggleTheme);

    /* -------------------------------------------------------------------------- */
    /* 2. Navigation & View Switching                                              */
    /* -------------------------------------------------------------------------- */
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const viewTarget = item.getAttribute('data-view');
            if (!viewTarget) return;

            elements.navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            elements.viewSections.forEach(section => {
                if (section.id === `view-${viewTarget}`) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });

            state.activeView = viewTarget;
            addTickerLog(`VIEW_CHANGE: Navigated to [${viewTarget.toUpperCase()}] view module.`);
        });
    });

    /* -------------------------------------------------------------------------- */
    /* 3. Ticker Log Console                                                      */
    /* -------------------------------------------------------------------------- */
    function addTickerLog(message) {
        if (!elements.tickerConsole) return;
        const now = new Date();
        const timestamp = `[${now.toTimeString().split(' ')[0]}]`;
        const line = document.createElement('div');
        line.className = 'ticker-line';
        line.innerHTML = `<span class="ticker-timestamp">${timestamp}</span> ${message}`;
        elements.tickerConsole.prepend(line);
    }

    /* -------------------------------------------------------------------------- */
    /* 4. Toast Notification System                                              */
    /* -------------------------------------------------------------------------- */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'ri-checkbox-circle-line';
        if (type === 'warning') icon = 'ri-alert-line';
        if (type === 'danger') icon = 'ri-error-warning-line';
        if (type === 'info') icon = 'ri-information-line';

        toast.innerHTML = `<i class="${icon}" style="font-size: 20px;"></i> <span>${message}</span>`;
        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    /* -------------------------------------------------------------------------- */
    /* 5. Policy Administration Module                                            */
    /* -------------------------------------------------------------------------- */
    function renderPolicies() {
        const query = elements.policySearch ? elements.policySearch.value.toLowerCase() : '';
        const statusVal = elements.policyStatusFilter ? elements.policyStatusFilter.value : 'all';
        const typeVal = elements.policyTypeFilter ? elements.policyTypeFilter.value : 'all';

        const filtered = state.policies.filter(p => {
            const matchesQuery = p.id.toLowerCase().includes(query) || p.name.toLowerCase().includes(query);
            const matchesStatus = statusVal === 'all' || p.status === statusVal;
            const matchesType = typeVal === 'all' || p.type === typeVal;
            return matchesQuery && matchesStatus && matchesType;
        });

        elements.policyTableBody.innerHTML = '';
        filtered.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.id}</strong></td>
                <td>${p.name}</td>
                <td>${p.type}</td>
                <td>${p.limit}</td>
                <td><strong style="color: var(--accent-secondary);">${p.premium}</strong></td>
                <td>${p.date}</td>
                <td><span class="badge badge-${p.status}">${p.status}</span></td>
                <td>
                    <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="alert('Viewing Policy Details for ${p.id}')">
                        <i class="ri-eye-line"></i> View
                    </button>
                </td>
            `;
            elements.policyTableBody.appendChild(tr);
        });

        if (elements.badgePoliciesCount) {
            elements.badgePoliciesCount.textContent = state.policies.length;
        }
    }

    // Modal Triggers
    function openPolicyModal() {
        elements.modalPolicy.classList.add('active');
    }
    function closePolicyModal() {
        elements.modalPolicy.classList.remove('active');
    }

    if (elements.btnModalNewPolicy) elements.btnModalNewPolicy.addEventListener('click', openPolicyModal);
    if (elements.btnQuickNewPolicy) elements.btnQuickNewPolicy.addEventListener('click', openPolicyModal);
    if (elements.closePolicyModal) elements.closePolicyModal.addEventListener('click', closePolicyModal);
    if (elements.cancelPolicyModal) elements.cancelPolicyModal.addEventListener('click', closePolicyModal);

    // Form Submission
    elements.formNewPolicy.addEventListener('submit', (e) => {
        e.preventDefault();
        const newId = `POL-${Math.floor(10000 + Math.random() * 90000)}`;
        const name = document.getElementById('insured-name').value;
        const type = document.getElementById('policy-type').value;
        const limit = `$${parseInt(document.getElementById('coverage-limit').value).toLocaleString()}`;
        const premium = `$${parseInt(document.getElementById('premium-amount').value).toLocaleString()}`;
        const date = new Date().toISOString().split('T')[0];

        const newPolicy = { id: newId, name, type, limit, premium, date, status: 'active' };
        state.policies.unshift(newPolicy);

        renderPolicies();
        closePolicyModal();
        elements.formNewPolicy.reset();

        showToast(`Policy ${newId} successfully issued for ${name}!`, 'success');
        addTickerLog(`POLICY_CREATED: Issued Policy #${newId} (${type}) for ${name} - Premium: ${premium}`);
    });

    if (elements.policySearch) elements.policySearch.addEventListener('input', renderPolicies);
    if (elements.policyStatusFilter) elements.policyStatusFilter.addEventListener('change', renderPolicies);
    if (elements.policyTypeFilter) elements.policyTypeFilter.addEventListener('change', renderPolicies);

    /* -------------------------------------------------------------------------- */
    /* 6. Claims Pipeline Module                                                 */
    /* -------------------------------------------------------------------------- */
    function renderClaimsPipeline() {
        const stages = ['submitted', 'assessment', 'approved', 'settled'];

        stages.forEach(stage => {
            const container = document.getElementById(`pipeline-${stage}`);
            const countBadge = document.getElementById(`count-${stage}`);
            if (!container) return;

            const stageClaims = state.claims.filter(c => c.stage === stage);
            container.innerHTML = '';
            if (countBadge) countBadge.textContent = stageClaims.length;

            stageClaims.forEach(c => {
                const card = document.createElement('div');
                card.className = 'claim-card';
                card.innerHTML = `
                    <div class="claim-card-top">
                        <span><strong>${c.id}</strong></span>
                        <span>${c.policy}</span>
                    </div>
                    <div class="claim-card-title">${c.title}</div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 8px;">${c.entity}</div>
                    <div class="claim-amount">${c.amount}</div>
                    ${stage !== 'settled' ? `
                        <button class="btn btn-secondary" style="margin-top: 10px; width: 100%; font-size: 11px; padding: 4px;" onclick="window.advanceClaim('${c.id}')">
                            Advance Stage <i class="ri-arrow-right-line"></i>
                        </button>
                    ` : ''}
                `;
                container.appendChild(card);
            });
        });

        if (elements.badgeClaimsCount) {
            elements.badgeClaimsCount.textContent = state.claims.filter(c => c.stage !== 'settled').length;
        }
    }

    window.advanceClaim = function(claimId) {
        const claim = state.claims.find(c => c.id === claimId);
        if (!claim) return;

        const nextMap = {
            'submitted': 'assessment',
            'assessment': 'approved',
            'approved': 'settled'
        };

        if (nextMap[claim.stage]) {
            const oldStage = claim.stage;
            claim.stage = nextMap[claim.stage];
            renderClaimsPipeline();
            showToast(`Claim ${claim.id} advanced to ${claim.stage.toUpperCase()} stage.`, 'success');
            addTickerLog(`CLAIM_UPDATE: Claim #${claim.id} transitioned from [${oldStage.toUpperCase()}] -> [${claim.stage.toUpperCase()}].`);
        }
    };

    /* -------------------------------------------------------------------------- */
    /* 7. Service Desk & Customer Support Module                                 */
    /* -------------------------------------------------------------------------- */
    function renderTickets() {
        const query = elements.ticketSearch ? elements.ticketSearch.value.toLowerCase() : '';
        const priorityVal = elements.ticketPriorityFilter ? elements.ticketPriorityFilter.value : 'all';

        const filtered = state.tickets.filter(t => {
            const matchesQuery = t.id.toLowerCase().includes(query) || t.customer.toLowerCase().includes(query) || t.subject.toLowerCase().includes(query);
            const matchesPriority = priorityVal === 'all' || t.priority === priorityVal;
            return matchesQuery && matchesPriority;
        });

        elements.ticketTableBody.innerHTML = '';
        filtered.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${t.id}</strong></td>
                <td>${t.customer}</td>
                <td>${t.subject}</td>
                <td><span class="badge badge-info">${t.channel}</span></td>
                <td><span class="badge badge-${t.priority.toLowerCase()}">${t.priority}</span></td>
                <td>${t.agent}</td>
                <td><span class="badge badge-${t.status}">${t.status.replace('_', ' ')}</span></td>
                <td>
                    <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="window.resolveTicket('${t.id}')">
                        Resolve Ticket
                    </button>
                </td>
            `;
            elements.ticketTableBody.appendChild(tr);
        });

        if (elements.badgeTicketsCount) {
            elements.badgeTicketsCount.textContent = state.tickets.filter(t => t.status !== 'resolved').length;
        }
    }

    window.resolveTicket = function(ticketId) {
        const ticket = state.tickets.find(t => t.id === ticketId);
        if (!ticket) return;
        ticket.status = 'resolved';
        renderTickets();
        showToast(`Ticket ${ticketId} resolved cleanly by Agent Chaithanya!`, 'success');
        addTickerLog(`TICKET_RESOLVED: Service Ticket #${ticketId} closed cleanly.`);
    };

    if (elements.ticketSearch) elements.ticketSearch.addEventListener('input', renderTickets);
    if (elements.ticketPriorityFilter) elements.ticketPriorityFilter.addEventListener('change', renderTickets);

    /* -------------------------------------------------------------------------- */
    /* 8. Interactive Charts Initialization                                      */
    /* -------------------------------------------------------------------------- */
    function initCharts() {
        // Revenue & Claims Telemetry Chart
        const ctxRevenue = document.getElementById('revenueClaimsChart');
        if (ctxRevenue) {
            new Chart(ctxRevenue.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [
                        {
                            label: 'Gross Written Premium ($k)',
                            data: [1800, 2100, 2400, 2200, 2800, 3100, 2900, 3400],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Incurred Claims Loss ($k)',
                            data: [420, 380, 510, 490, 440, 620, 580, 490],
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#9ca3af' } }
                    },
                    scales: {
                        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } },
                        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } }
                    }
                }
            });
        }

        // Policy Type Donut Chart
        const ctxType = document.getElementById('policyTypeChart');
        if (ctxType) {
            new Chart(ctxType.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Commercial Auto', 'General Liability', 'Property & Casualty', 'Cyber Risk'],
                    datasets: [{
                        data: [35, 25, 20, 20],
                        backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#a855f7'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 16 } }
                    }
                }
            });
        }
    }

    // Initial Renders
    renderPolicies();
    renderClaimsPipeline();
    renderTickets();
    initCharts();
    addTickerLog('PLATFORM_READY: Enterprise Policy Administration dashboard initialized and ready.');
});
