import React from 'react';

const ConnectWalletDoc = () => {
    return (
        <div>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Connect Wallet App</h2>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>Next.js + Wagmi</span>
            </div>
            <p>
                Le module `connectwallet` est une application Next.js autonome conçue pour être ouverte dans une popup. Elle gère la connexion au wallet (via Reown/Wagmi) et transmet l'adresse du compte connecté à la fenêtre parente (l'Extension ou la WebApp) via l'API `postMessage`.
            </p>

            <h3 style={{ fontSize: '1.3rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#e2e8f0' }}>Structure & Composants</h3>

            {/* Layout & Page */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>app/ (Next.js App Router)</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.8rem' }}>
                        <strong>layout.tsx</strong><br />
                        Envelope l'application avec le `ContextProvider` (Wagmi/QueryClient) pour la gestion de l'état Web3.
                    </li>
                    <li style={{ marginBottom: '0.8rem' }}>
                        <strong>page.tsx</strong><br />
                        Page unique qui affiche le composant `ConnectBtn` centré.
                    </li>
                </ul>
            </div>

            {/* ConnectBtn */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>components/ConnectBtn.tsx</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Le cœur de la logique d'authentification.
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>Auto-Open Modal</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                Si l'utilisateur n'est pas connecté, tente d'ouvrir automatiquement la modale Web3Modal (via `openWeb3Modal` ou clic simulé sur `w3m-button`) après 300ms.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>Communication Parent (postMessage)</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                Une fois connecté :<br />
                                1. Récupère le `signer` et l'adresse.<br />
                                2. Envoie un message à `window.opener` : <code style={{ fontSize: '0.85em' }}>{`{ type: "wallet_connected", address: "0x...", chainId: ... }`}</code>.<br />
                                3. Ferme automatiquement la fenêtre après 500ms.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Context */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>context/index.tsx</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Configuration de Wagmi et QueryClientProvider. Initie l'état avec les cookies si présents (pour SSR).
                </p>
            </div>

        </div>
    );
};

export default ConnectWalletDoc;
