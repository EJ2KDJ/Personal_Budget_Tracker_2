export async function initTransfers() {
    await loadEnvelopes();
    await loadTransfers();
    setupTransferForm();
}

let allTransfers = [];
let envelopes = [];

async function loadEnvelopes() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
        const res = await fetch(`/envelopes/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) throw new Error("Failed to fetch envelopes");
        
        const data = await res.json();
        envelopes = data.envelopes || [];

        console.log('Loaded envelopes:', envelopes);
        populateEnvelopeSelects();
    } catch (err) {
        console.error("Error loading envelopes:", err);
        alert("Error loading envelopes. Please refresh the page.");
    }
}

function populateEnvelopeSelects() {
    const fromSelect = document.getElementById('fromEnvelope');
    const toSelect = document.getElementById('toEnvelope');

    if (!fromSelect || !toSelect) return;

    fromSelect.innerHTML = '<option value="">Select envelope...</option>';
    toSelect.innerHTML = '<option value="">Select envelope...</option>';

    envelopes.forEach(env => {
        const fromOption = document.createElement('option');
        fromOption.value = env.id;
        fromOption.textContent = `${env.title} (₱${parseFloat(env.budget).toFixed(2)})`;
        fromSelect.appendChild(fromOption);

        const toOption = document.createElement('option');
        toOption.value = env.id;
        toOption.textContent = `${env.title} (₱${parseFloat(env.budget).toFixed(2)})`;
        toSelect.appendChild(toOption);
    });
}

async function loadTransfers() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    try {
        const res = await fetch(`/transfers/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to load transfers:", errorText);
            document.getElementById("transferHistory").innerHTML = "<p>Error loading transfers</p>";
            return;
        }

        const data = await res.json();
        allTransfers = data.transfers || [];

        const transferList = document.getElementById("transferHistory");
        transferList.innerHTML = "";
        
        if (allTransfers.length === 0) {
            transferList.innerHTML = "<p>No transfers found.</p>";
            return;
        }
        
        allTransfers.forEach(transfer => {
            const fromEnv = envelopes.find(e => e.id === transfer.from_envelope_id);
            const toEnv = envelopes.find(e => e.id === transfer.to_envelope_id);
            
            const transferEl = document.createElement("div");
            transferEl.classList.add("transfer-item");
            transferEl.innerHTML = `
                <p><strong>From:</strong> ${fromEnv ? fromEnv.title : 'Unknown'}</p>
                <p><strong>To:</strong> ${toEnv ? toEnv.title : 'Unknown'}</p>
                <p><strong>Amount:</strong> ₱${parseFloat(transfer.amount).toFixed(2)}</p>
                <p><strong>Date:</strong> ${new Date(transfer.date).toLocaleDateString()}</p>
            `;
            transferList.appendChild(transferEl);
        });
    } catch (err) {
        console.error("Error loading transfers:", err);
        document.getElementById("transferHistory").innerHTML = "<p>Error loading transfers</p>";
    }
}

function setupTransferForm() {
    const form = document.getElementById('transferForm');
    const fromSelect = document.getElementById('fromEnvelope');
    const toSelect = document.getElementById('toEnvelope');
    const amountInput = document.getElementById('transferAmount');
    const fromBalance = document.getElementById('fromBalance');
    const toBalance = document.getElementById('toBalance');
    const amountError = document.getElementById('amountError');

    if (!form) return;

    // Update balance display when envelope is selected
    fromSelect.addEventListener('change', () => {
        const envId = parseInt(fromSelect.value);
        const env = envelopes.find(e => e.id === envId);
        if (env) {
            fromBalance.textContent = `Available: ₱${parseFloat(env.budget).toFixed(2)}`;
        } else {
            fromBalance.textContent = '';
        }
        validateAmount();
    });

    toSelect.addEventListener('change', () => {
        const envId = parseInt(toSelect.value);
        const env = envelopes.find(e => e.id === envId);
        if (env) {
            toBalance.textContent = `Current balance: ₱${parseFloat(env.budget).toFixed(2)}`;
        } else {
            toBalance.textContent = '';
        }
    });

    amountInput.addEventListener('input', validateAmount);

    function validateAmount() {
        const fromEnvId = parseInt(fromSelect.value);
        const amount = parseFloat(amountInput.value);
        const fromEnv = envelopes.find(e => e.id === fromEnvId);

        if (fromEnv && amount > 0) {
            if (amount > parseFloat(fromEnv.budget)) {
                amountError.textContent = `Amount exceeds available balance of ₱${parseFloat(fromEnv.budget).toFixed(2)}`;
                return false;
            } else {
                amountError.textContent = '';
                return true;
            }
        }
        amountError.textContent = '';
        return true;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        const fromEnvId = parseInt(fromSelect.value);
        const toEnvId = parseInt(toSelect.value);
        const amount = parseFloat(amountInput.value);

        // Validation
        if (!fromEnvId || !toEnvId) {
            alert("Please select both envelopes");
            return;
        }

        if (fromEnvId === toEnvId) {
            alert("Cannot transfer to the same envelope");
            return;
        }

        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        if (!validateAmount()) {
            alert("Amount exceeds available balance");
            return;
        }

        const transferData = {
            from_envelope_id: fromEnvId,
            to_envelope_id: toEnvId,
            amount: amount,
            date: new Date().toISOString()
        };

        console.log('Sending transfer:', transferData);

        try {
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';

            const res = await fetch(`/transfers`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transferData),
            });

            const responseData = await res.json();
            console.log('Transfer response:', responseData);

            if (res.ok) {
                alert("Transfer created successfully!");
                form.reset();
                fromBalance.textContent = '';
                toBalance.textContent = '';
                amountError.textContent = '';
                await loadEnvelopes(); // Reload to get updated balances
                await loadTransfers();
            } else {
                alert(`Error: ${responseData.error || responseData.message || 'Failed to create transfer'}`);
            }
        } catch (err) {
            console.error("Error creating transfer:", err);
            alert("Error creating transfer");
        } finally {
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Transfer Funds';
        }
    });
}