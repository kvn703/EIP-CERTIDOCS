import React from 'react';

const ContractDoc = () => {
    return (
        <div>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Smart Contract</h2>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>Solidity 0.8.19</span>
            </div>
            <p>
                Le contrat intelligent `SignatureRegistry` est la source de vérité immuable. Il est déployé sur Ethereum (ou L2 compatible EVM) et stocke les preuves cryptographiques.
            </p>

            <h3 style={{ fontSize: '1.3rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#e2e8f0' }}>Contrat : SignatureRegistry.sol</h3>

            {/* storeSignature */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>function storeSignature(...)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Enregistre une nouvelle signature sur la blockchain.
                </p>
                <div style={{ marginTop: '1rem', background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <code style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        function storeSignature(<br />
                        &nbsp;&nbsp;bytes32 _messageHash,<br />
                        &nbsp;&nbsp;uint256 _expiration,<br />
                        &nbsp;&nbsp;address[] memory _authorizedRecipients,<br />
                        &nbsp;&nbsp;bytes memory _signature,<br />
                        &nbsp;&nbsp;uint256 _timestamp<br />
                        ) external
                    </code>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Logique :</strong><br />
                            1. Appelle `recoverSigner` pour vérifier que `msg.sender` est bien le signataire du `_messageHash`. Revert si invalide.<br />
                            2. Génère un `signatureId` unique via `keccak256(abi.encodePacked(msg.sender, _messageHash, _timestamp))`.<br />
                            3. Stocke les données dans le mapping `signatures`.<br />
                            4. Émet l'événement `SignatureStored`.
                        </li>
                    </ul>
                </div>
            </div>

            {/* verifySignature */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>function verifySignature(...)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Vérifie la validité d'une signature enregistrée. Fonction `view` (gratuite en lecture).
                </p>
                <div style={{ marginTop: '1rem', background: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <code style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                        function verifySignature(<br />
                        &nbsp;&nbsp;bytes32 _signatureId,<br />
                        &nbsp;&nbsp;address _recipient,<br />
                        &nbsp;&nbsp;bytes32 _messageHash<br />
                        ) external view returns (bool, address, address, bytes32, bytes32)
                    </code>
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Logique :</strong><br />
                            1. Récupère les données depuis `signatures[_signatureId]`.<br />
                            2. Vérifie si `_recipient` est dans la liste `authorizedRecipients` (si la liste n'est pas vide).<br />
                            3. Vérifie que le `messageHash` correspond.<br />
                            4. Vérifie que la signature n'est pas expirée (`block.timestamp &lt;= expiration`).<br />
                            5. Retourne un tuple avec le booléen de validité et les métadonnées.
                        </li>
                    </ul>
                </div>
            </div>

            {/* recoverSigner */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>function recoverSigner(...)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Fonction utilitaire interne cryptographique.
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <strong>Logique :</strong><br />
                            1. Découpe la signature brute (bytes) en composantes `r`, `s`, `v` via assembleur inline (Yul).<br />
                            2. Préfixe le message selon le standard EIP-191 (`\x19Ethereum Signed Message:\n32`).<br />
                            3. Utilise `ecrecover` pour retrouver l'adresse publique ayant signé le hash.
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default ContractDoc;
